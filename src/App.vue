<script setup>
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import MenuBar from './components/MenuBar.vue'
import { ref } from 'vue'
const text = ref('')

import { onMounted } from 'vue'

onMounted(() => {
  console.log('Window height:', window.innerHeight)
})
</script>
<template>
  <MenuBar />
  <div class="flex justify-center items-center h-[calc(100vh-63px)]">
    <router-view />
  </div>
</template>
