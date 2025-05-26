import { editPreference } from '@/api/visitLog'

export function useVisitPrefController(visible, id, title, fetchLogs) {
  function openModal(visitLogId, attractionTitle) {
    id.value = visitLogId
    title.value = attractionTitle
    visible.value = true
  }

  function init(tracker) {
    tracker.setVisitPrefModalOpener(openModal)
  }

  async function handleSubmit({ visitLogId, score }) {
    console.log('만족도 저장 요청:', { visitLogId, score })
    try {
      await editPreference({ visitLogId, preference: score })
      visible.value = false

      if (fetchLogs) {
        await fetchLogs()
      }
    } catch (err) {
      console.error('만족도 저장 실패:', err)
    }
  }

  return {
    init,
    handleSubmit
  }
}
