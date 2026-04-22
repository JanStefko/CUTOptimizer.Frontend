function EdgeAssignmentRow({
  row,
  edgeBandings = [],
  onChange,
  onRemove,
  disableRemove = false,
}) {
  function handleFieldChange(field, value) {
    onChange?.({
      ...row,
      [field]: value,
    })
  }

  return (
    <div className="grid gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 md:grid-cols-[120px_minmax(0,1fr)_140px_80px]">
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700">
          Kód
        </label>
        <input
          type="number"
          min="1"
          value={row.code}
          onChange={(event) => handleFieldChange('code', event.target.value)}
          className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-4 focus:ring-zinc-200"
          placeholder="1"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700">
          Hrana
        </label>
        <select
          value={row.edgeBandingId}
          onChange={(event) =>
            handleFieldChange('edgeBandingId', event.target.value)
          }
          className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-4 focus:ring-zinc-200"
        >
          <option value="">Vyber hranu</option>

          {edgeBandings.map((edge) => (
            <option key={edge.id} value={edge.id}>
              {edge.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700">
          Předfréz
        </label>
        <input
          type="number"
          min="0"
          step="0.1"
          value={row.premill}
          onChange={(event) => handleFieldChange('premill', event.target.value)}
          className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-4 focus:ring-zinc-200"
          placeholder="0.8"
        />
      </div>

      <div className="flex items-end">
        <button
          type="button"
          onClick={() => onRemove?.(row.id)}
          disabled={disableRemove}
          className="inline-flex w-full items-center justify-center rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Smazat
        </button>
      </div>
    </div>
  )
}

export default EdgeAssignmentRow