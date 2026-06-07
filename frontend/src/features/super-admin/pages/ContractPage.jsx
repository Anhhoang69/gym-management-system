import ContractFilters from "../components/contract/ContractFilters"
import ContractsTable from "../components/contract/ContractsTable"
import DraftContractsTable from "../components/contract/DraftContractsTable"
import InvoicesTable from "../components/contract/InvoicesTable"
import CreateContractModal from "../components/contract/CreateContractModal"

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
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [paymentData, setPaymentData] = useState({})
  const [refreshKey, setRefreshKey] = useState(0)

  const [activeTab, setActiveTab] = useState('official')

  return (
    <div>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">

        <div>
          <h3 className="fw-bold mb-1">Hợp Đồng & Hóa Đơn</h3>
        </div>

        <button
          className="btn btn-warning px-4 fw-semibold shadow-sm"
          onClick={() => setShowCreateModal(true)}
        >
          + Tạo Hợp Đồng
        </button>

      </div>

      {/* Tabs */}
      <div className="d-flex border-bottom mb-3 gap-4">
        <button
          className={`btn btn-link text-decoration-none px-0 pb-2 border-bottom border-2 rounded-0 ${activeTab === 'official' ? 'border-primary fw-bold text-primary' : 'border-transparent text-muted'}`}
          onClick={() => setActiveTab('official')}
        >
          Hợp đồng chính thức
        </button>
        <button
          className={`btn btn-link text-decoration-none px-0 pb-2 border-bottom border-2 rounded-0 ${activeTab === 'draft' ? 'border-primary fw-bold text-primary' : 'border-transparent text-muted'}`}
          onClick={() => setActiveTab('draft')}
        >
          Bản nháp
        </button>
        <button
          className={`btn btn-link text-decoration-none px-0 pb-2 border-bottom border-2 rounded-0 ${activeTab === 'invoice' ? 'border-primary fw-bold text-primary' : 'border-transparent text-muted'}`}
          onClick={() => setActiveTab('invoice')}
        >
          Hóa đơn
        </button>
      </div>

      {/* Filters */}
      <div className="mb-3">
        <ContractFilters />
      </div>

      {/* Table */}
      <div>
        {activeTab === 'official' && (
          <ContractsTable
            key={`official-${refreshKey}`}
            onPayClick={(data) => {
              setPaymentData(data);
              setShowPayment(true);
            }}
            onRefresh={() => setRefreshKey(prev => prev + 1)}
          />
        )}

        {activeTab === 'draft' && (
          <DraftContractsTable
            key={`draft-${refreshKey}`}
            onContractCreated={(result) => {
              setRefreshKey(prev => prev + 1);
              if (result && result.invoiceId) {
                setPaymentData({
                  invoiceId: result.invoiceId,
                  contractId: result.contractId || result.id,
                  totalAmountDue: result.dealPrice || result.totalAmount || 0,
                  invoiceCode: result.invoiceId.substring(0, 8).toUpperCase()
                });
                setShowPayment(true);
              }
            }}
          />
        )}

        {activeTab === 'invoice' && (
          <InvoicesTable
            key={`invoice-${refreshKey}`}
            onPayClick={(data) => {
              setPaymentData(data);
              setShowPayment(true);
            }}
          />
        )}
      </div>

      <UnifiedPaymentDrawer
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        invoiceId={paymentData.invoiceId}
        contractId={paymentData.contractId}
        totalAmountDue={paymentData.totalAmountDue}
        invoiceCode={paymentData.invoiceCode}
        onSuccess={() => {
          setRefreshKey(prev => prev + 1);
        }}
      />

      <CreateContractModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={(result) => {
          setShowCreateModal(false);
          setRefreshKey(prev => prev + 1);
          if (result && result.invoiceId) {
            setPaymentData({
              invoiceId: result.invoiceId,
              contractId: result.contractId || result.id,
              totalAmountDue: result.dealPrice || result.totalAmount || 0,
              invoiceCode: result.invoiceId // Using invoiceId as code if there's no code returned
            });
            setShowPayment(true);
          }
        }}
      />

    </div>
  )
}

export default ContractsPage