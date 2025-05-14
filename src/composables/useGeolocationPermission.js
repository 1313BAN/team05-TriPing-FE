// composables/useGeolocationPermission.js
import { ref, onMounted } from 'vue'
import { startGlobalGeolocation } from './useGlobalGeolocation'

export function useGeolocationPermission(minDistance = 5) {
  const permissionState = ref('checking') // checking | granted | prompt | denied
  const errorMessage = ref('')

  const requestPermission = () => {
    navigator.geolocation.getCurrentPosition(
      () => {
        startGlobalGeolocation(minDistance)
        permissionState.value = 'granted'
      },
      (err) => {
        permissionState.value = 'denied'
        errorMessage.value =
          err.code === 1
            ? '위치 권한이 거부되었습니다. 권한을 허용하지 않으면 현재 위치 기반 서비스를 사용할 수 없습니다.'
            : '위치 정보를 가져오는 데 실패했습니다.'
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  onMounted(async () => {
    if (!('permissions' in navigator)) {
      permissionState.value = 'denied'
      errorMessage.value = '브라우저가 위치 권한을 지원하지 않습니다.'
      return
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' })
      if (result.state === 'granted') {
        startGlobalGeolocation(minDistance)
        permissionState.value = 'granted'
      } else if (result.state === 'prompt') {
        permissionState.value = 'prompt'
      } else {
        permissionState.value = 'denied'
        errorMessage.value = '위치 권한이 거부되었습니다. 설정에서 허용해주세요.'
      }

      result.onchange = () => location.reload()
    } catch {
      permissionState.value = 'denied'
      errorMessage.value = '위치 권한 확인 중 오류가 발생했습니다.'
    }
  })

  return {
    permissionState,
    errorMessage,
    requestPermission
  }
}
