import React, { useMemo } from "react"
import { CFormSelect } from "@coreui/react"

function PeriodPicker({ value, onChange, className }) {
    const periods = useMemo(() => {
        const result = []
        const now = new Date()
        for (let i = 0; i < 14; i++) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const year = d.getFullYear()
            const month = String(d.getMonth() + 1).padStart(2, "0")
            result.push({
                value: `${year}-${month}`,
                label: `Tháng ${month}/${year}`
            })
        }
        return result
    }, [])

    return (
        <CFormSelect 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className={className}
        >
            {periods.map((p) => (
                <option key={p.value} value={p.value}>
                    {p.label}
                </option>
            ))}
        </CFormSelect>
    )
}

export default PeriodPicker
