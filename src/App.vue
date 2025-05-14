<script setup>
import MenuBar from './components/MenuBar.vue'
import { ref } from 'vue'
const text = ref('')

</script>
<template>
<div class="h-screen flex flex-col md:justify-center">
  <div class="hidden md:block fixed top-0 left-0 p-4 z-50">
      <h1 class="text-2xl font-extrabold p-2 text-primary">TriPing</h1>
    </div>
  <MenuBar />
  <div class="md:w-2/3 md:h-4/5 w-full h-[calc(100vh-64px)] mx-auto md:shadow-xl md:rounded-3xl md:overflow-hidden md:border-1 border-gray-200">
    <router-view />
  </div>
</div>
</template>
