import { useState } from 'react'
import EdgeAssignmentsSection from '../components/edges/EdgeAssignmentsSection'
import MaterialSelector from '../components/materials/MaterialSelector'
import PanelsSection from '../components/panels/PanelsSection'

const mockMaterials = [
  { id: 1, name: 'DTDL W1100 ST9 Alpská bílá 2800/2070/18' },
  { id: 2, name: 'DTDL W960 SM Bílá 2800/2070/18' },
  { id: 3, name: 'DTDL W1100 ST30 Alpská bílá 2800/2070/18' },
]

const mockEdgeBandings = [
  { id: 1, name: 'ABSB W1100 ST9 Alpská bílá 23/2' },
  { id: 2, name: 'ABSB W1100 ST9 Alpská bílá 23/0,8' },
  { id: 3, name: 'ABSB W1000 ST9 Prémiová bílá 23/2' },
]

function createEmptyPanelRow() {
  return {
    id: crypto.randomUUID(),
    position: '',
    description: '',
    length: '',
    width: '',
    quantity: '1',
    rotatable: false,
    note: '',
    frontEdgeCode: '0',
    backEdgeCode: '0',
    leftEdgeCode: '0',
    rightEdgeCode: '0',
  }
}

function createInitialPanelRows(count = 5) {
  return Array.from({ length: count }, () => createEmptyPanelRow())
}

function OptimizePage() {
  const [selectedMaterialId, setSelectedMaterialId] = useState('')
  const [edgeAssignments, setEdgeAssignments] = useState([
    { id: crypto.randomUUID(), code: '1', edgeBandingId: '', premill: '0.8' },
    { id: crypto.randomUUID(), code: '2', edgeBandingId: '', premill: '0.8' },
  ])

  const [panelRows, setPanelRows] = useState(() => createInitialPanelRows(5))

  function handleAddEdgeAssignment() {
    setEdgeAssignments((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        code: '',
        edgeBandingId: '',
        premill: '',
      },
    ])
  }

  function handleUpdateEdgeAssignment(updatedRow) {
    setEdgeAssignments((current) =>
      current.map((row) => (row.id === updatedRow.id ? updatedRow : row))
    )
  }

  function handleRemoveEdgeAssignment(rowId) {
    setEdgeAssignments((current) => current.filter((row) => row.id !== rowId))
  }

  function handleAddPanelRow() {
    setPanelRows((current) => [...current, createEmptyPanelRow()])
  }

  function handleInsertPanelRowBelow(rowId) {
    setPanelRows((current) => {
      const index = current.findIndex((row) => row.id === rowId)

      if (index === -1) {
        return [...current, createEmptyPanelRow()]
      }

      const nextRows = [...current]
      nextRows.splice(index + 1, 0, createEmptyPanelRow())
      return nextRows
    })
  }

  function handleUpdatePanelRow(updatedRow) {
    setPanelRows((current) =>
      current.map((row) => (row.id === updatedRow.id ? updatedRow : row))
    )
  }

  function handleRemovePanelRow(rowId) {
    setPanelRows((current) => current.filter((row) => row.id !== rowId))
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
          Cutting Optimizer
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          Optimalizace řezného plánu
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600 sm:text-base">
          Vyber materiál, nastav kódy hran, zadej dílce a nech si spočítat rozložení
          na tabule. Výsledek zobrazí spotřebu materiálu a vykreslení jednotlivých
          tabulí s dílci.
        </p>
      </section>

      <MaterialSelector
        materials={mockMaterials}
        selectedMaterialId={selectedMaterialId}
        onChange={setSelectedMaterialId}
      />

      <EdgeAssignmentsSection
        rows={edgeAssignments}
        edgeBandings={mockEdgeBandings}
        onAddRow={handleAddEdgeAssignment}
        onUpdateRow={handleUpdateEdgeAssignment}
        onRemoveRow={handleRemoveEdgeAssignment}
      />

      <PanelsSection
        rows={panelRows}
        onAddRow={handleAddPanelRow}
        onInsertRowBelow={handleInsertPanelRowBelow}
        onUpdateRow={handleUpdatePanelRow}
        onRemoveRow={handleRemovePanelRow}
      />

      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
        >
          Vypočítat
        </button>
      </section>
    </div>
  )
}

export default OptimizePage