import React, { useState, useEffect } from 'react';
import passengerService from '../services/passengerService';
import './PassengerForm.css';

const PassengerForm = ({ onSubmit, initialData, isEdit }) => {
  const [formData, setFormData] = useState({
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
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit && initialData) {
      setFormData({
        ...initialData,
        registrationDate: new Date(initialData.registrationDate).toISOString().split('T')[0]
      });
    }
  }, [initialData, isEdit]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.passengerName.trim()) newErrors.passengerName = 'Passenger name is required';
    if (!formData.passport.trim()) newErrors.passport = 'Passport is required';
    if (!formData.registrationNo.trim()) newErrors.registrationNo = 'Registration no is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await onSubmit(formData);
        if (!isEdit) {
          resetForm();
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
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
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="passenger-form">
      <h2>{isEdit ? 'Edit Passenger' : 'Add New Passenger'}</h2>
      
      <div className="form-section">
        <h3>Personal Information</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Passenger Name *</label>
            <input
              type="text"
              name="passengerName"
              value={formData.passengerName}
              onChange={handleChange}
              className={errors.passengerName ? 'error' : ''}
            />
            {errors.passengerName && <span className="error-text">{errors.passengerName}</span>}
          </div>
          <div className="form-group">
            <label>Passport *</label>
            <input
              type="text"
              name="passport"
              value={formData.passport}
              onChange={handleChange}
              className={errors.passport ? 'error' : ''}
            />
            {errors.passport && <span className="error-text">{errors.passport}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Registration No *</label>
            <input
              type="text"
              name="registrationNo"
              value={formData.registrationNo}
              onChange={handleChange}
              className={errors.registrationNo ? 'error' : ''}
            />
            {errors.registrationNo && <span className="error-text">{errors.registrationNo}</span>}
          </div>
          <div className="form-group">
            <label>Registration Date</label>
            <input
              type="date"
              name="registrationDate"
              value={formData.registrationDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Code</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Sender</label>
            <input
              type="text"
              name="sender"
              value={formData.sender}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Status & Documents</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Wafid Status</label>
            <select name="wafidStatus" value={formData.wafidStatus} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="slipFileSubmit"
                checked={formData.slipFileSubmit}
                onChange={handleChange}
              />
              Slip File Submit
            </label>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Report</label>
            <select name="report" value={formData.report} onChange={handleChange}>
              <option value="FIT">FIT</option>
              <option value="UNFIT">UNFIT</option>
              <option value="HELD-UP">HELD-UP</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label>Unfit Comment</label>
            <textarea
              name="unfitCom"
              value={formData.unfitCom}
              onChange={handleChange}
              rows="2"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Financial Information</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Slip Payment Receive</label>
            <input
              type="number"
              name="slipPaymentReceive"
              value={formData.slipPaymentReceive}
              onChange={handleChange}
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label>Commission</label>
            <input
              type="number"
              name="commission"
              value={formData.commission}
              onChange={handleChange}
              step="0.01"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Slip Payment Send</label>
            <input
              type="number"
              name="slipPaymentSend"
              value={formData.slipPaymentSend}
              onChange={handleChange}
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label>Profit Margin</label>
            <input
              type="number"
              name="profitMargin"
              value={formData.profitMargin}
              onChange={handleChange}
              step="0.01"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Notes</h3>
        <div className="form-row">
          <div className="form-group full-width">
            <label>Remark</label>
            <textarea
              name="remark"
              value={formData.remark}
              onChange={handleChange}
              rows="3"
            />
          </div>
        </div>
      </div>

      <div className="form-buttons">
        <button type="submit" className="btn btn-primary">
          {isEdit ? 'Update Passenger' : 'Add Passenger'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={resetForm}>
          Reset
        </button>
      </div>
    </form>
  );
};

export default PassengerForm;
