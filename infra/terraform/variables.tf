variable "vm_name" {
  description = "Nombre de la VM local"
  type        = string
  default     = "todo-vm"
}

variable "vm_box" {
  description = "Box de Vagrant para aprovisionar la VM"
  type        = string
  default     = "ubuntu/jammy64"
}
