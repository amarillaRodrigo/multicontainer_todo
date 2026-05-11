const { Todo } = require("../models/todo");

function createTodo(data) {
  return Todo.create(data);
}

function findTodos() {
  return Todo.find().sort({ createdAt: 1 });
}

function findTodoById(id) {
  return Todo.findById(id);
}

function updateTodoById(id, changes) {
  return Todo.findByIdAndUpdate(id, changes, {
    returnDocument: "after",
    runValidators: true,
  });
}

function deleteTodoById(id) {
  return Todo.findByIdAndDelete(id);
}

module.exports = {
  createTodo,
  findTodos,
  findTodoById,
  updateTodoById,
  deleteTodoById,
};
