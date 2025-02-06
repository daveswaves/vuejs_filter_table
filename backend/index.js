import express from 'express';
// CORS middleware allows your frontend to make requests to the backend.
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Read tasks from JSON file
const readTasks = () => {
  const tasksPath = path.join(__dirname, 'data', 'tasks.json');
  const tasksData = fs.readFileSync(tasksPath, 'utf8');
  return JSON.parse(tasksData);
};

// GET all tasks
app.get('/tasks', (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;