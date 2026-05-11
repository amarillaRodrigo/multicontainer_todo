const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");

describe("Rebanada 8 - CI/CD con runner self-hosted", () => {
  it("define workflow para build y push de imagen a Docker Hub", () => {
    const workflowPath = path.join(repoRoot, ".github", "workflows", "ci-cd.yml");
    const contenido = fs.readFileSync(workflowPath, "utf8");

    expect(contenido).toContain("name: CI-CD");
    expect(contenido).toContain("push:");
    expect(contenido).toContain("build_and_push:");
    expect(contenido).toContain("docker/login-action");
    expect(contenido).toContain("docker/build-push-action");
    expect(contenido).toContain("push: true");
  });

  it("define job de deploy en runner self-hosted usando compose de produccion", () => {
    const workflowPath = path.join(repoRoot, ".github", "workflows", "ci-cd.yml");
    const contenido = fs.readFileSync(workflowPath, "utf8");

    expect(contenido).toContain("deploy:");
    expect(contenido).toContain("runs-on: self-hosted");
    expect(contenido).toContain("needs: build_and_push");
    expect(contenido).toContain("ansible-playbook playbooks/deploy.yml");
    expect(contenido).toContain("TODO_API_IMAGE");
  });

  it("encadena build y deploy end-to-end sin pasos manuales centrales", () => {
    const workflowPath = path.join(repoRoot, ".github", "workflows", "ci-cd.yml");
    const contenido = fs.readFileSync(workflowPath, "utf8");

    expect(contenido).toContain("push:");
    expect(contenido).toContain("- main");
    expect(contenido).toContain("needs: build_and_push");
    expect(contenido).toContain("ansible-playbook playbooks/bootstrap.yml");
    expect(contenido).toContain("ansible-playbook playbooks/deploy.yml");
  });
});
