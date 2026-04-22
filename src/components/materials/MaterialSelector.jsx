function MaterialSelector({
  materials = [],
  selectedMaterialId = '',
  onChange,
  disabled = false,
}) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-zinc-900">Výběr materiálu</h2>
        <p className="text-sm text-zinc-600">
          Vyber deskový materiál, ze kterého se bude optimalizace počítat.
        </p>
      </div>

      <div className="mt-5">
        <label
          htmlFor="sheetMaterial"
          className="mb-2 block text-sm font-medium text-zinc-700"
        >
          Materiál
        </label>

        <select
          id="sheetMaterial"
          value={selectedMaterialId}
          onChange={(event) => onChange?.(event.target.value)}
          disabled={disabled}
          className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-4 focus:ring-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400"
        >
          <option value="">Vyber materiál</option>

          {materials.map((material) => (
            <option key={material.id} value={material.id}>
              {material.name}
            </option>
          ))}
        </select>

        <p className="mt-2 text-xs text-zinc-500">
          Načítá se z backend API /SheetMaterials.
        </p>
      </div>
    </section>
  )
}

export default MaterialSelector