import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Table from '../common/Table';
import Modal from '../common/Modal';
import { EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { UserContext } from '../../UserProvider';
import AddQuoteForm from './AddQuote/AddQuoteForm';
import EditQuoteForm from './EditQuote/EditQuoteForm';
import ViewQuoteForm from './ViewQuote/ViewQuoteForm';

const QuoteTable = () => {
  const users = useContext(UserContext);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDesc, setSortDesc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const perPage = 100;

  const getUserNameById = (id) => {
    const user = users.find((user) => user.id === id);
    return user ? user.name : 'Unknown';
  };

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token dynamically
        if (!token) {
          throw new Error('No token found');
        }

        setLoading(true); // Set loading to true before fetching
        const { data } = await axios.get(`${API_URL}/quote`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Fetched Quotes:', data); // Debugging the fetched data
        setQuotes(data);
      } catch (error) {
        console.error('Error loading quotes:', error);
        handleFetchError(error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchQuotes();
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

  const updateQuote = (updatedQuote) => {
    setQuotes((prevQuotes) => prevQuotes.map((quote) => (quote.id === updatedQuote.id ? { ...quote, ...updatedQuote } : quote)));
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
        title: 'No quotes selected',
        text: 'Please select quotes to delete.',
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
            axios.delete(`${API_URL}/quote/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
          )
        );

        setLeads((prevLeads) => prevLeads.filter((lead) => !selectedIds.includes(lead.id)));
        setSelectedIds([]);
        Swal.fire('Deleted!', 'Selected quotes have been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting quotes:', error);

        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to delete selected quotes.',
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
    setSelectedQuote(lead);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedQuote(null);
  };

  const openAddModal = () => {
    setAddModalOpen(true);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  const openViewModal = (quote) => {
    setSelectedQuote(quote);
    setViewModalOpen(true);
  };
  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedQuote(null);
  };

  const normalizedSearchQuery = searchQuery.toLowerCase();
  const filteredQuotes = quotes.filter((quote) =>
    Object.values(quote).some((val) => val !== null && val !== undefined && val.toString().toLowerCase().includes(normalizedSearchQuery))
  );

  const sortedQuotes = filteredQuotes.sort((a, b) => {
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

  const paginatedData = sortedQuotes.slice((currentPage - 1) * perPage, currentPage * perPage);

  const totalPages = Math.ceil(filteredQuotes.length / perPage);

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
    { key: 'quote_type', label: 'Type' },
    { key: 'quote_customer', label: 'Customer' },
    { key: 'quote_cust_ref_no', label: 'Customer Ref#' },
    { key: 'quote_booked_by', label: 'Booked by' },

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
          <button onClick={() => deleteQuote(item.id)} className="btn-delete">
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
            <h1 className="page-heading">Quotes</h1>
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
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal} title="Edit Quote">
        {selectedQuote && <EditQuoteForm quote={selectedQuote} onClose={closeEditModal} onUpdate={updateQuote} />}
      </Modal>

      {/* Add Lead Modal */}
      <Modal isOpen={isAddModalOpen} onClose={closeAddModal} title="Create Quote">
        <AddQuoteForm
          onClose={closeAddModal}
          onAddQuote={(newQuote) => {
            setQuotes((prevQuotes) => [...prevQuotes, newQuote]);
            closeAddModal();
          }}
        />
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={closeViewModal} title="Quote Details">
        {selectedQuote && <ViewQuoteForm quote={selectedQuote} onClose={closeViewModal} />}
      </Modal>
    </div>
  );
};

export default QuoteTable;
