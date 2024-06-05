

<template v-if="deals">
  <div style="padding: 30px;">
    <a-card title="Тестовое задание" :bordered="false" style="width: 100%">
      <template #extra><a-input-search v-model:value="value" placeholder="введите от 3х символов..." style="width: 250px" 
        @search="onSearch"
    /></template> 
      <a-table :rowKey="(record: any) => record" :columns="columns" :data-source="data" :scroll="{ x: 900 }" :expand-column-width="50" :pagination="false">
        <template #expandedRowRender="{ record }">
          <p style="margin: 0">
            Контакты:
          </p>
          <span style="margin: 0">
            Имя: {{ record.contacts.name }},
          </span>
          <span style="margin: 0">
            Телефон: {{ record.contacts.phone }},
          </span>
          <span style="margin: 0">
            Email: {{ record.contacts.email }}
          </span>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>

import { ref } from 'vue';
const value = ref<string>('');
const route = "http://localhost:3001/api/leads";
let data:any = [];

const onSearch = (searchValue: string) => {
  const queryData = fetch(`${route}?query=${searchValue}`, {
  headers: {
    "Content-Type": "application/json"
  },
}).then((res) => res.json()).then((queryData) => {
  data = queryData.length ? queryData : [];
  console.log(data)
});
};

const columns = [
  { title: 'Название', dataIndex: 'name', key: 'name', fixed: true },
  { title: 'Бюджет', dataIndex: 'price', key: 'price' },
  { title: 'Статус', dataIndex: 'status', key: 'status' },
  { title: 'Ответственный', dataIndex: 'user', key: 'user' },
  { title: 'Дата создания', dataIndex: 'date', key: 'date' },
];

await fetch(route, {
  headers: {
    "Content-Type": "application/json"
  },
}).then((res) => res.json()).then((fetchData) => {
  data = fetchData.length ? fetchData : [];
  console.log(data)
});

</script>

<style scoped>

</style>
