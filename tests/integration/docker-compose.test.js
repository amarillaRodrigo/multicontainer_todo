const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");

describe("Empaquetado multi-contenedor", () => {
  it("define un entorno de desarrollo con recarga para la API", () => {
    const composePath = path.join(repoRoot, "docker-compose.yml");
    const contenido = fs.readFileSync(composePath, "utf8");

    expect(contenido).toContain("api:");
    expect(contenido).toContain("command: npm run dev");
    expect(contenido).toContain("- .:/app");
  });

  it("define un entorno de produccion que usa imagen publicable sin nodemon", () => {
    const composePath = path.join(repoRoot, "docker-compose.prod.yml");
    const contenido = fs.readFileSync(composePath, "utf8");

    expect(contenido).toContain("api:");
    expect(contenido).toContain("image:");
    expect(contenido).toContain("command: npm start");
    expect(contenido).not.toContain("npm run dev");
  });

  it("incluye reglas de .dockerignore para builds reproducibles de imagen", () => {
    const dockerignorePath = path.join(repoRoot, ".dockerignore");
    const contenido = fs.readFileSync(dockerignorePath, "utf8");

    expect(contenido).toContain("node_modules");
    expect(contenido).toContain(".git");
  });

  it("configura volumen nombrado de MongoDB para mantener datos tras reinicios", () => {
    const devCompose = fs.readFileSync(path.join(repoRoot, "docker-compose.yml"), "utf8");
    const prodCompose = fs.readFileSync(
      path.join(repoRoot, "docker-compose.prod.yml"),
      "utf8",
    );

    expect(devCompose).toContain("- mongo_data:/data/db");
    expect(devCompose).toContain("mongo_data:");
    expect(prodCompose).toContain("- mongo_data:/data/db");
    expect(prodCompose).toContain("mongo_data:");
  });
});
