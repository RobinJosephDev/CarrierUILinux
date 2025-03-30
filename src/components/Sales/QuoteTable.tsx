import { Table, TableHeader } from '../common/Table';
import Modal from '../common/Modal';
import { EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined, EyeOutlined, MailOutlined } from '@ant-design/icons';
import EditQuoteForm from './EditQuote/EditQuoteForm';
import ViewQuoteForm from './ViewQuote/ViewQuoteForm';
import useQuoteTable from '../../hooks/table/useQuoteTable';
import Pagination from '../common/Pagination';
import AddQuoteForm from './AddQuote/AddQuoteForm';

const QuoteTable: React.FC = () => {
  const {
    fetchQuotes,
    quotes,
    loading,
    searchQuery,
    setSearchQuery,
    sortBy,
    sortDesc,
    selectedIds,
    setSelectedIds,
    paginatedData,
    totalPages,
    currentPage,
    setCurrentPage,
    isEditModalOpen,
    isAddModalOpen,
    isViewModalOpen,
    isEmailModalOpen,
    selectedQuote,
    openEditModal,
    closeEditModal,
    openViewModal,
    closeViewModal,
    setEditModalOpen,
    setAddModalOpen,
    setViewModalOpen,
    setEmailModalOpen,
    toggleSelectAll,
    toggleSelect,
    deleteSelected,
    emailData,
    setEmailData,
    sendEmails,
    handleSort,
    updateQuote,
    handlePageChange,
  } = useQuoteTable();

  const renderSortableHeader = (header: TableHeader) => {
    if (header.key === 'checkbox' || header.key === 'actions') return header.label;
    return (
      <div className="sortable-header" onClick={() => handleSort(header.key)}>
        {header.label}
        <span className="sort-icon">{sortBy === header.key ? (sortDesc ? '▼' : '▲') : '▼'}</span>
      </div>
    );
  };

  const headers: TableHeader[] = [
    {
      key: 'checkbox',
      label: <input type="checkbox" checked={selectedIds.length === paginatedData.length && paginatedData.length > 0} onChange={toggleSelectAll} />,
      render: (quote) => <input type="checkbox" checked={selectedIds.includes(quote.id)} onChange={() => toggleSelect(quote.id)} />,
    },
    { key: 'quote_customer', label: 'Customer', render: (quote) => quote.quote_customer || <span>-</span> },
    { key: 'quote_cust_ref_no', label: 'Customer Ref#', render: (quote) => quote.quote_cust_ref_no || <span>-</span> },
    { key: 'quote_type', label: 'Type', render: (quote) => quote.quote_type || <span>-</span> },
    { key: 'quote_booked_by', label: 'Booked by', render: (quote) => quote.quote_booked_by || <span>-</span> },
    {
      key: 'actions',
      label: 'Actions',
      render: (item) => (
        <>
          <button onClick={() => openViewModal(item)} className="btn-view">
            <EyeOutlined />
          </button>
          <button onClick={() => openEditModal(item)} className="btn-edit">
            <EditOutlined />
          </button>
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="header-container">
        <div className="header-container-left">
          <div className="header-actions">
            <h1 className="page-heading">Quotes</h1>
          </div>
        </div>

        <div className="search-container">
          <div className="search-input-wrapper">
            <SearchOutlined className="search-icon" />
            <input className="search-bar" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <button onClick={() => setAddModalOpen(true)} className="add-button">
            <PlusOutlined />
          </button>
          <button onClick={() => setEmailModalOpen(true)} className="send-email-button" disabled={selectedIds.length === 0}>
            <MailOutlined />
          </button>
          <button onClick={deleteSelected} className="delete-button">
            <DeleteOutlined />
          </button>
        </div>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : quotes.length === 0 ? (
        <div>No records found</div>
      ) : (
        <Table
          data={paginatedData}
          headers={headers.map((header) => ({
            ...header,
            label: renderSortableHeader(header),
          }))}
          handleSort={handleSort}
          sortBy={sortBy}
          sortDesc={sortDesc}
        />
      )}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Add Quote">
        <AddQuoteForm onClose={() => setAddModalOpen(false)} onSuccess={fetchQuotes} />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={closeEditModal} title="Edit Quote">
        {selectedQuote ? (
          <EditQuoteForm quote={selectedQuote} onClose={closeEditModal} onUpdate={updateQuote} />
        ) : (
          <p>No quote selected for editing.</p>
        )}
      </Modal>

      <Modal isOpen={isEmailModalOpen} onClose={() => setEmailModalOpen(false)} title="Send Email">
        <button onClick={sendEmails}>Send</button>
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={closeViewModal} title="Quote Details">
        {selectedQuote && <ViewQuoteForm quote={selectedQuote} onClose={closeViewModal} />}
      </Modal>
    </div>
  );
};

export default QuoteTable;
