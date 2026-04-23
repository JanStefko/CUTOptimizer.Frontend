import { postJson } from './apiClient'

async function optimizeCutPlan(payload) {
  return postJson('/api/Optimize', payload)
}

export { optimizeCutPlan }