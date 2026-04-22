function PanelFormRow({
  row,
  index,
  onChange,
  onInsertBelow,
  onRequestRemove,
}) {
  function handleFieldChange(field, value) {
    onChange?.({
      ...row,
      [field]: value,
    })
  }

  function handleLastFieldKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault()
      onInsertBelow?.(row.id)
    }
  }

  function getEdgeCodeTextClass(value) {
    return value === '0' || value === 0 ? 'text-zinc-200' : 'text-zinc-900 font-bold'
  }

  const compactInputClassName =
    'h-9 w-full rounded-lg border border-zinc-300 bg-white px-2 py-1 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200'

  return (
    <tr className="align-middle">
      <td className="border-b border-zinc-100 px-1 py-2 text-center text-sm font-medium text-zinc-500">
        {index + 1}
      </td>

      <td className="border-b border-zinc-100 px-1 py-2">
        <input
          type="text"
          value={row.position}
          onChange={(event) => handleFieldChange('position', event.target.value)}
          className={`${compactInputClassName} text-zinc-900`}
          placeholder=""
        />
      </td>

      <td className="border-b border-zinc-100 px-1 py-2">
        <input
          type="text"
          value={row.description}
          onChange={(event) => handleFieldChange('description', event.target.value)}
          className={`${compactInputClassName} text-zinc-900`}
          placeholder=""
        />
      </td>

      <td className="border-b border-zinc-100 px-1 py-2">
        <input
          type="number"
          min="0"
          step="0.1"
          value={row.length}
          onChange={(event) => handleFieldChange('length', event.target.value)}
          className={`${compactInputClassName} text-center text-zinc-900`}
          placeholder=""
        />
      </td>

      <td className="border-b border-zinc-100 px-1 py-2">
        <input
          type="number"
          min="0"
          step="0.1"
          value={row.width}
          onChange={(event) => handleFieldChange('width', event.target.value)}
          className={`${compactInputClassName} text-center text-zinc-900`}
          placeholder=""
        />
      </td>

      <td className="border-b border-zinc-100 px-1 py-2">
        <input
          type="number"
          min="0"
          step="1"
          value={row.quantity ?? ''}
          onChange={(event) => handleFieldChange('quantity', event.target.value)}
          className={`${compactInputClassName} text-center text-zinc-900`}
          
        />
      </td>

      <td className="border-b border-zinc-100 px-1 py-2 text-center">
        <input
          type="checkbox"
          checked={row.rotatable}
          onChange={(event) => handleFieldChange('rotatable', event.target.checked)}
          className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400"
          title="Umožnit otočení dílce?"
        />
      </td>

      <td className="border-b border-zinc-100 px-1 py-2">
        <input
          type="number"
          min="0"
          value={row.frontEdgeCode}
          onChange={(event) =>
            handleFieldChange('frontEdgeCode', event.target.value)
          }
          className={`${compactInputClassName} text-center ${getEdgeCodeTextClass(row.frontEdgeCode)}`}
          placeholder="0"
        />
      </td>

      <td className="border-b border-zinc-100 px-1 py-2">
        <input
          type="number"
          min="0"
          value={row.backEdgeCode}
          onChange={(event) =>
            handleFieldChange('backEdgeCode', event.target.value)
          }
          className={`${compactInputClassName} text-center ${getEdgeCodeTextClass(row.backEdgeCode)}`}
          placeholder="0"
        />
      </td>

      <td className="border-b border-zinc-100 px-1 py-2">
        <input
          type="number"
          min="0"
          value={row.leftEdgeCode}
          onChange={(event) =>
            handleFieldChange('leftEdgeCode', event.target.value)
          }
          className={`${compactInputClassName} text-center ${getEdgeCodeTextClass(row.leftEdgeCode)}`}
          placeholder="0"
        />
      </td>

      <td className="border-b border-zinc-100 px-1 py-2">
        <input
          type="number"
          min="0"
          value={row.rightEdgeCode}
          onChange={(event) =>
            handleFieldChange('rightEdgeCode', event.target.value)
          }
          onKeyDown={handleLastFieldKeyDown}
          className={`${compactInputClassName} text-center ${getEdgeCodeTextClass(row.rightEdgeCode)}`}
          placeholder="0"
        />
      </td>

      <td className="border-b border-zinc-100 px-1 py-2">
        <input
          type="text"
          value={row.note}
          onChange={(event) => handleFieldChange('note', event.target.value)}
          className={`${compactInputClassName} text-zinc-900`}
          placeholder="Pozn."
        />
      </td>

      <td className="border-b border-zinc-100 px-1 py-2">
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={() => onInsertBelow?.(row.id)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-300 bg-white text-base font-semibold text-zinc-700 transition hover:bg-zinc-100"
            title="Přidat řádek pod tento"
          >
            +
          </button>

          <button
            type="button"
            onClick={() => onRequestRemove?.(row)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-white text-sm text-red-600 transition hover:bg-red-50"
            title="Smazat řádek"
          >
            ×
          </button>
        </div>
      </td>
    </tr>
  )
}

export default PanelFormRow