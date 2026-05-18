import StatsCards from "../components/common/StatsCards"
import ContractFilters from "../components/contract/ContractFilters"
import ContractsTable from "../components/contract/ContractsTable"

import {
  cilFile,
  cilCheckCircle,
  cilClock,
  cilWarning
} from "@coreui/icons"

import { useState } from "react"
import UnifiedPaymentDrawer from "../components/common/UnifiedPaymentDrawer"


function ContractsPage() {
  const [showPayment, setShowPayment] = useState(false)
  const [paymentData, setPaymentData] = useState({})


  const stats = [
    {
      title: "Tổng Hợp Đồng",
      value: "1,284",
      change: "+6% so với tháng trước",
      icon: cilFile,
      bg: "#FFF3CD",
      color: "#F59E0B",
      positive: true
    },
    {
      title: "Đang Hoạt Động",
      value: "1,102",
      change: "+4% so với tháng trước",
      icon: cilCheckCircle,
      bg: "#DCFCE7",
      color: "#22C55E",
      positive: true
    },
    {
      title: "Sắp Hết Hạn",
      value: "96",
      change: "Trong 7 ngày tới",
      icon: cilClock,
      bg: "#FFEAD5",
      color: "#FB923C",
      positive: null
    },
    {
      title: "Hóa Đơn Chưa Thanh Toán",
      value: "$4,320",
      change: "-2% so với tháng trước",
      icon: cilWarning,
      bg: "#FEE2E2",
      color: "#EF4444",
      positive: false
    }
  ]

  return (
    <div>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h3 className="fw-bold mb-1">Hợp Đồng & Hóa Đơn</h3>
          <p className="text-muted mb-0">
            Quản lý hợp đồng hội viên và các hóa đơn thanh toán
          </p>
        </div>

        <button className="btn btn-warning px-4 fw-semibold">
          + Tạo Hợp Đồng
        </button>

      </div>

      {/* Stats */}
      <StatsCards stats={stats} />

      {/* Filters */}
      <div className="mt-4">
        <ContractFilters />
      </div>

      {/* Table */}
      <div className="mt-4">
        <ContractsTable 
          onPayClick={(data) => {
            setPaymentData(data);
            setShowPayment(true);
          }}
        />
      </div>

      <UnifiedPaymentDrawer
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        invoiceId={paymentData.invoiceId}
        contractId={paymentData.contractId}
        totalAmountDue={paymentData.totalAmountDue}
        invoiceCode={paymentData.invoiceCode}
        onSuccess={() => {
          // You could trigger a re-fetch here if ContractsTable manages its own state,
          // or if ContractPage manages it.
        }}
      />

    </div>
  )
}

export default ContractsPage