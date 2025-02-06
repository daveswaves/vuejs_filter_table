<!-- App.vue -->
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
