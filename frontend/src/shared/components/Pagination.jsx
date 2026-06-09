import { CPagination, CPaginationItem } from "@coreui/react"

function Pagination({ currentPage, totalPages, onChange }) {
  if (totalPages <= 1) return null

  const getPages = () => {
    const pages = []
    const start = Math.max(1, currentPage - 2)
    const end = Math.min(totalPages, currentPage + 2)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <CPagination align="end" className="mb-0">
      <CPaginationItem
        disabled={currentPage === 1}
        onClick={() => onChange(currentPage - 1)}
        style={{ cursor: currentPage === 1 ? "default" : "pointer" }}
      >
        ‹
      </CPaginationItem>

      {getPages().map((p) => (
        <CPaginationItem
          key={p}
          active={p === currentPage}
          onClick={() => onChange(p)}
          style={{ cursor: "pointer" }}
        >
          {p}
        </CPaginationItem>
      ))}

      <CPaginationItem
        disabled={currentPage === totalPages}
        onClick={() => onChange(currentPage + 1)}
        style={{ cursor: currentPage === totalPages ? "default" : "pointer" }}
      >
        ›
      </CPaginationItem>
    </CPagination>
  )
}

export default Pagination
