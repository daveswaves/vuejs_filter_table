# Vue JS - Filter Table Component

[YouTube](https://youtu.be/au27CwIFHzs)

Running Application
```sh
# Install dependencies
npm install express cors

# Run the backend
node backend/index.js

# Run Vue JS as usual
npm run dev
```

### Project
Employs computed properties, events, fetch requests and emits to create a filter and search table with Vue 3 and the Composition API.

`Express.js` lets us create a lightweight web server (listening on port 3000) that handles HTTP requests and allows a /tasks route to be defined that returns JSON data. It enables the use of `CORS` middleware, which to allows allows the frontend to make requests to the backend.

Project Directory Structure
```
filter_table/
│
├── backend
│   ├── data
│   │   └── tasks.json
│   └── index.js
│
├── src
│   ├── assets
│   │   └── main.css
│   ├── components
│   │   └── DataTable.vue
│   └── App.vue
│
├── index.html
└── package.json
```

FILE: backend/data/task.js
```sh
[
  {
    "id": 1,
    "user": { "name": "Bob Smith" },
    "status": "In Progress",
    "title": "Implement user authentication system",
    "due_at": "2025-03-19"
  },
  {
    "id": 2,
    "user": { "name": "Alice Johnson" },
    "status": "Not Started", 
    "title": "Design database schema for new project",
    "due_at": "2025-04-15"
  },
  {
    "id": 3,
    "user": { "name": "Charlie Brown" },
    "status": "Completed",
    "title": "Optimize frontend performance",
    "due_at": "2025-02-28"
  }
]
```

FILE: backend/index.js
```js
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
```

FILE: src/assets/main.css
```css
/* @import './base.css'; */

/* TailWind CDN */
@import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
```

FILE: src/components/DataTable.vue
```html
<script setup>
  defineProps({
    items: {
      type: Array,
      required: true
    }
  })
</script>

<template>
  <table class="w-full text-sm text-left">
    <thead class="text-xs text-gray-700 uppercase bg-gray-50">
      <tr>
        <th class="px-4 py-3">ID</th>
        <th class="px-4 py-3">Assigned To</th>
        <th class="px-4 py-3">Status</th>
        <th class="px-4 py-3">Title</th>
        <th class="px-4 py-3">Due At</th>
        <th class="px-4 py-3">
          <span class="sr-only">Actions</span>
        </th>
      </tr>
    </thead>
    <tbody class="text-gray-500">
      <tr v-for="item in items" :key="item.id" class="border-b">
        <td class="px-4 py-3">{{ item.id }}</td>
        <td class="px-4 py-3">{{ item.user.name }}</td>
        <td class="px-4 py-3">{{ item.status }}</td>
        <td class="px-4 py-3">{{ item.title }}</td>
        <td class="px-4 py-3">{{ item.due_at }}</td>
        <td class="px-4 py-3 flex items-center justify-end">
          <a href="#" class="text-indigo-500 hover:underline">Details</a>
        </td>
      </tr>
    </tbody>
  </table>
</template>
```

FILE: src/App.vue
```html
<script setup>
import DataTable from '@/components/DataTable.vue'
import { onMounted, ref } from 'vue';

const items = ref([]);

onMounted(async () => {
  const response = await fetch('http://localhost:3000/tasks');
  items.value = await response.json();
});
</script>

<template>
  <div class="">
    <DataTable :items="items" />
  </div>
</template>
```

FILE: index.html
```html
<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="UTF-8">
    <link rel="icon" href="/favicon.ico">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Filter Table</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

FILE: package.json
```json
{
  "name": "filter_table",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.21.2",
    "vue": "^3.5.13"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.1",
    "vite": "^6.0.11",
    "vite-plugin-vue-devtools": "^7.7.0"
  }
}
```
