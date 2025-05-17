// markerElements.js

export function createMyLocationMarkerElement() {
  const container = document.createElement('div')
  container.className = 'relative pointer-events-none'

  const img = document.createElement('img')
  img.src = '/assets/icons/gps.png'
  img.className = 'w-8 h-8'

  container.appendChild(img)
  return container
}

export function createCustomMarkerElement(
  title,
  iconUrl = '/assets/icons/location.png',
  iconSize = 32,
  isSelected = false
) {
  const container = document.createElement('div')
  container.className = `flex flex-col items-center ${isSelected ? 'scale-110' : ''}`

  const img = document.createElement('img')
  img.src = iconUrl
  img.style.width = isSelected ? `${iconSize * 1.1}px` : `${iconSize}px`
  img.style.height = isSelected ? `${iconSize * 1.1}px` : `${iconSize}px`
  img.className = `object-contain pointer-events-none ${isSelected ? 'shadow-md drop-shadow-lg' : 'shadow-sm'}`

  const label = document.createElement('span')
  label.textContent = title
  label.className = `mt-1 bg-white ${isSelected ? 'text-primary shadow-md' : 'text-gray-800 shadow-sm'} rounded px-1 py-0.5 whitespace-nowrap font-bold pointer-events-none`
  label.style.fontSize = isSelected ? '13px' : '12px'

  container.appendChild(img)
  container.appendChild(label)

  return container
}
