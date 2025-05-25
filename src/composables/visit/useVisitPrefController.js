// composables/visit/useVisitPrefController.js
export function useVisitPrefController(visible, id, title) {
  function openModal(attractionId, attractionTitle) {
    id.value = attractionId
    title.value = attractionTitle
    visible.value = true
  }

  function init(tracker) {
    tracker.setVisitPrefModalOpener(openModal)
  }

  function handleSubmit({ attractionId, score }) {
    console.log('만족도 제출:', attractionId, score)
    visible.value = false
  }

  return {
    init,
    handleSubmit
  }
}
