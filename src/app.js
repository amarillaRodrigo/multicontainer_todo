const express = require("express");
const { createTodoController } = require("./controllers/todo-controller");
const { createTodoService } = require("./services/todo-service");
const todoRepository = require("./repositories/todo-repository");

function createApp() {
  const app = express();
  const todoService = createTodoService(todoRepository);
  const todoController = createTodoController(todoService);

  app.use(express.json());

  app.post("/todos", todoController.crearTodo);
  app.get("/todos", todoController.listarTodos);
  app.get("/todos/:id", todoController.obtenerTodoPorId);
  app.put("/todos/:id", todoController.actualizarTodoParcial);
  app.delete("/todos/:id", todoController.eliminarTodo);

  app.use((error, _req, res, _next) => {
    if (typeof error?.statusCode === "number") {
      return res.status(error.statusCode).json({ error: error.message });
    }
    if (error?.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: "Error interno del servidor" });
  });

  return app;
}

module.exports = { createApp };
