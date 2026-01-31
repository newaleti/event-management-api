import express from 'express';
import Event from '../models/Event.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. CREATE an Event (Protected)
router.post('/', protect, async (req, res) => {
    try {
        const { title, description, date, location, image } = req.body;

        const newEvent = new Event({
            title,
            description,
            date,
            location,
            image,
            organiser: req.user.id,
        });

        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating event" });
    }
});

// 2. GET ALL Events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().populate("organiser", "username email");
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events" });
  }
});

export default router;