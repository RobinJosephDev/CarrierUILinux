import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Shipment } from '../../types/ShipmentTypes';

const API_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

const useShipmentTable = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<keyof Shipment>('created_at');
  const [sortDesc, setSortDesc] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setViewModalOpen] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [isEmailModalOpen, setEmailModalOpen] = useState<boolean>(false);
  const [emailData, setEmailData] = useState<{ subject: string; content: string }>({
    subject: '',
    content: '',
  });

  //Fetch
  const fetchShipments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      setLoading(true);
      const { data } = await axios.get<Shipment[]>(`${API_URL}/shipment`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShipments(data);
    } catch (error) {
      console.error('Error loading shipments:', error);
      handleFetchError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchShipments();
  }, []);

  const handleFetchError = (error: any) => {
    if (error.response && error.response.status === 401) {
      Swal.fire({
        icon: 'error',
        title: 'Unauthorized',
        text: 'You need to log in to access this resource.',
      });
    }
  };

  //Sorting, Filtering & Pagination
  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(key as keyof Shipment);
      setSortDesc(false);
    }
  };

  const filteredShipments = shipments.filter((shipment) =>
    Object.values(shipment).some((val) => val?.toString().toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedShipments = filteredShipments.sort((a, b) => {
    let valA = a[sortBy] ?? '';
    let valB = b[sortBy] ?? '';

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortDesc ? valB.localeCompare(valA) : valA.localeCompare(valB);
    } else if (typeof valA === 'number' && typeof valB === 'number') {
      return sortDesc ? valB - valA : valA - valB;
    }

    return 0;
  });

  const paginatedData = sortedShipments.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(filteredShipments.length / rowsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  //Selection
  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedData.map((shipment) => shipment.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]));
  };

  //Modal
  const openEditModal = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedShipment(null);
  };

  const openViewModal = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedShipment(null);
  };

  //CRUD
  const updateShipment = (updatedShipment: Shipment) => {
    setShipments((prevShipments) =>
      prevShipments.map((shipment) => (shipment.id === updatedShipment.id ? { ...shipment, ...updatedShipment } : shipment))
    );
  };

  const deleteSelected = async () => {
    if (selectedIds.length === 0) {
      Swal.fire({ icon: 'warning', title: 'No record selected', text: 'Please select a record to delete.' });
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
        if (!token) throw new Error('No token found');

        await Promise.all(selectedIds.map((id) => axios.delete(`${API_URL}/shipment/${id}`, { headers: { Authorization: `Bearer ${token}` } })));

        setShipments((prevShipments) => prevShipments.filter((shipment) => !selectedIds.includes(shipment.id)));
        setSelectedIds([]);
        Swal.fire('Deleted!', 'Selected shipments have been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting shipments:', error);
        Swal.fire({ icon: 'error', title: 'Error!', text: 'Failed to delete selected shipments.' });
      }
    }
  };

  //Email
  const sendEmails = async () => {
    if (selectedIds.length === 0) {
      Swal.fire({ icon: 'warning', title: 'No shipment selected', text: 'Please select shipment to send emails to.' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      await axios.post(
        `${API_URL}/email`,
        { ids: selectedIds, ...emailData, module: 'shipments' },
        {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        }
      );

      Swal.fire('Success!', 'Emails have been sent.', 'success');
      setEmailModalOpen(false);
      setSelectedIds([]);
    } catch (error) {
      console.error('Error sending emails:', error);
      Swal.fire('Error!', 'Failed to send emails.', 'error');
    }
  };

  return {
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
  };
};

export default useShipmentTable;
