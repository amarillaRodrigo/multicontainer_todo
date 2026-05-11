const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");

describe("Rebanada 9 - reverse proxy local con Nginx", () => {
  it("define config de Nginx para rutear todo.local hacia la API", () => {
    const nginxConfPath = path.join(repoRoot, "infra", "nginx", "default.conf");
    const contenido = fs.readFileSync(nginxConfPath, "utf8");

    expect(contenido).toContain("server_name todo.local");
    expect(contenido).toContain("location /");
    expect(contenido).toContain("proxy_pass http://api:3000");
  });

  it("integra Nginx al compose de produccion conviviendo con API y Mongo", () => {
    const composeProdPath = path.join(repoRoot, "docker-compose.prod.yml");
    const contenido = fs.readFileSync(composeProdPath, "utf8");

    expect(contenido).toContain("nginx:");
    expect(contenido).toContain("image: nginx:1.27-alpine");
    expect(contenido).toContain("- \"80:80\"");
    expect(contenido).toContain("./infra/nginx/default.conf:/etc/nginx/conf.d/default.conf:ro");
    expect(contenido).toContain("depends_on:");
    expect(contenido).toContain("- api");
  });

  it("documenta verificacion reproducible de acceso por hostname local", () => {
    const readmePath = path.join(repoRoot, "README.md");
    const contenido = fs.readFileSync(readmePath, "utf8");

    expect(contenido).toContain("todo.local");
    expect(contenido).toContain("127.0.0.1 todo.local");
    expect(contenido).toContain("curl http://todo.local/todos");
  });

  it("incluye en Ansible el copiado de la config de Nginx para despliegue en VM", () => {
    const deployPlaybookPath = path.join(repoRoot, "infra", "ansible", "playbooks", "deploy.yml");
    const contenido = fs.readFileSync(deployPlaybookPath, "utf8");

    expect(contenido).toContain("Crear directorio de configuracion de Nginx");
    expect(contenido).toContain("Copiar configuracion de Nginx");
    expect(contenido).toContain("infra/nginx/default.conf");
    expect(contenido).toContain("{{ app_dir }}/infra/nginx/default.conf");
  });
});
