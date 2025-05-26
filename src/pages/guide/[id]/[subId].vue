<template>
</template>

<script>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const title = computed(() => route.query.title || '')
const subtitle = computed(() => route.query.subtitle || '')

</script>