import axios from 'axios';
import exportUtils from '../utils/exportUtils';

const apiHost = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
const API_BASE = `${apiHost}/api/passengers`;

const passengerService = {
  getAllPassengers: async (page = 1, limit = 10, fromDate = '', toDate = '', commission = 'all') => {
    try {
      let url = `${API_BASE}?page=${page}&limit=${limit}`;
      if (fromDate) url += `&fromDate=${fromDate}`;
      if (toDate) url += `&toDate=${toDate}`;
      if (commission !== 'all') url += `&commission=${commission}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching passengers:', error);
      throw error;
    }
  },

  getPassengerById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE}/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching passenger:', error);
      throw error;
    }
  },

  createPassenger: async (data) => {
    try {
      const response = await axios.post(API_BASE, data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating passenger:', error);
      throw error;
    }
  },

  updatePassenger: async (id, data) => {
    try {
      const response = await axios.put(`${API_BASE}/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Error updating passenger:', error);
      throw error;
    }
  },

  deletePassenger: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting passenger:', error);
      throw error;
    }
  },

  searchPassengers: async (query) => {
    try {
      const response = await axios.get(`${API_BASE}/search?query=${query}`);
      return response.data.data;
    } catch (error) {
      console.error('Error searching passengers:', error);
      throw error;
    }
  },

  bulkImportPassengers: async (data) => {
    try {
      const response = await axios.post(`${API_BASE}/bulk-import`, data);
      return response.data;
    } catch (error) {
      console.error('Error bulk importing passengers:', error);
      throw error;
    }
  },

  exportAllPassengers: async () => {
    try {
      const response = await passengerService.getAllPassengers();
      exportUtils.exportFilteredToExcel(response.data || [], 'all');
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
