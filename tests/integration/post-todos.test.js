const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const { createApp } = require("../../src/app");

describe("POST /todos", () => {
  let mongoServer;
  let app;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    app = createApp();
  });

  beforeEach(async () => {
    await mongoose.connection.collection("todos").deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  it("crea un TODO persistente y devuelve la respuesta esperada", async () => {
    const crearRespuesta = await request(app).post("/todos").send({
      title: "Comprar pan",
      description: "Integral",
    });

    expect(crearRespuesta.status).toBe(201);
    expect(crearRespuesta.body).toEqual(
      expect.objectContaining({
        title: "Comprar pan",
        description: "Integral",
        completed: false,
      }),
    );
    expect(crearRespuesta.body).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );

    const listarRespuesta = await request(app).get("/todos");

    expect(listarRespuesta.status).toBe(200);
    expect(listarRespuesta.body).toHaveLength(1);
    expect(listarRespuesta.body[0]).toEqual(
      expect.objectContaining({
        _id: crearRespuesta.body._id,
        title: "Comprar pan",
        description: "Integral",
        completed: false,
      }),
    );
  });

  it("responde 400 al crear un TODO sin title", async () => {
    const respuesta = await request(app).post("/todos").send({
      description: "Sin titulo",
    });

    expect(respuesta.status).toBe(400);
    expect(respuesta.body).toEqual(
      expect.objectContaining({
        error: expect.any(String),
      }),
    );
  });

  it("responde 400 al crear un TODO con title vacio", async () => {
    const respuesta = await request(app).post("/todos").send({
      title: "   ",
      description: "Titulo invalido",
    });

    expect(respuesta.status).toBe(400);
    expect(respuesta.body).toEqual(
      expect.objectContaining({
        error: expect.any(String),
      }),
    );
  });

  it("devuelve un TODO por id cuando existe", async () => {
    const creado = await request(app).post("/todos").send({
      title: "Pagar luz",
    });

    const respuesta = await request(app).get(`/todos/${creado.body._id}`);

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual(
      expect.objectContaining({
        _id: creado.body._id,
        title: "Pagar luz",
        completed: false,
      }),
    );
  });

  it("responde 400 al consultar por id inválido", async () => {
    const respuesta = await request(app).get("/todos/id-invalido");

    expect(respuesta.status).toBe(400);
    expect(respuesta.body).toEqual(
      expect.objectContaining({
        error: expect.any(String),
      }),
    );
  });

  it("responde 404 al consultar un TODO inexistente", async () => {
    const idInexistente = new mongoose.Types.ObjectId().toString();
    const respuesta = await request(app).get(`/todos/${idInexistente}`);

    expect(respuesta.status).toBe(404);
    expect(respuesta.body).toEqual(
      expect.objectContaining({
        error: expect.any(String),
      }),
    );
  });

  it("actualiza parcialmente un TODO existente", async () => {
    const creado = await request(app).post("/todos").send({
      title: "Estudiar",
      description: "Node.js",
    });

    const actualizacion = await request(app).put(`/todos/${creado.body._id}`).send({
      completed: true,
    });

    expect(actualizacion.status).toBe(200);
    expect(actualizacion.body).toEqual(
      expect.objectContaining({
        _id: creado.body._id,
        title: "Estudiar",
        description: "Node.js",
        completed: true,
      }),
    );
  });

  it("responde 400 al actualizar un TODO con id inválido", async () => {
    const respuesta = await request(app).put("/todos/id-invalido").send({
      completed: true,
    });

    expect(respuesta.status).toBe(400);
    expect(respuesta.body).toEqual(
      expect.objectContaining({
        error: expect.any(String),
      }),
    );
  });

  it("responde 404 al actualizar un TODO inexistente", async () => {
    const idInexistente = new mongoose.Types.ObjectId().toString();
    const respuesta = await request(app).put(`/todos/${idInexistente}`).send({
      completed: true,
    });

    expect(respuesta.status).toBe(404);
    expect(respuesta.body).toEqual(
      expect.objectContaining({
        error: expect.any(String),
      }),
    );
  });

  it("elimina un TODO existente y deja de estar disponible", async () => {
    const creado = await request(app).post("/todos").send({
      title: "Eliminar",
    });

    const eliminacion = await request(app).delete(`/todos/${creado.body._id}`);
    expect(eliminacion.status).toBe(204);

    const consulta = await request(app).get(`/todos/${creado.body._id}`);
    expect(consulta.status).toBe(404);
  });

  it("responde 404 al eliminar un TODO inexistente", async () => {
    const idInexistente = new mongoose.Types.ObjectId().toString();
    const respuesta = await request(app).delete(`/todos/${idInexistente}`);

    expect(respuesta.status).toBe(404);
    expect(respuesta.body).toEqual(
      expect.objectContaining({
        error: expect.any(String),
      }),
    );
  });
});
