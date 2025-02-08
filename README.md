# Vue JS - Filter Table Component

[YouTube](https://youtu.be/au27CwIFHzs)

Setup / Running Application
```sh
# Setup 
git clone git@github.com:daveswaves/vuejs_filter_table.git
npm install

# Run the backend
node backend/index.js

# Run Vue JS as usual
npm run dev

# Alternatively, run 'dev.js' script (see comments at top of script)
# to start backend & frontend simultaneously.
node dev.js

# Tip: To disable Copilot suggestions (Ctrl+Shift+P and type 'di cop').
# The following option will appear: "Enable/Disable Copilot completions"
# Assign to key binding:
# Ctrl+Shift+P "Preferences: Open Keyboard Shortcuts", and search "Enable/Disable Copilot suggestions".
# Assign required key combination: Alt+C Alt+P
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
│   │   ├── DataTable.vue
│   │   ├── FilterDropdown.vue
│   │   ├── FilterRadios.vue
│   │   └── SearchForm.vue
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
    "user": { "name": "Charlie Brown" },
    "status": "Completed",
    "title": "Optimize frontend performance",
    "due_at": "2025-01-28"
  },
  {
    "id": 3,
    "user": { "name": "Alice Johnson" },
    "status": "Not Started", 
    "title": "Design database schema for new project",
    "due_at": "2025-02-06"
  },
  {
    "id": 4,
    "user": { "name": "Mike Myers" },
    "status": "In Progress", 
    "title": "Mock database data for new project",
    "due_at": "2025-02-07"
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
import { computed, ref } from 'vue';

import SearchForm from '@/components/SearchForm.vue'
import FilterRadios from '@/components/FilterRadios.vue'
import FilterDropdown from '@/components/FilterDropdown.vue'

const searchFilter = ref('');
const radioFilter = ref('');
const statusesFilter = ref([]);

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})

const filteredItems = computed(() => {
  let items = props.items;
  const today = new Date();
  const fmtToday = today.toISOString().split('T')[0]; // converts to yyyy-mm-dd

  switch (radioFilter.value) {
    case 'today':
      items = items.filter(item => {
        const itemDate = new Date(item.due_at);
        return item.due_at == fmtToday;
      });
      break;
    case 'past':
      items = items.filter(item => {
        const itemDate = new Date(item.due_at);
        return item.due_at < fmtToday;
      });
      break;
  }

  if (statusesFilter.value.length) {
    items = items.filter(item => statusesFilter.value.includes(item.status));
  }

  if (searchFilter.value && searchFilter.value.trim() !== '') {
    const searchLc = searchFilter.value.toLowerCase();
    items = items.filter(item => 
      item.status.toLowerCase().includes(searchLc) ||
      item.title.toLowerCase().includes(searchLc) ||
      item.user.name.toLowerCase().includes(searchLc)
    );
  }

  return items;
});

const handelSearch = (search) => {
  searchFilter.value = search;
};

const handelRadioFilter = (filter) => {
  radioFilter.value = filter;
};

const handleCheckboxFilter = (filter) => {
  if (statusesFilter.value.includes(filter)) {
    return statusesFilter.value.splice(statusesFilter.value.indexOf(filter), 1);
  }
  return statusesFilter.value.push(filter);
};
</script>

<template>
  <div class="flex items-center justify-between">
    <!-- Search bar -->
    <SearchForm @search="handelSearch" />
    <div class="flex items-center justify-end text-sm font-semibold">
      <!-- Radio buttons -->
      <FilterRadios @filter="handelRadioFilter" />
      <!-- List of filters for statuses -->
      <FilterDropdown :items="items" @filter="handleCheckboxFilter" />
    </div>
  </div>
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
      <tr v-for="item in filteredItems" :key="item.id" class="border-b">
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
  <div class="bg-red relative border rounded-lg"></div>
</template>
```


FILE: src/components/FilterDropdown.vue
```html
<script setup>
import { ref, computed } from 'vue';

const show = ref(false);

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})

const statuses = computed(() => {
  return [...new Set(props.items.map(item => item.status))];
});

const emit = defineEmits(['filter']);

const filter = (e) => {
  emit('filter', e.target.value);
}
</script>

<template>
  <div class="relative flex items-center w-full px-4">
    <button @click="show = !show" class="w-full flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900">
      Filter
    </button>
    <div v-if="show" class="absolute top-12 right-0 z-10 w-48 p-3 bg-white rounded-lg shadow">
      <h6 class="mb-3 text-sm font-medium text-gray-900">Status</h6>
      <ul class="space-y-2 text-sm">
        <li v-for="(status, index) in statuses">
          <input :id="`filter_option_${index}`" @change="filter" type="checkbox" :value="status" class="w-4 h-4 bg-gray-300 rounded text-gray-900">
          <label :for="`filter_option_${index}`" class="ml-2 text-sm font-medium text-gray-900">{{ status }}</label>
        </li>
      </ul>
    </div>
  </div>
</template>
```


FILE: src/components/FilterRadios.vue
```html
<script setup>
const emit = defineEmits(['filter']);

const filter = (e) => {
  emit('filter', e.target.value);
};
</script>

<template>
  <label class="flex mr-4 items-center flex-nowrap">
    <input type="radio" name="show" value="all" checked @change="filter">
    <span class="whitespace-nowrap ml-1">Show All</span>
  </label>
  <label class="flex mr-4 items-center flex-nowrap">
    <input type="radio" name="show" value="today" @change="filter">
    <span class="whitespace-nowrap ml-1">Due Today</span>
  </label>
  <label class="flex mr-4 items-center flex-nowrap">
    <input type="radio" name="show" value="past" @change="filter">
    <span class="whitespace-nowrap ml-1">Past Due</span>
  </label>
</template>
```


FILE: src/components/SearchForm.vue
```html
<script setup>
const emit = defineEmits(['search']);

const search = (e) => {
  emit('search', e.target.value);
};
</script>

<template>
  <form class="py-3 px-4 flex items-center">
    <label class="sr-only">Search</label>
    <div class="relative w-full">
      <input type="text" @input="search" placeholder="Search" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-md py-0.2 px-0.5">
    </div>
  </form>
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
