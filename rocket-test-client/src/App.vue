

<template v-if="deals">
  <div style="padding: 30px;">
    <a-card title="Тестовое задание" :bordered="false" style="width: 100%">
      <template #extra><a-input-search v-model:value="value" placeholder="Найти..." style="width: 200px" 
        @search="onSearch"
    /></template> 
      <a-table :columns="columns" :data-source="data" :scroll="{ x: 900 }" :expand-column-width="50" :pagination="false">
        <template #expandedRowRender="{ record }">
          <p style="margin: 0">
            {{ record.description }}
          </p>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>

import { ref } from 'vue';
const value = ref<string>('');

const onSearch = (searchValue: string) => {
  console.log('use value', searchValue);
  console.log('or use this.value', value.value);
};

const columns = [
  { title: 'Название', dataIndex: 'name', key: 'name', fixed: true },
  { title: 'Бюджет', dataIndex: 'budget', key: 'budget' },
  { title: 'Статус', dataIndex: 'status', key: 'status' },
  { title: 'Ответственный', dataIndex: 'responsible', key: 'responsible' },
  { title: 'Дата создания', dataIndex: 'date', key: 'date' },
];

const route = "http://localhost:3001/api/leads";

const data = [
  {
    key: 1,
    name: 'Первая',
    budget: '100 000',
    status: 'Переговоры',
    responsible: 'Иванов',
    date: '11.04.2024',
    description: 'Контакты'
  },
  {
    key: 2,
    name: 'Вторая',
    budget: '70 000',
    status: 'Закрыта',
    responsible: 'Петров',
    date: '18.03.2024',
    description: 'Контакты'
  },
];
</script>

<style scoped>


@media (min-width: 1024px) {

}
</style>
