output "vm_name" {
  description = "Nombre de la VM creada por Terraform"
  value       = vagrant_vm.app_vm.name
}
