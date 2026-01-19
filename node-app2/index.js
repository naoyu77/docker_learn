const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// 静的ファイルの配信
app.use(express.static(path.join(__dirname, 'public')));

// JSONボディのパース
app.use(express.json());

// メモリ上のデータストア
let todos = [
  { id: 1, title: 'Dockerを学ぶ', done: true },
  { id: 2, title: 'Dockerfileを書く', done: true },
  { id: 3, title: 'Docker Composeを学ぶ', done: false },
];

// ルート
app.get('/', (req, res) => {
  res.json({
    message: 'Todo API Server',
    endpoints: {
      'GET /todos': '全てのTodoを取得',
      'GET /todos/:id': '特定のTodoを取得',
      'POST /todos': 'Todoを追加',
      'PUT /todos/:id': 'Todoを更新',
      'DELETE /todos/:id': 'Todoを削除',
    },
  });
});

// 全Todo取得
app.get('/todos', (req, res) => {
  res.json(todos);
});

// 特定のTodo取得
app.get('/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  res.json(todo);
});

// Todo追加
app.post('/todos', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'title is required' });
  }
  const newTodo = {
    id: todos.length > 0 ? Math.max(...todos.map((t) => t.id)) + 1 : 1,
    title,
    done: false,
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Todo更新
app.put('/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  if (req.body.title !== undefined) todo.title = req.body.title;
  if (req.body.done !== undefined) todo.done = req.body.done;
  res.json(todo);
});

// Todo削除
app.delete('/todos/:id', (req, res) => {
  const index = todos.findIndex((t) => t.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  const deleted = todos.splice(index, 1);
  res.json(deleted[0]);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
