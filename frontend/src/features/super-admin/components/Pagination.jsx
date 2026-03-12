import { CPagination, CPaginationItem } from "@coreui/react"

function Pagination({ currentPage, totalPages, onChange }) {

  const pages = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push(
      <CPaginationItem
        key={i}
        active={i === currentPage}
        onClick={() => onChange(i)}
      >
        {i}
      </CPaginationItem>
    )
  }

  return (
    <CPagination align="end">

      <CPaginationItem
        disabled={currentPage === 1}
        onClick={() => onChange(currentPage - 1)}
      >
        ‹
      </CPaginationItem>

      {pages}

      <CPaginationItem
        disabled={currentPage === totalPages}
        onClick={() => onChange(currentPage + 1)}
      >
        ›
      </CPaginationItem>

    </CPagination>
  )
}

export default Pagination