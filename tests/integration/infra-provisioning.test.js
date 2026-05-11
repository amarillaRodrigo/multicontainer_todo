const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");

describe("Rebanada 7 - provisionamiento local reproducible", () => {
  it("define infraestructura Terraform para VM local declarativa y repetible", () => {
    const mainTfPath = path.join(repoRoot, "infra", "terraform", "main.tf");
    const variablesTfPath = path.join(repoRoot, "infra", "terraform", "variables.tf");

    const mainTf = fs.readFileSync(mainTfPath, "utf8");
    const variablesTf = fs.readFileSync(variablesTfPath, "utf8");

    expect(mainTf).toContain("resource \"vagrant_vm\"");
    expect(mainTf).toContain("box = var.vm_box");
    expect(mainTf).toContain("name = var.vm_name");
    expect(variablesTf).toContain("variable \"vm_name\"");
    expect(variablesTf).toContain("variable \"vm_box\"");
  });

  it("define playbook de Ansible para instalar Docker y Docker Compose", () => {
    const playbookPath = path.join(repoRoot, "infra", "ansible", "playbooks", "bootstrap.yml");
    const contenido = fs.readFileSync(playbookPath, "utf8");

    expect(contenido).toContain("- hosts: todo_vm");
    expect(contenido).toContain("name: Instalar Docker");
    expect(contenido).toContain("name: Instalar plugin Docker Compose");
  });

  it("define playbook de despliegue automatizado con docker compose en la VM", () => {
    const deployPath = path.join(repoRoot, "infra", "ansible", "playbooks", "deploy.yml");
    const contenido = fs.readFileSync(deployPath, "utf8");

    expect(contenido).toContain("- hosts: todo_vm");
    expect(contenido).toContain("name: Copiar compose de produccion");
    expect(contenido).toContain("docker compose -f docker-compose.prod.yml up -d");
    expect(contenido).toContain("TODO_API_IMAGE");
  });
});
