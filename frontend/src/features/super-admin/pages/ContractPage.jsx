import ContractFilters from "../components/contract/ContractFilters"
import ContractsTable from "../components/contract/ContractsTable"
import DraftContractsTable from "../components/contract/DraftContractsTable"
import InvoicesTable from "../components/contract/InvoicesTable"
import CreateContractModal from "../components/contract/CreateContractModal"
import SalesTable from "../components/revenue-sales/SalesTable"

import { useState } from "react"
import UnifiedPaymentDrawer from "../components/common/UnifiedPaymentDrawer"
import { CNav, CNavItem, CNavLink, CButton } from "@coreui/react"

function ContractsPage() {
  const storedUser = localStorage.getItem("user")
  const currentUser = storedUser ? JSON.parse(storedUser) : null
  const isSuperAdminOrOwner = window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/owner')
  const myBranchId = isSuperAdminOrOwner ? "" : (currentUser?.branchId || "")

  const [showPayment, setShowPayment] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [paymentData, setPaymentData] = useState({})
  const [refreshKey, setRefreshKey] = useState(0)

  const [activeTab, setActiveTab] = useState('draft')

  return (
    <div className="d-flex flex-column" style={{ height: "calc(100vh - 130px)" }}>

      {/* Header */}
      <div className="flex-shrink-0 d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3 className="fw-bold mb-1">Hợp Đồng & Hóa Đơn</h3>
        </div>
        {activeTab === 'draft' && (
          <CButton
            color="warning"
            className="px-4 fw-bold text-dark shadow-sm"
            onClick={() => setShowCreateModal(true)}
          >
            + Tạo Hợp Đồng
          </CButton>
        )}
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 border-bottom mb-3">
        <CNav variant="tabs">
          <CNavItem>
            <CNavLink
              active={activeTab === 'draft'}
              onClick={() => setActiveTab('draft')}
              style={{ cursor: "pointer", fontWeight: activeTab === 'draft' ? "bold" : "normal" }}
            >
              Bản nháp
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={activeTab === 'official'}
              onClick={() => setActiveTab('official')}
              style={{ cursor: "pointer", fontWeight: activeTab === 'official' ? "bold" : "normal" }}
            >
              Hợp đồng chính thức
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={activeTab === 'invoice'}
              onClick={() => setActiveTab('invoice')}
              style={{ cursor: "pointer", fontWeight: activeTab === 'invoice' ? "bold" : "normal" }}
            >
              Hóa đơn
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={activeTab === 'sales'}
              onClick={() => setActiveTab('sales')}
              style={{ cursor: "pointer", fontWeight: activeTab === 'sales' ? "bold" : "normal" }}
            >
              Thanh toán
            </CNavLink>
          </CNavItem>
        </CNav>
      </div>

      {/* Filters */}
      {activeTab !== 'sales' && (
        <div className="flex-shrink-0 mb-3">
          <ContractFilters />
        </div>
      )}

      {/* Table */}
      <div className="flex-grow-1 overflow-hidden">
        {activeTab === 'official' && (
          <ContractsTable
            key={`official-${refreshKey}`}
            onPayClick={(data) => {
              setPaymentData(data);
              setShowPayment(true);
            }}
            onRefresh={() => setRefreshKey(prev => prev + 1)}
            fixedBranchId={myBranchId}
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
                  invoiceCode: result.invoiceId.slice(-10).toUpperCase()
                });
                setShowPayment(true);
              }
            }}
            fixedBranchId={myBranchId}
          />
        )}

        {activeTab === 'invoice' && (
          <InvoicesTable
            key={`invoice-${refreshKey}`}
            onPayClick={(data) => {
              setPaymentData(data);
              setShowPayment(true);
            }}
            fixedBranchId={myBranchId}
          />
        )}

        {activeTab === 'sales' && (
          <SalesTable
            key={`sales-${refreshKey}`}
            fixedBranchId={myBranchId}
            hideBranchFilter={!isSuperAdminOrOwner}
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
              invoiceCode: result.invoiceId.slice(-10).toUpperCase()
            });
            setShowPayment(true);
          }
        }}
        fixedBranchId={myBranchId}
      />

    </div>
  )
}

export default ContractsPage