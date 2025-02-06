<!-- components/DataTable.vue -->
<script setup>
import { computed, ref } from 'vue';

import SearchForm from '@/components/SearchForm.vue'
import FilterRadios from '@/components/FilterRadios.vue'
import FilterDropdown from '@/components/FilterDropdown.vue'

const searchFilter = ref('')

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})

const filteredItems = computed(() => {
  // return props.items.filter(item => item.status == 'Not Started')
  if (searchFilter.value.trim() != '') {
    const searchLc = searchFilter.value.toLowerCase();
    
    return props.items.filter(item =>
      item.status.toLowerCase().includes(searchLc) ||
      item.title.toLowerCase().includes(searchLc) ||
      item.user.name.toLowerCase().includes(searchLc)
    );
  }

  return props.items;
});

const handelSearch = (search) => {
  searchFilter.value = search;
};
</script>

<template>
  <div class="flex items-center justify-between">
    <!-- Search bar -->
    <SearchForm @search="handelSearch" />
    <div class="flex items-center justify-end text-sm font-semibold">
      <!-- Radio buttons -->
      <FilterRadios />
      <!-- List of filters for statuses -->
      <FilterDropdown />
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