// 'Express.js' lets us create a lightweight web server (listening on port 3000) that 
// handles HTTP requests and allows a /tasks route to be defined that returns JSON data. 
// It enables the use of 'CORS' middleware, which to allows allows the frontend to make 
// requests to the backend.
import express from 'express';
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