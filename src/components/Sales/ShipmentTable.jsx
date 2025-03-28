import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Table from '../common/Table';
import Modal from '../common/Modal';
import EditShipmentForm from './EditShipment/EditShipmentForm';
import AddShipmentForm from './AddShipment/AddShipmentForm';
import { EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { UserContext } from '../../UserProvider';
import ViewShipmentForm from './ViewShipment/ViewShipmentForm';

const ShipmentTable = () => {
  const users = useContext(UserContext);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDesc, setSortDesc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedShipment, setselectedShipment] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const perPage = 10;

  const getUserNameById = (id) => {
    const user = users.find((user) => user.id === id);
    return user ? user.name : 'Unknown';
  };

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token dynamically
        if (!token) {
          throw new Error('No token found');
        }

        setLoading(true); // Set loading to true before fetching
        const { data } = await axios.get(`${API_URL}/shipment`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Fetched Shipments:', data); // Debugging the fetched data
        setShipments(data);
      } catch (error) {
        console.error('Error loading shipments:', error);
        handleFetchError(error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchShipments();
  }, []);

  const handleFetchError = (error) => {
    if (error.response && error.response.status === 401) {
      Swal.fire({
        icon: 'error',
        title: 'Unauthorized',
        text: 'You need to log in to access this resource.',
      });
    }
  };

  const updateShipment = (updatedShipment) => {
    setShipments((prevShipments) =>
      prevShipments.map((shipment) => (shipment.id === updatedShipment.id ? { ...shipment, ...updatedShipment } : shipment))
    );
  };
  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedData.map((lead) => lead.id));
    }
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds((prev) => [...prev, id]);
    }
  };
  const deleteSelected = async () => {
    if (selectedIds.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No shipments selected',
        text: 'Please select shipments to delete.',
      });
      return;
    }

    const confirmed = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete selected!',
      cancelButtonText: 'No, cancel!',
    });

    if (confirmed.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        await Promise.all(
          selectedIds.map((id) =>
            axios.delete(`${API_URL}/shipment/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
          )
        );

        setLeads((prevLeads) => prevLeads.filter((lead) => !selectedIds.includes(lead.id)));
        setSelectedIds([]);
        Swal.fire('Deleted!', 'Selected shipments have been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting shipments:', error);

        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to delete selected shipments.',
        });
      }
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(column);
      setSortDesc(true);
    }
  };

  const openEditModal = (lead) => {
    setselectedShipment(lead);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setselectedShipment(null);
  };

  const openAddModal = () => {
    setAddModalOpen(true);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  const openViewModal = (shipment) => {
    setselectedShipment(shipment);
    setViewModalOpen(true);
  };
  const closeViewModal = () => {
    setViewModalOpen(false);
    setselectedShipment(null);
  };

  const normalizedSearchQuery = searchQuery.toLowerCase();
  const filteredShipments = shipments.filter((shipment) =>
    Object.values(shipment).some((val) => val !== null && val !== undefined && val.toString().toLowerCase().includes(normalizedSearchQuery))
  );

  const sortedShipments = filteredShipments.sort((a, b) => {
    // Handle sorting for different data types
    let valA = a[sortBy];
    let valB = b[sortBy];

    // Handle case where value is null or undefined
    if (valA == null) valA = '';
    if (valB == null) valB = '';

    if (typeof valA === 'string') {
      // Sort strings alphabetically
      return sortDesc ? valB.localeCompare(valA) : valA.localeCompare(valB);
    }

    // Default number sorting
    return sortDesc ? valB - valA : valA - valB;
  });

  const paginatedData = sortedShipments.slice((currentPage - 1) * perPage, currentPage * perPage);

  const totalPages = Math.ceil(filteredShipments.length / perPage);

  const renderSortableHeader = (header) => {
    // Define columns that should not have a sort icon
    const nonSortableColumns = ['checkbox', 'actions'];

    // Only render sort icons for sortable columns
    if (nonSortableColumns.includes(header.key)) {
      return <div className="sortable-header">{header.label}</div>;
    }

    const isSortedColumn = sortBy === header.key; // Check if this column is sorted
    const sortDirection = isSortedColumn
      ? sortDesc
        ? '▼'
        : '▲' // If sorted, show descending (▼) or ascending (▲)
      : '▲'; // Default to ascending (▲) if not sorted

    return (
      <div className="sortable-header" onClick={() => handleSort(header.key)}>
        {header.label}
        <span className="sort-icon">{sortDirection}</span> {/* Always show an arrow for sortable columns */}
      </div>
    );
  };

  const headers = [
    {
      key: 'checkbox',
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" checked={selectedIds.length === paginatedData.length && paginatedData.length > 0} onChange={toggleSelectAll} />
        </div>
      ),
      render: (lead) => <input type="checkbox" checked={selectedIds.includes(lead.id)} onChange={() => toggleSelect(lead.id)} />,
    },
    { key: 'ship_load_date', label: 'Load Date' },
    { key: 'ship_pickup_location', label: 'Pickup Location' },
    { key: 'ship_delivery_location', label: 'Delivery Location' },
    { key: 'ship_driver', label: 'Driver' },
    { key: 'ship_weight', label: 'Weight' },
    { key: 'ship_ftl_ltl', label: 'FTL/LTL' },
    {
      key: 'ship_tarp',
      label: 'TARP',
      render: (item) => <span className={item.ship_tarp ? 'tarp-yes' : 'tarp-no'}>{item.ship_tarp ? 'Yes' : 'No'}</span>,
    },
    { key: 'ship_equipment', label: 'Equipment' },
    { key: 'ship_price', label: 'Price' },
    { key: 'ship_notes', label: 'Notes' },
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
          <button onClick={() => deleteShipment(item.id)} className="btn-delete">
            <DeleteOutlined />
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
          <button onClick={openAddModal} className="add-button">
            <PlusOutlined />
          </button>
          <button onClick={deleteSelected} className="delete-button">
            <DeleteOutlined />
          </button>
        </div>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table
          data={paginatedData}
          headers={headers.map((header) => ({
            ...header,
            label: renderSortableHeader(header), // Render sortable header logic
          }))}
          handleSort={handleSort}
          sortBy={sortBy}
          sortDesc={sortDesc}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          onEditClick={openEditModal}
        />
      )}

      {/* Edit Lead Modal */}
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal} title="Edit Shipment">
        {selectedShipment && <EditShipmentForm shipment={selectedShipment} onClose={closeEditModal} onUpdate={updateShipment} />}
      </Modal>

      {/* Add Lead Modal */}
      <Modal isOpen={isAddModalOpen} onClose={closeAddModal} title="Add Shipment">
        <AddShipmentForm
          onClose={closeAddModal}
          onAddShipment={(newShipment) => {
            setShipments((prevShipments) => [...prevShipments, newShipment]);
            closeAddModal();
          }}
        />
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={closeViewModal} title="Shipment Details">
        {selectedShipment && <ViewShipmentForm shipment={selectedShipment} onClose={closeViewModal} />}
      </Modal>
    </div>
  );
};

export default ShipmentTable;
