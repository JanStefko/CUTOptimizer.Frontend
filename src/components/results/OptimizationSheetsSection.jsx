import { useMemo, useState } from 'react'
import {
  formatAreaMm2ToM2,
  formatBoolean,
  formatNumber,
  formatPercent,
} from '../../utils/formatters'
import SheetLayoutPreview from './SheetLayoutPreview'

function formatEdgeCodes(item) {
  return `P:${item.frontEdgeCode} Z:${item.backEdgeCode} L:${item.leftEdgeCode} R:${item.rightEdgeCode}`
}

function getUnplacedPanels(sheets, totalPanelsCount) {
  const placedItems = sheets.flatMap((sheet) => sheet.items)
  const placedCount = placedItems.length
  const missingCount = Math.max(totalPanelsCount - placedCount, 0)

  return {
    placedCount,
    missingCount,
  }
}

function OptimizationSheetsSection({ cutPlan }) {
  const [hoveredPanelId, setHoveredPanelId] = useState(null)

  const sheets = cutPlan?.sheets || []

  const { placedCount, missingCount } = useMemo(() => {
    return getUnplacedPanels(sheets, cutPlan?.totalPanelsCount || 0)
  }, [sheets, cutPlan])

  if (!sheets.length) {
    return null
  }

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-zinc-900">Rozpis tabulí</h2>
        <p className="text-sm text-zinc-600">
          Přehled jednotlivých tabulí, vizuální rozložení dílců a detailní seznam položek.
        </p>
      </div>

      {missingCount > 0 && (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Nepodařilo se umístit {missingCount} z {cutPlan.totalPanelsCount} dílců. Na tabule bylo rozmístěno {placedCount} dílců.
        </div>
      )}

      <div className="mt-6 space-y-6">
        {sheets.map((sheet) => (
          <article
            key={sheet.sheetNumber}
            className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
          >
            <div className="grid gap-3 md:grid-cols-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Tabule
                </p>
                <p className="mt-1 text-base font-semibold text-zinc-900">
                  #{sheet.sheetNumber}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Rozměr
                </p>
                <p className="mt-1 text-base font-semibold text-zinc-900">
                  {formatNumber(sheet.length, 0)} × {formatNumber(sheet.width, 0)} mm
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Využitá plocha
                </p>
                <p className="mt-1 text-base font-semibold text-zinc-900">
                  {formatAreaMm2ToM2(sheet.usedArea)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Odpad
                </p>
                <p className="mt-1 text-base font-semibold text-zinc-900">
                  {formatAreaMm2ToM2(sheet.wasteArea)} ({formatPercent(sheet.wastePercentage)})
                </p>
              </div>
            </div>

            <div className="mt-4">
              <SheetLayoutPreview
                sheet={sheet}
                hoveredPanelId={hoveredPanelId}
                onPanelHover={setHoveredPanelId}
                onPanelLeave={() => setHoveredPanelId(null)}
              />
            </div>

            <div className="mt-4 overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th className="border-b border-zinc-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      ID
                    </th>
                    <th className="border-b border-zinc-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Pozice
                    </th>
                    <th className="border-b border-zinc-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Popis
                    </th>
                    <th className="border-b border-zinc-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      X
                    </th>
                    <th className="border-b border-zinc-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Y
                    </th>
                    <th className="border-b border-zinc-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Finál
                    </th>
                    <th className="border-b border-zinc-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Cut
                    </th>
                    <th className="border-b border-zinc-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Rotace
                    </th>
                    <th className="border-b border-zinc-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Hrany
                    </th>
                    <th className="border-b border-zinc-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Pozn.
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {sheet.items.map((item) => {
                    const isHovered = hoveredPanelId === item.panelId

                    return (
                      <tr
                        key={item.panelId}
                        className={isHovered ? 'bg-zinc-100' : ''}
                        onMouseEnter={() => setHoveredPanelId(item.panelId)}
                        onMouseLeave={() => setHoveredPanelId(null)}
                      >
                        <td className="border-b border-zinc-100 px-3 py-2 text-sm text-zinc-700">
                          {item.panelId}
                        </td>
                        <td className="border-b border-zinc-100 px-3 py-2 text-sm text-zinc-700">
                          {item.position || '—'}
                        </td>
                        <td className="border-b border-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900">
                          {item.description}
                        </td>
                        <td className="border-b border-zinc-100 px-3 py-2 text-sm text-zinc-700">
                          {formatNumber(item.x, 2)}
                        </td>
                        <td className="border-b border-zinc-100 px-3 py-2 text-sm text-zinc-700">
                          {formatNumber(item.y, 2)}
                        </td>
                        <td className="border-b border-zinc-100 px-3 py-2 text-sm text-zinc-700">
                          {formatNumber(item.finalLength, 2)} × {formatNumber(item.finalWidth, 2)} mm
                        </td>
                        <td className="border-b border-zinc-100 px-3 py-2 text-sm text-zinc-700">
                          {formatNumber(item.cutLength, 2)} × {formatNumber(item.cutWidth, 2)} mm
                        </td>
                        <td className="border-b border-zinc-100 px-3 py-2 text-sm text-zinc-700">
                          {formatBoolean(item.isRotated)}
                        </td>
                        <td className="border-b border-zinc-100 px-3 py-2 text-sm text-zinc-700">
                          {formatEdgeCodes(item)}
                        </td>
                        <td className="border-b border-zinc-100 px-3 py-2 text-sm text-zinc-700">
                          {item.note || '—'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default OptimizationSheetsSection