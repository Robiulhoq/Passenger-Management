import axios from 'axios';
import exportUtils from '../utils/exportUtils';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_URL = "/api/passengers";


const passengerService = {
  getAllPassengers: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching passengers:', error);
      throw error;
    }
  },

  getPassengerById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching passenger:', error);
      throw error;
    }
  },

  createPassenger: async (data) => {
    try {
      const response = await axios.post(API_URL, data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating passenger:', error);
      throw error;
    }
  },

  updatePassenger: async (id, data) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Error updating passenger:', error);
      throw error;
    }
  },

  deletePassenger: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting passenger:', error);
      throw error;
    }
  },

  searchPassengers: async (query) => {
    try {
      const response = await axios.get(`${API_URL}/search?query=${query}`);
      return response.data.data;
    } catch (error) {
      console.error('Error searching passengers:', error);
      throw error;
    }
  },

  bulkImportPassengers: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/bulk-import`, data);
      return response.data;
    } catch (error) {
      console.error('Error bulk importing passengers:', error);
      throw error;
    }
  },

  exportAllPassengers: async () => {
    try {
      const passengers = await passengerService.getAllPassengers();
      exportUtils.exportFilteredToExcel(passengers, 'all');
      return { success: true, message: 'Export successful' };
    } catch (error) {
      console.error('Error exporting passengers:', error);
      throw error;
    }
  },

  exportPassengers: (passengers, filename) => {
    try {
      exportUtils.exportPassengersToExcel(passengers, filename);
      return { success: true, message: 'Export successful' };
    } catch (error) {
      console.error('Error exporting passengers:', error);
      throw error;
    }
  }
};

export default passengerService;
