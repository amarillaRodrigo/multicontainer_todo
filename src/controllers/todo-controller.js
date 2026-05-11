function createTodoController(todoService) {
  async function crearTodo(req, res, next) {
    try {
      const todo = await todoService.crearTodo(req.body ?? {});
      return res.status(201).json(todo.toObject());
    } catch (error) {
      return next(error);
    }
  }

  async function listarTodos(_req, res, next) {
    try {
      const todos = await todoService.listarTodos();
      return res.status(200).json(todos.map((todo) => todo.toObject()));
    } catch (error) {
      return next(error);
    }
  }

  async function obtenerTodoPorId(req, res, next) {
    try {
      const todo = await todoService.obtenerTodoPorId(req.params.id);
      return res.status(200).json(todo.toObject());
    } catch (error) {
      return next(error);
    }
  }

  async function actualizarTodoParcial(req, res, next) {
    try {
      const todo = await todoService.actualizarTodoParcial(req.params.id, req.body ?? {});
      return res.status(200).json(todo.toObject());
    } catch (error) {
      return next(error);
    }
  }

  async function eliminarTodo(req, res, next) {
    try {
      await todoService.eliminarTodo(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return next(error);
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
  createTodoController,
};
