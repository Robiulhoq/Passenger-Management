import React, { useState, useCallback } from 'react';
import PassengerForm from './components/PassengerForm';
import PassengerList from './components/PassengerList';
import passengerService from './services/passengerService';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddPassenger = useCallback(async (formData) => {
    try {
      await passengerService.createPassenger(formData);
      setSuccessMessage('Passenger added successfully!');
      setRefreshTrigger(prev => prev + 1);
      setActiveTab('list');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error adding passenger:', error);
      alert('Error adding passenger: ' + error.message);
    }
  }, []);

  const handleUpdatePassenger = useCallback(async (formData) => {
    try {
      await passengerService.updatePassenger(selectedPassenger._id, formData);
      setSuccessMessage('Passenger updated successfully!');
      setRefreshTrigger(prev => prev + 1);
      setSelectedPassenger(null);
      setActiveTab('list');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating passenger:', error);
      alert('Error updating passenger: ' + error.message);
    }
  }, [selectedPassenger]);

  const handleEditPassenger = (passenger) => {
    setSelectedPassenger(passenger);
    setActiveTab('form');
  };

  const handleCancelEdit = () => {
    setSelectedPassenger(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Passenger Management System</h1>
          <p>MERN Stack CRUD Application</p>
        </div>
      </header>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      <nav className="app-nav">
        <button
          className={`nav-button ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('list');
            handleCancelEdit();
          }}
        >
          📋 View Passengers
        </button>
        <button
          className={`nav-button ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('form');
            if (!selectedPassenger) {
              setSelectedPassenger(null);
            }
          }}
        >
          ➕ Add Passenger
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'form' && (
          <div className="form-container">
            <PassengerForm
              onSubmit={selectedPassenger ? handleUpdatePassenger : handleAddPassenger}
              initialData={selectedPassenger}
              isEdit={!!selectedPassenger}
            />
            {selectedPassenger && (
              <div className="edit-cancel">
                <button
                  className="btn btn-secondary"
                  onClick={handleCancelEdit}
                >
                  Cancel Edit
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'list' && (
          <PassengerList
            refreshTrigger={refreshTrigger}
            editPassenger={handleEditPassenger}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2026 Passenger Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
