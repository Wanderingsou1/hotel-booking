import Mail from "nodemailer/lib/mailer/index.js";
import transporter from "../configs/nodemailer.js";
import Booking from "../models/Booking.js"
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

// Function to check availability of a room
export const checkAvailability = async ({checkInDate, checkOutDate, room}) => {
  try {

    const bookings = await Booking.find({
      room,
      checkInDate: {$gte: checkInDate},
      checkOutDate: {$lte: checkOutDate},
    })
    const isAvailable = bookings.length === 0;
    return isAvailable;

  } catch(err) {
    res.json({success: false, message: err.message});
  }
}

// API to check availability of room
// POST /api/bookings/check-availability

export const checkAvailabilityAPI = async(req, res) => {
  try {
    const {room, checkInDate, checkOutDate} = req.body;
    const isAvailable = await checkAvailability({checkInDate, checkOutDate, room});
    return res.json({success: true, isAvailable});

  } catch(err) {
    return res.json({success: false, message: err.message});
  }
}


// API to create a new booking
// POST /api/bookings/book

export const createBooking = async (req, res) => {
  try {
    const {room, checkInDate, checkOutDate, guests} = req.body;
    const user = req.user._id;


    // Check if room is available
    const isAvailable = await checkAvailability({checkInDate, checkOutDate, room});

    if(!isAvailable) {
      return res.status(400).json({success: false, message: "Room is not available"});
    }

    // Get total price from Room
    const roomData = await Room.findById(room).populate("hotel");
    let totalPrice = roomData.pricePerNight;

    const checkIn = new Date(checkInDate).getTime();
    const checkOut = new Date(checkOutDate).getTime();
    const timeDiff = checkOut - checkIn;
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    totalPrice = totalPrice * nights;

    const booking = await Booking.create({
      user,
      room,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice: totalPrice,      
    })

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: req.user.email,
      subject: "Hotel Booking Details",
      html: `
        <h2>Your Booking Details</h2>
        <p><strong>Dear ${req.user.username},</strong></p>
        <p>Thank you for booking with us. Your booking details are as follows:</p>
        <ul>
          <li><strong>Booking ID:</strong> ${booking._id}</li>
          <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
          <li><strong>Location:</strong> ${roomData.hotel.address}</li>
          <li><strong>Date:</strong> ${booking.checkInDate.toDateString()}</li>
          <li><strong>Booking Amount:</strong>${process.env.CURRENCY || '$'} ${booking.totalPrice} / night</li>
        </ul>
        <p>We look forward to hosting you.</p>
        <p>If you have any questions, feel free to contact us.</p>
      `,
    }

    await transporter.sendMail(mailOptions);

    return res.json({success: true, message: "Booking created successfully"});

  } catch(err) {
    console.log(err); 
    return res.json({success: false, message: "Failed to create booking"});
  }
};


// API to get all bookings for a user
// GET /api/bookings/user

export const getUserBookings = async (req, res) => {
  try {
    const user = req.user._id;
    const bookings = await Booking.find({user}).populate("room hotel").sort({createdAt: -1});
    res.json({success: true, bookings});

  } catch(err) {
    return res.json({success: false, message: "Failed to fetch bookings"});
  }
}


// API to get all bookings for a hotel
// GET /api/bookings/hotel

export const getHotelBookings = async (req, res) => {

  try {
      const hotel = await Hotel.findOne({owner: req.auth.userId});

  if(!hotel) {
    return res.json({success: false, message: "Hotel not found"});
  }

  const bookings = await Booking.find({hotel: hotel._id}).populate("room hotel user").sort({createdAt: -1});

  // Total Bookings 
  const totalBookings = bookings.length;
  // Total Revenue
  const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);
  res.json({success: true, dashboardData: {totalBookings, totalRevenue, bookings}});

  } catch(err) {
    return res.json({success: false, message: "Failed to fetch bookings"});
  }
}