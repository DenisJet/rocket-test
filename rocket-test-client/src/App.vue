<script setup lang="ts">
import MainView from './components/MainView.vue'
</script>


<template>
  <Suspense>
    <MainView />
    <template #fallback>
      Загрузка...
    </template>
  </Suspense>
</template>


