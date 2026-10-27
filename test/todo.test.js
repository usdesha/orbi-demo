import { test } from "node:test";
import assert from "node:assert/strict";
import { addTodo, toggleTodo, removeTodo, visibleTodos, clearCompleted, hasCompleted } from "../src/todo.js";

test("addTodo appends a trimmed title with the next id", () => {
  const one = addTodo([], "  Buy milk ");
  assert.deepEqual(one, [{ id: 1, title: "Buy milk", done: false }]);
  assert.equal(addTodo(one, "Walk dog")[1].id, 2);
});

test("addTodo ignores an empty title", () => {
  assert.deepEqual(addTodo([], "   "), []);
});

test("toggleTodo flips only the matching todo", () => {
  const todos = addTodo(addTodo([], "a"), "b");
  const toggled = toggleTodo(todos, 2);
  assert.equal(toggled[0].done, false);
  assert.equal(toggled[1].done, true);
});

test("removeTodo drops the matching todo", () => {
  const todos = addTodo(addTodo([], "a"), "b");
  assert.deepEqual(removeTodo(todos, 1).map((t) => t.title), ["b"]);
});

test("clearCompleted removes only completed todos", () => {
  const todos = [
    { id: 1, title: "done one", done: true },
    { id: 2, title: "active one", done: false },
    { id: 3, title: "done two", done: true },
    { id: 4, title: "active two", done: false },
  ];
  assert.deepEqual(clearCompleted(todos), [
    { id: 2, title: "active one", done: false },
    { id: 4, title: "active two", done: false },
  ]);
  assert.equal(todos.length, 4, "the input list is not mutated");
});

test("clearCompleted leaves the list alone when nothing is completed", () => {
  const todos = addTodo(addTodo([], "a"), "b");
  assert.deepEqual(clearCompleted(todos), todos);
  assert.deepEqual(clearCompleted([]), []);
});

test("hasCompleted is true only while a completed todo exists", () => {
  const active = addTodo(addTodo([], "a"), "b");
  assert.equal(hasCompleted(active), false);
  const mixed = toggleTodo(active, 2);
  assert.equal(hasCompleted(mixed), true);
  assert.equal(hasCompleted(clearCompleted(mixed)), false);
  assert.equal(hasCompleted([]), false);
});

test("visibleTodos filters by active and done", () => {
  const todos = toggleTodo(addTodo(addTodo([], "a"), "b"), 1);
  assert.deepEqual(visibleTodos(todos, "active").map((t) => t.title), ["b"]);
  assert.deepEqual(visibleTodos(todos, "done").map((t) => t.title), ["a"]);
  assert.equal(visibleTodos(todos, "all").length, 2);
});
