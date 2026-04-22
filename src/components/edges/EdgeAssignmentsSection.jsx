import EdgeAssignmentRow from './EdgeAssignmentRow'

function EdgeAssignmentsSection({
  rows = [],
  edgeBandings = [],
  onAddRow,
  onUpdateRow,
  onRemoveRow,
}) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-zinc-900">
          Přiřazení hran ke kódům
        </h2>
        <p className="text-sm text-zinc-600">
          Definuj si vlastní kódy hran, které pak budeš používat při zadávání
          dílců.
        </p>
      </div>

      <div className="mt-5 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4">
        <p className="text-sm text-zinc-700">
          <span className="font-semibold">Kód 0</span> = bez hrany
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          Hodnota 0 nebo prázdné pole bude ve formuláři dílců znamenat, že na dané
          straně není hrana.
        </p>
      </div>

      <div className="mt-5 space-y-4">
        {rows.map((row) => (
          <EdgeAssignmentRow
            key={row.id}
            row={row}
            edgeBandings={edgeBandings}
            onChange={onUpdateRow}
            onRemove={onRemoveRow}
          />
        ))}
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={onAddRow}
          className="inline-flex items-center justify-center rounded-2xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
        >
          Přidat kód hrany
        </button>
      </div>
    </section>
  )
}

export default EdgeAssignmentsSection