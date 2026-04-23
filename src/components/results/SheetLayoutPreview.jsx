import { useMemo, useState } from 'react'
import { formatNumber } from '../../utils/formatters'

const EDGE_CODE_COLORS = {
  1: '#2563eb',
  2: '#16a34a',
  3: '#ca8a04',
  4: '#dc2626',
  5: '#7c3aed',
  6: '#0891b2',
  7: '#ea580c',
  8: '#be123c',
}

function getEdgeCodeColor(code) {
  return EDGE_CODE_COLORS[code] || '#52525b'
}

function truncateText(value, maxLength) {
  if (!value) {
    return ''
  }

  return value.length > maxLength ? `${value.slice(0, maxLength)}…` : value
}

function SheetLayoutPreview({
  sheet,
  hoveredPanelId,
  onPanelHover,
  onPanelLeave,
}) {
  const [tooltip, setTooltip] = useState(null)

  const usedEdgeCodes = useMemo(() => {
    const codeSet = new Set()

    for (const item of sheet.items) {
      ;[
        item.frontEdgeCode,
        item.backEdgeCode,
        item.leftEdgeCode,
        item.rightEdgeCode,
      ]
        .filter((code) => code > 0)
        .forEach((code) => codeSet.add(code))
    }

    return Array.from(codeSet).sort((a, b) => a - b)
  }, [sheet.items])

  function showTooltip(event, item) {
    const bounds = event.currentTarget.getBoundingClientRect()

    setTooltip({
      item,
      x: event.clientX - bounds.left + 12,
      y: event.clientY - bounds.top + 12,
    })
  }

  function moveTooltip(event) {
    const bounds = event.currentTarget.getBoundingClientRect()

    setTooltip((current) => {
      if (!current) {
        return current
      }

      return {
        ...current,
        x: event.clientX - bounds.left + 12,
        y: event.clientY - bounds.top + 12,
      }
    })
  }

  function hideTooltip() {
    setTooltip(null)
  }

  if (!sheet) {
    return null
  }

  const viewBoxWidth = sheet.length
  const viewBoxHeight = sheet.width

  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-100 p-3">
      <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-zinc-600">
        <span className="font-medium text-zinc-800">
          Náhled tabule #{sheet.sheetNumber}
        </span>
        <span>
          {formatNumber(sheet.length, 0)} × {formatNumber(sheet.width, 0)} mm
        </span>
      </div>

      <div className="relative overflow-auto rounded-xl border border-zinc-300 bg-white p-2">
        <svg
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="h-auto w-full min-w-[320px]"
          role="img"
          aria-label={`Rozložení dílců na tabuli ${sheet.sheetNumber}`}
          preserveAspectRatio="xMinYMin meet"
        >
          <rect
            x="0"
            y="0"
            width={sheet.length}
            height={sheet.width}
            fill="#fafaf9"
            stroke="#a1a1aa"
            strokeWidth="8"
          />

          {sheet.items.map((item) => {
            const isHovered = hoveredPanelId === item.panelId
            const canShowText = item.cutLength >= 180 && item.cutWidth >= 110
            const canShowDescription = item.cutLength >= 260 && item.cutWidth >= 150

            const frontColor =
              item.frontEdgeCode > 0 ? getEdgeCodeColor(item.frontEdgeCode) : null
            const backColor =
              item.backEdgeCode > 0 ? getEdgeCodeColor(item.backEdgeCode) : null
            const leftColor =
              item.leftEdgeCode > 0 ? getEdgeCodeColor(item.leftEdgeCode) : null
            const rightColor =
              item.rightEdgeCode > 0 ? getEdgeCodeColor(item.rightEdgeCode) : null

            return (
              <g
                key={item.panelId}
                onMouseEnter={(event) => {
                  onPanelHover?.(item.panelId)
                  showTooltip(event, item)
                }}
                onMouseMove={moveTooltip}
                onMouseLeave={() => {
                  onPanelLeave?.()
                  hideTooltip()
                }}
                style={{ cursor: 'default' }}
              >
                <rect
                  x={item.x}
                  y={item.y}
                  width={item.cutLength}
                  height={item.cutWidth}
                  fill={isHovered ? '#f3f4f6' : '#fafaf9'}
                  stroke={isHovered ? '#111827' : '#3f3f46'}
                  strokeWidth={isHovered ? '6' : '3'}
                  rx="4"
                />

                {frontColor && (
                  <rect
                    x={item.x}
                    y={item.y}
                    width={item.cutLength}
                    height="12"
                    fill={frontColor}
                  />
                )}

                {backColor && (
                  <rect
                    x={item.x}
                    y={item.y + item.cutWidth - 12}
                    width={item.cutLength}
                    height="12"
                    fill={backColor}
                  />
                )}

                {leftColor && (
                  <rect
                    x={item.x}
                    y={item.y}
                    width="12"
                    height={item.cutWidth}
                    fill={leftColor}
                  />
                )}

                {rightColor && (
                  <rect
                    x={item.x + item.cutLength - 12}
                    y={item.y}
                    width="12"
                    height={item.cutWidth}
                    fill={rightColor}
                  />
                )}

                {canShowText && (
                  <>
                    <text
                      x={item.x + 20}
                      y={item.y + 38}
                      fontSize="28"
                      fontWeight="700"
                      fill="#111827"
                    >
                      {item.position || `ID ${item.panelId}`}
                    </text>

                    {canShowDescription && (
                      <text
                        x={item.x + 20}
                        y={item.y + 74}
                        fontSize="24"
                        fill="#1f2937"
                      >
                        {truncateText(item.description, 32)}
                      </text>
                    )}

                    <text
                      x={item.x + 20}
                      y={canShowDescription ? item.y + 108 : item.y + 74}
                      fontSize="20"
                      fill="#52525b"
                    >
                      {formatNumber(item.finalLength, 0)} × {formatNumber(item.finalWidth, 0)} mm
                    </text>
                  </>
                )}
              </g>
            )
          })}
        </svg>

        {tooltip && (
          <div
            className="pointer-events-none absolute z-10 max-w-xs rounded-xl border border-zinc-200 bg-white/95 px-3 py-2 text-xs text-zinc-700 shadow-lg backdrop-blur"
            style={{
              left: tooltip.x,
              top: tooltip.y,
            }}
          >
            <p className="font-semibold text-zinc-900">
              {tooltip.item.position || `ID ${tooltip.item.panelId}`}
            </p>
            <p className="mt-1">{tooltip.item.description}</p>
            <p className="mt-1 text-zinc-600">
              Souřadnice: X {formatNumber(tooltip.item.x, 2)}, Y {formatNumber(tooltip.item.y, 2)}
            </p>
            <p className="text-zinc-600">
              Finál: {formatNumber(tooltip.item.finalLength, 2)} × {formatNumber(tooltip.item.finalWidth, 2)} mm
            </p>
            <p className="text-zinc-600">
              Cut: {formatNumber(tooltip.item.cutLength, 2)} × {formatNumber(tooltip.item.cutWidth, 2)} mm
            </p>
            <p className="text-zinc-600">
              Rotace: {tooltip.item.isRotated ? 'Ano' : 'Ne'}
            </p>
            <p className="text-zinc-600">
              Hrany: P {tooltip.item.frontEdgeCode}, Z {tooltip.item.backEdgeCode}, L {tooltip.item.leftEdgeCode}, R {tooltip.item.rightEdgeCode}
            </p>
            {tooltip.item.note && (
              <p className="mt-1 text-zinc-600">
                Pozn.: {tooltip.item.note}
              </p>
            )}
          </div>
        )}
      </div>

      {usedEdgeCodes.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-zinc-600">
          <span className="font-medium text-zinc-800">Použité hrany:</span>

          {usedEdgeCodes.map((code) => (
            <span key={code} className="inline-flex items-center gap-1">
              <span
                className="h-3 w-3 rounded-sm"
                style={{ backgroundColor: getEdgeCodeColor(code) }}
              />
              Kód {code}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default SheetLayoutPreview