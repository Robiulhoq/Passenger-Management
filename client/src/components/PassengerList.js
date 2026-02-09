import React, { useState, useEffect } from 'react';
import passengerService from '../services/passengerService';
import './PassengerList.css';

const PassengerList = ({ refreshTrigger, editPassenger }) => {
  const [passengers, setPassengers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchPassengers();
  }, [refreshTrigger]);

  const fetchPassengers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await passengerService.getAllPassengers();
      setPassengers(data || []);
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
      fetchPassengers();
    } else {
      setLoading(true);
      try {
        const data = await passengerService.searchPassengers(query);
        setPassengers(data || []);
      } catch (err) {
        setError('Failed to search passengers');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this passenger?')) {
      try {
        await passengerService.deletePassenger(id);
        setPassengers(passengers.filter(p => p._id !== id));
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

      {error && <div className="error-message">{error}</div>}

      {passengers.length === 0 ? (
        <div className="no-data">No passengers found. Add a new passenger to get started.</div>
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
                <th onClick={() => handleSort('code')}>
                  Report {sortBy === 'report' && (sortOrder === 'asc' ? '↑' : '↓')}
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
                  <td>{passenger.report}</td>
                  <td>
                    <span className={`status-badge status-${passenger.wafidStatus.toLowerCase()}`}>
                      {passenger.wafidStatus}
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
      <div className="list-footer">
        Total: {passengers.length} passengers
      </div>
    </div>
  );
};

export default PassengerList;
