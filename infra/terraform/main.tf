terraform {
  required_version = ">= 1.6.0"

  required_providers {
    vagrant = {
      source  = "bmatcuk/vagrant"
      version = "~> 4.0"
    }
  }
}

provider "vagrant" {}

resource "vagrant_vm" "app_vm" {
  name = var.vm_name
  box = var.vm_box
}
