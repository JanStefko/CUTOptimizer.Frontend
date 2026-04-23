const czechNumberFormatterCache = new Map()

function getFormatter(maximumFractionDigits = 2) {
  const key = String(maximumFractionDigits)

  if (!czechNumberFormatterCache.has(key)) {
    czechNumberFormatterCache.set(
      key,
      new Intl.NumberFormat('cs-CZ', {
        minimumFractionDigits: 0,
        maximumFractionDigits,
      })
    )
  }

  return czechNumberFormatterCache.get(key)
}

function formatNumber(value, maximumFractionDigits = 2) {
  return getFormatter(maximumFractionDigits).format(value)
}

function formatLengthMm(value, maximumFractionDigits = 1) {
  return `${formatNumber(value, maximumFractionDigits)} mm`
}

function formatAreaMm2ToM2(value, maximumFractionDigits = 3) {
  return `${formatNumber(value / 1000000, maximumFractionDigits)} m²`
}

function formatPercent(value, maximumFractionDigits = 2) {
  return `${formatNumber(value, maximumFractionDigits)} %`
}

function formatBoolean(value) {
  return value ? 'Ano' : 'Ne'
}

export {
  formatAreaMm2ToM2,
  formatBoolean,
  formatLengthMm,
  formatNumber,
  formatPercent,
}