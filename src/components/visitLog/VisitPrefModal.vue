<template>
  <Dialog
    :visible="visible"
    @update:visible="updateVisible"
    modal
    :style="{ width: '90%', maxWidth: '400px' }"
    :pt="{
      root: 'rounded-2xl p-5',
      header: 'hidden',
      content: 'flex flex-col items-center space-y-6'
    }"
  >
    <div class="text-center w-full">
      <div class="text-lg font-semibold mb-2">{{ title }} 방문은 어떠셨나요?</div>
      <p class="text-sm text-gray-500">만족도를 남겨주세요!</p>
    </div>

    <div class="flex flex-wrap justify-center gap-2 w-full max-w-[260px]">
      <Button
        v-for="score in 10"
        :key="score"
        :label="score.toString()"
        :class="[
          'w-10 h-10 rounded-full text-md font-medium border-gray-300',
          selectedScore === score
            ? 'bg-primary text-white border-primary'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
        @click="selectScore(score)"
      />
    </div>
    <div class="w-full flex gap-2">
      <Button
    :label="isUpdate ? '닫기' : '나중에 하기'"
    class="w-1/2 bg-gray-600 text-white hover:bg-gray-600/90 transition-none border-0"
    @click="close"
    />
      <Button
    :label="isUpdate ? '수정하기' : '제출하기'"
    class="w-1/2 btn-primary"
    :disabled="selectedScore === null"
    @click="submit"
    />
    </div>

  </Dialog>
</template>

<script setup>
import { ref, watch, defineEmits, defineProps, computed } from 'vue'

const props = defineProps({
  visitLogId: { type: Number, required: true },
  title: { type: String, required: true },
  visible: { type: Boolean, required: true },
  initialScore: { type: Number, default: null }
})

const emit = defineEmits(['update:visible', 'submit'])

const selectedScore = ref(null)

const isUpdate = computed(() => props.initialScore !== null)

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      selectedScore.value = props.initialScore
    } else {
      selectedScore.value = null
    }
  }
)

function updateVisible(value) {
  emit('update:visible', value)
}

function selectScore(score) {
  selectedScore.value = score
}

function submit() {
  emit('submit', {
    visitLogId: props.visitLogId,
    score: selectedScore.value
  })
  emit('update:visible', false)
  selectedScore.value = null
}

function close() {
  emit('update:visible', false)
  selectedScore.value = null
}

</script>
