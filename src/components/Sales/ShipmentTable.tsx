import { Table, TableHeader } from '../common/Table';
import Modal from '../common/Modal';
import EditShipmentForm from './EditShipment/EditShipmentForm';
import AddShipmentForm from './AddShipment/AddShipmentForm';
import { EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined, EyeOutlined, MailOutlined } from '@ant-design/icons';
import ViewShipmentForm from './ViewShipment/ViewShipmentForm';
import Pagination from '../common/Pagination';
import useShipmentTable from '../../hooks/table/useShipmentTable';

const ShipmentTable: React.FC = () => {
  const {
    fetchShipments,
    shipments,
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
    selectedShipment,
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
    updateShipment,
    handlePageChange,
  } = useShipmentTable();

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
      render: (shipment) => <input type="checkbox" checked={selectedIds.includes(shipment.id)} onChange={() => toggleSelect(shipment.id)} />,
    },
    { key: 'ship_load_date', label: 'Load Date', render: (shipment) => shipment.ship_load_date || <span>-</span> },
    { key: 'ship_pickup_location', label: 'Pickup Location', render: (shipment) => shipment.ship_pickup_location || <span>-</span> },
    { key: 'ship_delivery_location', label: 'Delivery Location', render: (shipment) => shipment.ship_delivery_location || <span>-</span> },
    { key: 'ship_ftl_ltl', label: 'FTL/LTL', render: (shipment) => shipment.ship_ftl_ltl || <span>-</span> },
    { key: 'ship_equipment', label: 'Equipment', render: (shipment) => shipment.ship_equipment || <span>-</span> },
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
            <h1 className="page-heading">Shipments</h1>
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
      ) : shipments.length === 0 ? (
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

      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Add Shipment">
        <AddShipmentForm onClose={() => setAddModalOpen(false)} onSuccess={fetchShipments} />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={closeEditModal} title="Edit Shipment">
        {selectedShipment ? (
          <EditShipmentForm shipment={selectedShipment} onClose={closeEditModal} onUpdate={updateShipment} />
        ) : (
          <p>No shipment selected for editing.</p>
        )}
      </Modal>
      <Modal isOpen={isEmailModalOpen} onClose={() => setEmailModalOpen(false)} title="Send Email">
        <button onClick={sendEmails}>Send</button>
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={closeViewModal} title="Shipment Details">
        {selectedShipment && <ViewShipmentForm shipment={selectedShipment} onClose={closeViewModal} />}
      </Modal>
    </div>
  );
};

export default ShipmentTable;
