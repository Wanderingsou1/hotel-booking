import express from 'express';
import upload from '../middlewares/upload.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';
import { createRoom, getOwnerRooms, getRooms, toggleRoomAvailability } from '../controllers/roomController.js';

const roomRouter = express.Router();

roomRouter.post('/', protect, upload.array("images", 4), createRoom);
roomRouter.get('/', getRooms);
roomRouter.get('/owner', protect, getOwnerRooms);
roomRouter.post('/toggle-availability', protect, toggleRoomAvailability);


export default roomRouter;