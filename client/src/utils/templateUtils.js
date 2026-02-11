import * as XLSX from 'xlsx';

const templateUtils = {
  // Download Excel template for importing data
  downloadExcelTemplate: (filename = 'passenger_template.xlsx') => {
    try {
      const exampleData = [
        {
          'Passenger Name': 'John Doe',
          'Passport': 'AB123456',
          'Registration No': 'REG001',
          'Report': 'FIT',
          'Wafid Status': 'Approved',
          'Unfit Comment': '',
          'Registration Date': new Date().toLocaleDateString(),
          'Slip File Submit': 'Yes',
          'Sender': 'Agent 1',
          'Slip Payment Receive': 500,
          'Commission': 50,
          'Slip Payment Send': 450,
          'Profit Margin': 50,
          'Code': 'CODE001',
          'Remark': 'Sample data'
        }
      ];

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exampleData);

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

      // Freeze header row
      worksheet['!freeze'] = { xSplit: 0, ySplit: 1 };

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
      XLSX.writeFile(workbook, filename);
    } catch (error) {
      console.error('Error downloading template:', error);
      throw error;
    }
  },

  // Download instructions for Excel format
  downloadExcelInstructions: () => {
    try {
      const instructions = [
        {
          Column: 'Passenger Name',
          Required: 'Yes',
          Description: 'Full name of the passenger',
          Example: 'John Doe'
        },
        {
          Column: 'Passport',
          Required: 'Yes',
          Description: 'Passport number',
          Example: 'AB123456'
        },
        {
          Column: 'Registration No',
          Required: 'Yes',
          Description: 'Unique registration number',
          Example: 'REG001'
        },
        {
          Column: 'Report',
          Required: 'No',
          Description: 'FIT or UNFIT status',
          Example: 'FIT'
        },
        {
          Column: 'Wafid Status',
          Required: 'No',
          Description: 'Status like Pending, Approved, Rejected',
          Example: 'Approved'
        },
        {
          Column: 'Unfit Comment',
          Required: 'No',
          Description: 'Reason if unfit',
          Example: 'Medical condition'
        },
        {
          Column: 'Registration Date',
          Required: 'No',
          Description: 'Date of registration (YYYY-MM-DD format)',
          Example: '2026-02-09'
        },
        {
          Column: 'Slip File Submit',
          Required: 'No',
          Description: 'Whether slip file was submitted (Yes or No)',
          Example: 'Yes'
        },
        {
          Column: 'Sender',
          Required: 'No',
          Description: 'Name of sender',
          Example: 'Agent 1'
        },
        {
          Column: 'Slip Payment Receive',
          Required: 'No',
          Description: 'Payment amount received',
          Example: '500'
        },
        {
          Column: 'Commission',
          Required: 'No',
          Description: 'Commission amount',
          Example: '50'
        },
        {
          Column: 'Slip Payment Send',
          Required: 'No',
          Description: 'Payment amount sent',
          Example: '450'
        },
        {
          Column: 'Profit Margin',
          Required: 'No',
          Description: 'Profit margin value',
          Example: '50'
        },
        {
          Column: 'Code',
          Required: 'No',
          Description: 'Reference code',
          Example: 'CODE001'
        },
        {
          Column: 'Remark',
          Required: 'No',
          Description: 'Additional remarks',
          Example: 'Any notes'
        }
      ];

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(instructions);

      // Set column widths
      worksheet['!cols'] = [
        { wch: 20 },
        { wch: 10 },
        { wch: 30 },
        { wch: 20 }
      ];

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Instructions');
      XLSX.writeFile(workbook, 'import_instructions.xlsx');
    } catch (error) {
      console.error('Error downloading instructions:', error);
      throw error;
    }
  }
};

export default templateUtils;
