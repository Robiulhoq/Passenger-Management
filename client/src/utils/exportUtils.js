import * as XLSX from 'xlsx';

const exportUtils = {
  // Export passengers to Excel
  exportPassengersToExcel: (passengers, filename = 'passengers.xlsx') => {
    try {
      if (!passengers || passengers.length === 0) {
        throw new Error('No passengers to export');
      }

      // Prepare data with formatted headers
      const exportData = passengers.map((passenger) => ({
        'Passenger Name': passenger.passengerName || '',
        'Passport': passenger.passport || '',
        'Registration No': passenger.registrationNo || '',
        'Report': passenger.report || '',
        'Wafid Status': passenger.wafidStatus || '',
        'Unfit Comment': passenger.unfitCom || '',
        'Registration Date': passenger.registrationDate ? new Date(passenger.registrationDate).toLocaleDateString() : '',
        'Slip File Submit': passenger.slipFileSubmit ? 'Yes' : 'No',
        'Sender': passenger.sender || '',
        'Slip Payment Receive': passenger.slipPaymentReceive || 0,
        'Commission': passenger.commission || 0,
        'Slip Payment Send': passenger.slipPaymentSend || 0,
        'Profit Margin': passenger.profitMargin || 0,
        'Code': passenger.code || '',
        'Remark': passenger.remark || ''
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Set column widths
      const columnWidths = [
        { wch: 20 }, // Passenger Name
        { wch: 15 }, // Passport
        { wch: 15 }, // Registration No
        { wch: 12 }, // Report
        { wch: 15 }, // Wafid Status
        { wch: 20 }, // Unfit Comment
        { wch: 15 }, // Registration Date
        { wch: 15 }, // Slip File Submit
        { wch: 15 }, // Sender
        { wch: 18 }, // Slip Payment Receive
        { wch: 12 }, // Commission
        { wch: 16 }, // Slip Payment Send
        { wch: 15 }, // Profit Margin
        { wch: 15 }, // Code
        { wch: 20 }  // Remark
      ];
      worksheet['!cols'] = columnWidths;

      // Style the header row (freeze panes)
      worksheet['!freeze'] = { xSplit: 0, ySplit: 1 };

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Passengers');

      // Generate Excel file and trigger download
      XLSX.writeFile(workbook, filename);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw error;
    }
  },

  // Export selected passengers to Excel
  exportSelectedToExcel: (selectedPassengers, filename = 'selected-passengers.xlsx') => {
    return exportUtils.exportPassengersToExcel(selectedPassengers, filename);
  },

  // Export with filters/search results
  exportFilteredToExcel: (passengers, filterName = '', filename = null) => {
    const timestamp = new Date().toISOString().split('T')[0];
    const defaultFilename = filterName 
      ? `passengers-${filterName}-${timestamp}.xlsx`
      : `passengers-export-${timestamp}.xlsx`;
    
    return exportUtils.exportPassengersToExcel(passengers, filename || defaultFilename);
  }
};

export default exportUtils;
