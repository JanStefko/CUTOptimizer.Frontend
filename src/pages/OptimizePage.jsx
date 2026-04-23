import { useEffect, useState } from 'react'
import EdgeAssignmentsSection from '../components/edges/EdgeAssignmentsSection'
import MaterialSelector from '../components/materials/MaterialSelector'
import PanelsSection from '../components/panels/PanelsSection'
import OptimizationSheetsSection from '../components/results/OptimizationSheetsSection'
import OptimizationSummary from '../components/results/OptimizationSummary'
import { getEdgeBandings } from '../services/edgeBandingsService'
import { optimizeCutPlan } from '../services/optimizeService'
import { getSheetMaterials } from '../services/sheetMaterialsService'

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

function toNumber(value, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function buildOptimizePayload({
  selectedMaterialId,
  kerf,
  trimMargin,
  edgeAssignments,
  panelRows,
}) {
  const sanitizedEdgeCodes = edgeAssignments
    .filter((row) => row.code !== '')
    .map((row) => ({
      code: toNumber(row.code, 0),
      edgeBandingId:
        row.edgeBandingId === '' ? null : toNumber(row.edgeBandingId, 0),
      premill: toNumber(row.premill, 0),
    }))

  const sanitizedPanels = panelRows
    .filter(
      (row) =>
        row.description.trim() !== '' &&
        row.length !== '' &&
        row.width !== '' &&
        row.quantity !== ''
    )
    .map((row) => ({
      position: row.position.trim() || null,
      description: row.description.trim(),
      length: toNumber(row.length, 0),
      width: toNumber(row.width, 0),
      quantity: toNumber(row.quantity, 1),
      rotatable: row.rotatable,
      note: row.note.trim() || null,
      frontEdgeCode: toNumber(row.frontEdgeCode, 0),
      backEdgeCode: toNumber(row.backEdgeCode, 0),
      leftEdgeCode: toNumber(row.leftEdgeCode, 0),
      rightEdgeCode: toNumber(row.rightEdgeCode, 0),
    }))

  return {
    sheetMaterialId: toNumber(selectedMaterialId, 0),
    kerf: toNumber(kerf, 0),
    trimMargin: toNumber(trimMargin, 0),
    edgeCodes: sanitizedEdgeCodes,
    panels: sanitizedPanels,
  }
}

function OptimizePage() {
  const [selectedMaterialId, setSelectedMaterialId] = useState('')
  const [materials, setMaterials] = useState([])
  const [edgeBandings, setEdgeBandings] = useState([])
  const [isLoadingReferenceData, setIsLoadingReferenceData] = useState(true)
  const [referenceDataError, setReferenceDataError] = useState('')

  const [kerf, setKerf] = useState('4')
  const [trimMargin, setTrimMargin] = useState('10')

  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [optimizationResult, setOptimizationResult] = useState(null)

  const [edgeAssignments, setEdgeAssignments] = useState([
    { id: crypto.randomUUID(), code: '1', edgeBandingId: '', premill: '0.8' },
    { id: crypto.randomUUID(), code: '2', edgeBandingId: '', premill: '0.8' },
  ])

  const [panelRows, setPanelRows] = useState(() => createInitialPanelRows(5))

  useEffect(() => {
    let isMounted = true

    async function loadReferenceData() {
      try {
        setIsLoadingReferenceData(true)
        setReferenceDataError('')

        const [materialsResponse, edgeBandingsResponse] = await Promise.all([
          getSheetMaterials(),
          getEdgeBandings(),
        ])

        if (!isMounted) {
          return
        }

        setMaterials(materialsResponse)
        setEdgeBandings(edgeBandingsResponse)
      } catch (error) {
        if (!isMounted) {
          return
        }

        setReferenceDataError(
          error instanceof Error
            ? error.message
            : 'Nepodařilo se načíst materiály a hrany.'
        )
      } finally {
        if (isMounted) {
          setIsLoadingReferenceData(false)
        }
      }
    }

    loadReferenceData()

    return () => {
      isMounted = false
    }
  }, [])

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

  async function handleCalculate() {
    try {
      setIsSubmitting(true)
      setSubmitError('')
      setOptimizationResult(null)

      const payload = buildOptimizePayload({
        selectedMaterialId,
        kerf,
        trimMargin,
        edgeAssignments,
        panelRows,
      })

      if (!payload.sheetMaterialId) {
        throw new Error('Vyber materiál.')
      }

      if (payload.panels.length === 0) {
        throw new Error('Zadej alespoň jeden platný dílec.')
      }

      const result = await optimizeCutPlan(payload)
      setOptimizationResult(result)
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Výpočet optimalizace se nepodařil.'
      )
    } finally {
      setIsSubmitting(false)
    }
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

      {referenceDataError && (
        <section className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
          Nepodařilo se načíst referenční data: {referenceDataError}
        </section>
      )}

      {submitError && (
        <section className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
          Výpočet se nepodařil: {submitError}
        </section>
      )}

      <MaterialSelector
        materials={materials}
        selectedMaterialId={selectedMaterialId}
        onChange={setSelectedMaterialId}
        disabled={isLoadingReferenceData || isSubmitting}
      />

      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Prořez (kerf)
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={kerf}
              onChange={(event) => setKerf(event.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-4 focus:ring-zinc-200"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Ořez tabule (trim margin)
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={trimMargin}
              onChange={(event) => setTrimMargin(event.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-4 focus:ring-zinc-200"
            />
          </div>
        </div>
      </section>

      <EdgeAssignmentsSection
        rows={edgeAssignments}
        edgeBandings={edgeBandings}
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
          onClick={handleCalculate}
          disabled={isLoadingReferenceData || isSubmitting}
          className="inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          {isSubmitting ? 'Počítám...' : 'Vypočítat'}
        </button>
      </section>

      {optimizationResult?.cutPlan && (
        <>
          <OptimizationSummary cutPlan={optimizationResult.cutPlan} />
          <OptimizationSheetsSection cutPlan={optimizationResult.cutPlan} />
        </>
      )}
    </div>
  )
}

export default OptimizePage