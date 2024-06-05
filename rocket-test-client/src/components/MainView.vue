

<template>
  <template v-if="data.loading">
    <div class="example">
      <a-spin />
    </div>
  </template>

  <div style="padding: 30px;" v-if="!data.loading">
    <a-card title="Тестовое задание" :bordered="false" style="width: 100%">
      <template #extra>
        <a-input-search v-model:value="value" placeholder="введите от 3х символов..." style="width: 250px" 
        showCount @search="onSearch"/>
      </template> 
      <a-table :rowKey="(record: any) => record" :columns="columns" :data-source="data.leads" :scroll="{ x: 900 }" :expand-column-width="50" :pagination="false">
        <template #expandedRowRender="{ record }">
          <p class="contact-title">
            Контакты:
          </p>
          <span class="contact" >
            Имя: {{ record.contacts.name }},
          </span>
          <span class="contact" >
            Телефон: {{ record.contacts.phone }},
          </span>
          <span class="contact" >
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

let data = ref({
  loading: false,
  leads: [],
});

const onSearch = async (searchValue: string) => {
  if (searchValue.length > 2) {
    data.value.loading = true;
    await fetch(`${route}?query=${searchValue}`, {
      headers: {
        "Content-Type": "application/json"
    },
  }).then((res) => res.json()).then((queryData) => {
    data.value.leads = queryData.length ? queryData : [];
    data.value.loading = false;
  }).catch(() => alert('ОШИБКА ЗАГРУЗКИ ДАННЫХ'))
  } else {
    alert('Введите не мене 3х символов')
  }
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
    data.value.leads = fetchData.length ? fetchData : [];
  });

</script>

<style scoped>
  .contact-title {
    margin-bottom: 0;
  }
  .contact {
    margin-right: 20px;
    color: gray;
  }

  .example {
  text-align: center;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  margin-bottom: 20px;
  padding: 30px 50px;
  margin: 20px 0;
}
</style>
