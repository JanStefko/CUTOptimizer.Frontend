import { getJson } from './apiClient'

async function getSheetMaterials() {
  return getJson('/api/SheetMaterials')
}

export { getSheetMaterials }