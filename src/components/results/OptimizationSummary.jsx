import {
  formatAreaMm2ToM2,
  formatLengthMm,
  formatNumber,
  formatPercent,
} from '../../utils/formatters'

function SummaryCard({ label, value, tone = 'default' }) {
  const toneClassName =
    tone === 'danger'
      ? 'border-red-200 bg-red-50'
      : tone === 'success'
        ? 'border-emerald-200 bg-emerald-50'
        : 'border-zinc-200 bg-zinc-50'

  return (
    <div className={`rounded-xl border px-3 py-2.5 ${toneClassName}`}>
      <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold leading-tight text-zinc-900">
        {value}
      </p>
    </div>
  )
}

function OptimizationSummary({ cutPlan }) {
  if (!cutPlan) {
    return null
  }

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-zinc-900">Souhrn optimalizace</h2>
        <p className="text-xs text-zinc-600">
          Základní přehled vypočítaného řezného plánu.
        </p>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <SummaryCard label="Materiál ID" value={cutPlan.sheetMaterialId} />
        <SummaryCard label="Počet tabulí" value={cutPlan.usedSheetsCount} />
        <SummaryCard label="Počet dílců" value={cutPlan.totalPanelsCount} />
        <SummaryCard
          label="Rozměr tabule"
          value={`${formatNumber(cutPlan.sheetLength, 0)} × ${formatNumber(cutPlan.sheetWidth, 0)} mm`}
        />
        <SummaryCard
          label="Využitá plocha"
          value={formatAreaMm2ToM2(cutPlan.totalUsedArea)}
          tone="success"
        />
        <SummaryCard
          label="Odpad"
          value={formatAreaMm2ToM2(cutPlan.totalWasteArea)}
          tone="danger"
        />
        <SummaryCard
          label="Odpad %"
          value={formatPercent(cutPlan.wastePercentage)}
          tone="danger"
        />
        <SummaryCard
          label="Prořez"
          value={formatLengthMm(cutPlan.kerf, 1)}
        />
        <SummaryCard
          label="Ořez tabule"
          value={formatLengthMm(cutPlan.trimMargin, 1)}
        />
      </div>
    </section>
  )
}

export default OptimizationSummary