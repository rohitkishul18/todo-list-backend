const Todo = require('../models/todo.model');


exports.createTodo = async (req, res) => {
  try {
    const todo = await Todo.create(req.body);
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getTodos = async (req, res) => {
    try{
  const todos = await Todo.find().sort({ createdAt: -1 });
   res.status(201).json(todos);
    }
    catch(err){
       res.status(400).json({ error: err.message }); 
    }
};


exports.deleteTodo = async (req, res) => {
 try{
    const todos =  await Todo.findByIdAndDelete(req.params.id);
    res.status(201).json(todos);
 }catch(err){
     res.status(400).json({ error: err.message }); 
 }
};


exports.updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
