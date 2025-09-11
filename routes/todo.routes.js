const express = require("express");
const router = express.Router();
const todoCtrl = require('../controllers/todo.controller')

router.post("/", todoCtrl.createTodo);
router.get("/", todoCtrl.getTodos);
router.put("/:id", todoCtrl.updateTodo);
router.delete("/:id", todoCtrl.deleteTodo);

module.exports = router;