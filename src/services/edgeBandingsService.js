import { getJson } from './apiClient'

async function getEdgeBandings() {
  return getJson('/api/EdgeBandings')
}

export { getEdgeBandings }