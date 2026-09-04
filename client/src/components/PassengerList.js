import React, { useState, useEffect } from 'react';
import passengerService from '../services/passengerService';
import exportUtils from '../utils/exportUtils';
import './PassengerList.css';

const PassengerList = ({ refreshTrigger, editPassenger }) => {
  const [passengers, setPassengers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterFromDate, setFilterFromDate] = useState('');
  const [filterToDate, setFilterToDate] = useState('');
  const [commissionFilter, setCommissionFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPassengers, setTotalPassengers] = useState(0);
  const [pageSize] = useState(15); // Fixed page size

  // Cache management
  const CACHE_KEY = 'passengers_cache';
  const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

  const getCachedData = () => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp, page } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY && page === currentPage) {
          return data;
        }
      }
    } catch (error) {
      console.error('Error reading cache:', error);
    }
    return null;
  };

  const setCachedData = (data, page) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
        page
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  };

  const clearCache = () => {
    localStorage.removeItem(CACHE_KEY);
  };

  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  // Export to Excel
  const exportToExcel = () => {
    if (sortedPassengers.length === 0) {
      alert('No data to export');
      return;
    }

    try {
      // Generate filename with date range if filters are active
      let filename = 'passengers_export.xlsx';
      if (filterFromDate || filterToDate) {
        const from = filterFromDate || 'start';
        const to = filterToDate || 'end';
        filename = `passengers_export_${from}_to_${to}.xlsx`;
      }

      exportUtils.exportPassengersToExcel(sortedPassengers, filename);
      alert('Export successful!');
    } catch (error) {
      alert('Export failed: ' + error.message);
    }
  };

  // Export all passengers
  const exportAllPassengers = () => {
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      exportUtils.exportPassengersToExcel(passengers, `all_passengers_${timestamp}.xlsx`);
      alert('Export successful!');
    } catch (error) {
      alert('Export failed: ' + error.message);
    }
  };

  useEffect(() => {
    clearCache(); // Clear cache on refresh
    fetchPassengers(1);
  }, [refreshTrigger]);

  useEffect(() => {
    if (filterFromDate || filterToDate) {
      // When filters are applied, we need to refetch with current page
      fetchPassengers(currentPage);
    }
  }, [filterFromDate, filterToDate]);

  const fetchPassengers = async (page = 1) => {
    // Check cache first (only for non-search requests)
    if (!searchQuery) {
      const cachedData = getCachedData();
      if (cachedData && page === currentPage) {
        setPassengers(cachedData.data || []);
        setTotalPassengers(cachedData.total || 0);
        setTotalPages(cachedData.totalPages || 1);
        setCurrentPage(page);
        return;
      }
    }

    setLoading(true);
    setError('');
    try {
      const response = await passengerService.getAllPassengers(page, pageSize);
      setPassengers(response.data || []);
      setTotalPassengers(response.total || 0);
      setTotalPages(response.totalPages || 1);
      setCurrentPage(page);

      // Cache the data (only for non-search requests)
      if (!searchQuery) {
        setCachedData(response, page);
      }
    } catch (err) {
      setError('Failed to fetch passengers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === '') {
      fetchPassengers(1);
    } else {
      setLoading(true);
      try {
        const data = await passengerService.searchPassengers(query);
        setPassengers(data || []);
        setCurrentPage(1);
        setTotalPages(1);
        setTotalPassengers(data.length || 0);
      } catch (err) {
        setError('Failed to search passengers');
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchPassengers(page);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this passenger?')) {
      try {
        await passengerService.deletePassenger(id);
        clearCache(); // Clear cache after deletion
        // If we're on the last page and it's now empty, go to previous page
        if (passengers.length === 1 && currentPage > 1) {
          fetchPassengers(currentPage - 1);
        } else {
          fetchPassengers(currentPage);
        }
        alert('Passenger deleted successfully');
      } catch (err) {
        setError('Failed to delete passenger');
      }
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedPassengers = [...passengers].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  }).filter(passenger => {
    // Filter by date range if dates are specified
    if (filterFromDate || filterToDate) {
      const passengerDate = formatDate(passenger.registrationDate);
      
      if (filterFromDate && passengerDate < filterFromDate) {
        return false;
      }
      if (filterToDate && passengerDate > filterToDate) {
        return false;
      }
    }

    const commission = Number(passenger.commission || 0);
    if (commissionFilter === 'zero' && commission !== 0) {
      return false;
    }
    if (commissionFilter === 'non-zero' && commission === 0) {
      return false;
    }

    return true;
  });

  if (loading && passengers.length === 0) {
    return <div className="loading">Loading passengers...</div>;
  }

  return (
    <div className="passenger-list-container">
      <div className="list-header">
        <h2>Passenger List</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, passport, registration no, or code..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-group">
          <label htmlFor="fromDate">From Date:</label>
          <input
            type="date"
            id="fromDate"
            value={filterFromDate}
            onChange={(e) => setFilterFromDate(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="toDate">To Date:</label>
          <input
            type="date"
            id="toDate"
            value={filterToDate}
            onChange={(e) => setFilterToDate(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="commissionFilter">Commission:</label>
          <select
            id="commissionFilter"
            value={commissionFilter}
            onChange={(e) => setCommissionFilter(e.target.value)}
          >
            <option value="all">All rows</option>
            <option value="non-zero">Commission &gt; 0</option>
            <option value="zero">Commission = 0</option>
          </select>
        </div>
        {(filterFromDate || filterToDate || commissionFilter !== 'all') && (
          <button
            className="clear-filter-btn"
            onClick={() => {
              setFilterFromDate('');
              setFilterToDate('');
              setCommissionFilter('all');
            }}
          >
            Clear Filter
          </button>
        )}
        <button
          className="export-btn"
          onClick={exportToExcel}
          disabled={sortedPassengers.length === 0}
          title="Export visible/filtered data"
        >
          📥 Export Filtered
        </button>
        <button
          className="export-all-btn"
          onClick={exportAllPassengers}
          disabled={passengers.length === 0}
          title="Export all passengers"
        >
          📤 Export All
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {sortedPassengers.length === 0 ? (
        <div className="no-data">
          {passengers.length === 0
            ? 'No passengers found. Add a new passenger to get started.'
            : 'No passengers match the selected filters.'}
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="passenger-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('passengerName')}>
                  Passenger Name {sortBy === 'passengerName' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('passport')}>
                  Passport {sortBy === 'passport' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('registrationNo')}>
                  Reg No {sortBy === 'registrationNo' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('registrationDate')}>
                  Reg Date {sortBy === 'registrationDate' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('code')}>
                  Report {sortBy === 'report' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('unfitCom')}>
                  Unfit Com. {sortBy === 'unfitCom' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('wafidStatus')}>
                  Wafid Status {sortBy === 'wafidStatus' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Slip File</th>
                <th onClick={() => handleSort('slipPaymentReceive')}>
                  Payment Rec {sortBy === 'slipPaymentReceive' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('commission')}>
                  Commission {sortBy === 'commission' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('commission')}>
                  Payment send {sortBy === 'commission' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('profitMargin')}>
                  Sender {sortBy === 'sender' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedPassengers.map(passenger => (
                <tr key={passenger._id}>
                  <td>{passenger.passengerName}</td>
                  <td>{passenger.passport}</td>
                  <td>{passenger.registrationNo}</td>
                  <td>{formatDate(passenger.registrationDate)}</td>
                  <td>
                    <span className={`report-badge report-${(passenger.report || '').toLowerCase()}`}>
                      {passenger.report == "HELD-UP"? "NOT FOUND": passenger.report}
                    </span>
                  </td>
                  <td>{passenger.unfitCom}</td>
                  <td>
                    <span className={`status-badge status-${passenger.wafidStatus.toLowerCase()}`}>
                      {passenger.wafidStatus == "Rejected"? "NOT-FOUND": passenger.wafidStatus == "On Hold"? "NEW": passenger.wafidStatus}
                    </span>
                  </td>
                  <td>{passenger.slipFileSubmit ? '✓' : '✗'}</td>
                  <td>{passenger.slipPaymentReceive ? parseFloat(passenger.slipPaymentReceive).toFixed(2) : '0.00'}</td>
                  <td>{passenger.commission ? parseFloat(passenger.commission).toFixed(2) : '0.00'}</td>
                  <td>{passenger.slipPaymentSend ? parseFloat(passenger.slipPaymentSend).toFixed(2) : '0.00'}</td>
                  <td>{passenger.sender}</td>
                  <td className="action-buttons">
                    <button
                      className="btn-edit"
                      onClick={() => editPassenger(passenger)}
                      title="Edit"
                    >
                      ✎
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(passenger._id)}
                      title="Delete"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && !searchQuery && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNum}
                className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            className="page-btn"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      <div className="list-footer">
        Total: {totalPassengers} passengers {sortedPassengers.length !== passengers.length && `(${sortedPassengers.length} filtered)`}
        {!searchQuery && ` | Page ${currentPage} of ${totalPages}`}
      </div>
    </div>
  );
};

export default PassengerList;
