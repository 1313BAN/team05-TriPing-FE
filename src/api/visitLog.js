import api from './index'

export const createVisitLog = ({ attractionNo, enteredAt, exitedAt }) => {
  return api.post('/visit-log', {
    attractionNo,
    enteredAt,
    exitedAt
  })
}

export const editPreference = ({ visitLogId, preference }) => {
  return api.patch(`/visit-log/${visitLogId}/preference`, {
    preference
  })
}