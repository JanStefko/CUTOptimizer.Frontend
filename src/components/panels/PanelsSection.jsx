import { useEffect, useRef, useState } from 'react'
import PanelFormRow from './PanelFormRow'

function PanelsSection({
  rows = [],
  onAddRow,
  onInsertRowBelow,
  onUpdateRow,
  onRemoveRow,
}) {
  const [rowToDelete, setRowToDelete] = useState(null)
  const deleteDialogRef = useRef(null)

  useEffect(() => {
    const dialog = deleteDialogRef.current

    if (!dialog) {
      return
    }

    if (rowToDelete && !dialog.open) {
      dialog.showModal()
    }

    if (!rowToDelete && dialog.open) {
      dialog.close()
    }
  }, [rowToDelete])

  function handleRequestRemove(row) {
    setRowToDelete(row)
  }

  function handleCancelDelete() {
    setRowToDelete(null)
  }

  function handleConfirmDelete() {
    if (!rowToDelete) {
      return
    }

    onRemoveRow?.(rowToDelete.id)
    setRowToDelete(null)
  }

  function handleDialogClose() {
    setRowToDelete(null)
  }

  return (
    <>
    <section className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-zinc-900">Zadání dílců</h2>
        <p className="text-sm text-zinc-600">
          Pozice je uživatelské označení, může se opakovat na více řádcích.
        </p>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-[1080px] table-fixed border-separate border-spacing-0">
          <colgroup>
            <col className="w-10" />
            <col className="w-16" />
            <col className="w-36" />
            <col className="w-20" />
            <col className="w-20" />
            <col className="w-14" />
            <col className="w-14" />
            <col className="w-14" />
            <col className="w-14" />
            <col className="w-14" />
            <col className="w-14" />
            <col className="w-20" />
            <col className="w-20" />
          </colgroup>

          <thead>
            <tr>
              <th
                scope="col"
                className="border-b border-zinc-200 px-1 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-zinc-500"
              >
                #
              </th>
              <th
                scope="col"
                className="border-b border-zinc-200 px-1 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-zinc-500"
              >
                Poz.
              </th>
              <th
                scope="col"
                className="border-b border-zinc-200 px-1 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-zinc-500"
              >
                Popis
              </th>
              <th
                scope="col"
                className="border-b border-zinc-200 px-1 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-zinc-500"
              >
                Délka
              </th>
              <th
                scope="col"
                className="border-b border-zinc-200 px-1 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-zinc-500"
              >
                Šířka
              </th>
              <th
                scope="col"
                className="border-b border-zinc-200 px-1 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-zinc-500"
              >
                Ks
              </th>
              <th
                scope="col"
                className="border-b border-zinc-200 px-1 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-zinc-500"
              >
                Rot.
              </th>
              <th
                scope="col"
                className="border-b border-zinc-200 px-1 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-zinc-500"
              >
                Před.
              </th>
              <th
                scope="col"
                className="border-b border-zinc-200 px-1 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-zinc-500"
              >
                Zad.
              </th>
              <th
                scope="col"
                className="border-b border-zinc-200 px-1 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-zinc-500"
              >
                Lev.
              </th>
              <th
                scope="col"
                className="border-b border-zinc-200 px-1 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-zinc-500"
              >
                Prav.
              </th>
              <th
                scope="col"
                className="border-b border-zinc-200 px-1 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-zinc-500"
              >
                Pozn.
              </th>
              <th
                scope="col"
                className="border-b border-zinc-200 px-1 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-zinc-500"
              >
                Akce
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <PanelFormRow
                key={row.id}
                row={row}
                index={index}
                onChange={onUpdateRow}
                onInsertBelow={onInsertRowBelow}
                onRequestRemove={handleRequestRemove}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-center gap-4">


        <button
          type="button"
          onClick={onAddRow}
          className="w-full inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
        >
          Přidat dílec
        </button>
      </div>

      <dialog
        ref={deleteDialogRef}
        onClose={handleDialogClose}
        className="m-auto w-full max-w-sm rounded-2xl border border-zinc-200 p-0 shadow-xl backdrop:bg-zinc-950/40"
      >
        <div className="p-5">
          <h3 className="text-base font-semibold text-zinc-900">
            Smazat řádek?
          </h3>

          <p className="mt-2 text-sm text-zinc-600">
            Tato akce odstraní vybraný dílec z tabulky.
          </p>

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancelDelete}
              className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
            >
              NE
            </button>

            <button
              type="button"
              onClick={handleConfirmDelete}
              className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
            >
              ANO
            </button>
          </div>
        </div>
      </dialog>
    </section>
    </>
  )
}

export default PanelsSection