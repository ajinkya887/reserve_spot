const Event = require("../models/Event");

const createEvent = async (req, res) => {
  const {
    title,
    description,
    date,
    time,
    location,
    ticketPrice,
    totalTickets,
  } = req.body;
  const organizerId = req.userId; // Assuming user is authenticated

  try {
    const newEvent = new Event({
      title,
      description,
      date,
      time,
      location,
      ticketPrice,
      totalTickets,
      organizer: organizerId,
    });

    await newEvent.save();
    res
      .status(201)
      .json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    res.status(500).json({ message: "Error creating event" });
  }
};

// Get Events by Organizer
const getEventsByOrganizer = async (req, res) => {
  const organizerId = req.userId;
  try {
    const events = await Event.find({ organizer: organizerId });
    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json({ message: "Error fetching events" });
  }
};

// Update Event
const updateEvent = async (req, res) => {
  const { eventId } = req.params;
  const {
    title,
    description,
    date,
    time,
    location,
    ticketPrice,
    totalTickets,
  } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.time = time || event.time;
    event.location = location || event.location;
    event.ticketPrice = ticketPrice || event.ticketPrice;
    event.totalTickets = totalTickets || event.totalTickets;

    await event.save();
    res.status(200).json({ message: "Event updated successfully", event });
  } catch (error) {
    res.status(500).json({ message: "Error updating event" });
  }
};

// Delete Event
const deleteEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    await event.remove();
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event" });
  }
};

module.exports = {
    createEvent,
    getEventsByOrganizer,
    updateEvent,
    deleteEvent,
}