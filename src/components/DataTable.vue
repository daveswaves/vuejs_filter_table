<!-- components/DataTable.vue -->
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