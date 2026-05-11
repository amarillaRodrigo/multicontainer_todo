const mongoose = require("mongoose");
const { BadRequestError, NotFoundError } = require("../errors/http-error");

function createTodoService(todoRepository) {
  function validarId(id) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestError("Id inválido");
    }
  }

  function normalizarCambios(cambios) {
    const actualizacion = {};

    if (Object.prototype.hasOwnProperty.call(cambios, "title")) {
      actualizacion.title = cambios.title;
    }
    if (Object.prototype.hasOwnProperty.call(cambios, "description")) {
      actualizacion.description = cambios.description;
    }
    if (Object.prototype.hasOwnProperty.call(cambios, "completed")) {
      actualizacion.completed = cambios.completed;
    }

    return actualizacion;
  }

  async function crearTodo(input) {
    return todoRepository.createTodo({
      title: input.title,
      description: input.description,
    });
  }

  async function listarTodos() {
    return todoRepository.findTodos();
  }

  async function obtenerTodoPorId(id) {
    validarId(id);
    const todo = await todoRepository.findTodoById(id);
    if (!todo) {
      throw new NotFoundError("TODO no encontrado");
    }
    return todo;
  }

  async function actualizarTodoParcial(id, cambios) {
    validarId(id);
    const todo = await todoRepository.updateTodoById(id, normalizarCambios(cambios));
    if (!todo) {
      throw new NotFoundError("TODO no encontrado");
    }
    return todo;
  }

  async function eliminarTodo(id) {
    validarId(id);
    const eliminado = await todoRepository.deleteTodoById(id);
    if (!eliminado) {
      throw new NotFoundError("TODO no encontrado");
    }
  }

  return {
    crearTodo,
    listarTodos,
    obtenerTodoPorId,
    actualizarTodoParcial,
    eliminarTodo,
  };
}

module.exports = {
  createTodoService,
};
