import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import passengerService from '../services/passengerService';
import templateUtils from '../utils/templateUtils';
import './ExcelUpload.css';

const ExcelUpload = ({ onSuccess, onCancel }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadResult, setUploadResult] = useState(null);

  // Column mapping for Excel to database fields
  const columnMapping = {
    'Passenger Name': 'passengerName',
    'Passport': 'passport',
    'Registration No': 'registrationNo',
    'Report': 'report',
    'Wafid Status': 'wafidStatus',
    'Unfit Comment': 'unfitCom',
    'Registration Date': 'registrationDate',
    'Slip File Submit': 'slipFileSubmit',
    'Sender': 'sender',
    'Slip Payment Receive': 'slipPaymentReceive',
    'Commission': 'commission',
    'Slip Payment Send': 'slipPaymentSend',
    'Profit Margin': 'profitMargin',
    'Code': 'code',
    'Remark': 'remark'
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setError('');
    setFile(selectedFile);

    // Read and parse the Excel file
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          setError('Excel file appears to be empty');
          setPreview([]);
          return;
        }

        // Map Excel columns to database fields
        const mappedData = jsonData.map((row) => {
          const mapped = {};
          Object.keys(columnMapping).forEach((excelCol) => {
            if (row[excelCol] !== undefined) {
              const value = row[excelCol];
              const dbField = columnMapping[excelCol];
              
              // Convert "Yes"/"No" to boolean for slipFileSubmit
              if (dbField === 'slipFileSubmit') {
                mapped[dbField] = value === 'Yes' || value === true || value === 1;
              } else {
                mapped[dbField] = value;
              }
            }
          });
          return mapped;
        });

        setPreview(mappedData.slice(0, 5)); // Show first 5 rows
      } catch (err) {
        setError('Error reading Excel file: ' + err.message);
        setPreview([]);
      }
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const data = new Uint8Array(await file.arrayBuffer());
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Map Excel columns to database fields
      const mappedData = jsonData.map((row) => {
        const mapped = {
          passengerName: '',
          passport: '',
          registrationNo: '',
          report: 'FIT',
          wafidStatus: 'Pending',
          unfitCom: '',
          registrationDate: new Date().toISOString().split('T')[0],
          slipFileSubmit: false,
          sender: '',
          slipPaymentReceive: 0,
          commission: 0,
          slipPaymentSend: 0,
          profitMargin: 0,
          code: '',
          remark: ''
        };

        Object.keys(columnMapping).forEach((excelCol) => {
          if (row[excelCol] !== undefined) {
            const value = row[excelCol];
            const dbField = columnMapping[excelCol];
            
            // Convert "Yes"/"No" to boolean for slipFileSubmit
            if (dbField === 'slipFileSubmit') {
              mapped[dbField] = value === 'Yes' || value === true || value === 1;
            } else {
              mapped[dbField] = value;
            }
          }
        });

        return mapped;
      });

      // Upload via bulk import endpoint
      const response = await passengerService.bulkImportPassengers(mappedData);
      
      setUploadResult({
        success: response.success,
        message: response.message,
        imported: response.imported,
        failed: response.failed,
        details: response.details
      });

      setFile(null);
      setPreview([]);
      if (response.success) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (err) {
      setError('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="excel-upload-container">
      <h2>Import Passengers from Excel</h2>
      
      {error && <div className="alert alert-error">{error}</div>}
      
      {uploadResult && (
        <div className={`alert alert-${uploadResult.success ? 'success' : 'warning'}`}>
          <p><strong>{uploadResult.message}</strong></p>
          <p>Imported: {uploadResult.imported} | Failed: {uploadResult.failed}</p>
          {uploadResult.details && uploadResult.details.length > 0 && (
            <ul>
              {uploadResult.details.map((detail, idx) => (
                <li key={idx}>{detail}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="upload-section">
        <label htmlFor="excel-file" className="file-input-label">
          Select Excel File (.xlsx)
        </label>
        <input
          id="excel-file"
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
          className="file-input"
          disabled={uploading}
        />
        {file && <p className="file-name">Selected: {file.name}</p>}
      </div>

      {preview.length > 0 && (
        <div className="preview-section">
          <h3>Preview ({preview.length} of records)</h3>
          <div className="preview-table">
            <table>
              <thead>
                <tr>
                  <th>Passenger Name</th>
                  <th>Passport</th>
                  <th>Registration No</th>
                  <th>Report</th>
                  <th>Wafid Status</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.passengerName}</td>
                    <td>{row.passport}</td>
                    <td>{row.registrationNo}</td>
                    <td>{row.report}</td>
                    <td>{row.wafidStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="button-group">
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="btn btn-primary"
        >
          {uploading ? 'Uploading...' : 'Upload Excel Data'}
        </button>
        <button
          onClick={onCancel}
          disabled={uploading}
          className="btn btn-secondary"
        >
          Cancel
        </button>
      </div>

      <div className="help-section">
        <h4>Excel File Format</h4>
        <p>Your Excel file should have the following columns:</p>
        <ul>
          <li>Passenger Name (required)</li>
          <li>Passport (required)</li>
          <li>Registration No (required)</li>
          <li>Report</li>
          <li>Wafid Status</li>
          <li>Unfit Comment</li>
          <li>Registration Date</li>
          <li>Slip File Submit</li>
          <li>Sender</li>
          <li>Slip Payment Receive</li>
          <li>Commission</li>
          <li>Slip Payment Send</li>
          <li>Profit Margin</li>
          <li>Code</li>
          <li>Remark</li>
        </ul>
        
        <div className="template-buttons">
          <h4>Need Help?</h4>
          <button
            onClick={() => templateUtils.downloadExcelTemplate()}
            className="btn btn-template"
          >
            📋 Download Template
          </button>
          <button
            onClick={() => templateUtils.downloadExcelInstructions()}
            className="btn btn-template"
          >
            📖 Download Instructions
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExcelUpload;
