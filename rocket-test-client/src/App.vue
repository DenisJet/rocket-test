<template>
  <div style="background: #ececec; padding: 30px;">
    <a-card title="Тестовое задание" :bordered="false" style="width: 100%">
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
const columns = [
  { title: 'Название', dataIndex: 'name', key: 'name', fixed: true },
  { title: 'Бюджет', dataIndex: 'budget', key: 'budget' },
  { title: 'Статус', dataIndex: 'status', key: 'status' },
  { title: 'Ответственный', dataIndex: 'responsible', key: 'responsible' },
  { title: 'Дата создания', dataIndex: 'date', key: 'date' },
];

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
