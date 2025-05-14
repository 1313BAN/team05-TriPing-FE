<template>
  <nav class="h-16 fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-50">
    <ul class="flex justify-around items-center h-full">
      <li v-for="item in navItems" :key="item.path">
        <RouterLink
          :to="item.path"
          class="flex flex-col items-center justify-center text-gray-500 hover:text-primary"
        >
          <i :class="`pi ${item.icon}`" style="font-size: 28px"></i>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const navItems = [
  { path: '/', icon: 'pi-home' },
  { path: '/myreview', icon: 'pi-comments' },
  { path: '/mypage', icon: 'pi-user' }
]
</script>
