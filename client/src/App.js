import React, { useState, useCallback, useEffect } from 'react';
import PassengerForm from './components/PassengerForm';
import PassengerList from './components/PassengerList';
import ExcelUpload from './components/ExcelUpload';
import LoginForm from './components/LoginForm';
import passengerService from './services/passengerService';
import authService from './services/authService';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  }, []);

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

  const handleUploadSuccess = useCallback(() => {
    setSuccessMessage('Passengers imported successfully!');
    setRefreshTrigger(prev => prev + 1);
    setActiveTab('list');
    setTimeout(() => setSuccessMessage(''), 3000);
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

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setActiveTab('list');
    setSelectedPassenger(null);
  };

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>A MED MANAGER</h1>
          <p>A Completed Business Solutions</p>
        </div>
        <div className="header-user">
          <span className="user-name">Welcome, {currentUser?.userName}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
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
        <button
          className={`nav-button ${activeTab === 'import' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('import');
            handleCancelEdit();
          }}
        >
          📤 Import Excel
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

        {activeTab === 'import' && (
          <ExcelUpload
            onSuccess={handleUploadSuccess}
            onCancel={() => setActiveTab('list')}
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
