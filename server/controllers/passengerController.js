const Passenger = require('../models/Passenger');

// Get all passengers
exports.getAllPassengers = async (req, res) => {
  try {
    const passengers = await Passenger.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: passengers.length,
      data: passengers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching passengers',
      error: error.message
    });
  }
};

// Get single passenger by ID
exports.getPassengerById = async (req, res) => {
  try {
    const passenger = await Passenger.findById(req.params.id);
    if (!passenger) {
      return res.status(404).json({
        success: false,
        message: 'Passenger not found'
      });
    }
    res.status(200).json({
      success: true,
      data: passenger
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching passenger',
      error: error.message
    });
  }
};

// Create new passenger
exports.createPassenger = async (req, res) => {
  try {
    const passenger = new Passenger(req.body);
    await passenger.save();
    res.status(201).json({
      success: true,
      message: 'Passenger created successfully',
      data: passenger
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating passenger',
      error: error.message
    });
  }
};

// Update passenger
exports.updatePassenger = async (req, res) => {
  try {
    const passenger = await Passenger.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!passenger) {
      return res.status(404).json({
        success: false,
        message: 'Passenger not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Passenger updated successfully',
      data: passenger
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating passenger',
      error: error.message
    });
  }
};

// Delete passenger
exports.deletePassenger = async (req, res) => {
  try {
    const passenger = await Passenger.findByIdAndDelete(req.params.id);
    if (!passenger) {
      return res.status(404).json({
        success: false,
        message: 'Passenger not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Passenger deleted successfully',
      data: passenger
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting passenger',
      error: error.message
    });
  }
};

// Search passengers
exports.searchPassengers = async (req, res) => {
  try {
    const { query } = req.query;
    const passengers = await Passenger.find({
      $or: [
        { passengerName: { $regex: query, $options: 'i' } },
        { passport: { $regex: query, $options: 'i' } },
        { registrationNo: { $regex: query, $options: 'i' } },
        { code: { $regex: query, $options: 'i' } }
      ]
    });
    res.status(200).json({
      success: true,
      count: passengers.length,
      data: passengers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching passengers',
      error: error.message
    });
  }
};
