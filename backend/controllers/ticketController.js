const fs = require("fs");
const PDFDocument = require("pdfkit");
const Ticket = require("../models/Ticket");
const Event = require("../models/Event");
const path = require("path");
const os = require("os");

// Generate PDF for the booking details
const generatePDF = async (ticket, event, user, pdfPath) => {
  if (!user || !user.email) {
    throw new Error("User information is missing or invalid");
  }

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(pdfPath)); // Write the PDF to the specified path

  // Title of the PDF
  doc.fontSize(20).text("Ticket Booking Confirmation", { align: "center" });
  doc.moveDown();

  // Draw the table
  const startX = 50;
  const startY = doc.y + 20;
  const rowHeight = 30;
  const tableWidth = 500;
  const columnWidths = [150, 350];

  // Table header
  doc
    .fillColor("Black")
    .fontSize(14)
    .text("Booking Details", { align: "center" }); // Blue color for header
  doc.moveDown(2);

  // Draw header row with colors
  doc.rect(startX, startY, tableWidth, rowHeight).stroke();
  doc.fillColor("green").rect(startX, startY, tableWidth, rowHeight).fill();
  doc.fillColor("black").text("Field", startX + 10, startY + 10); // Left column in blue
  doc
    .fillColor("black")
    .text("Details", startX + columnWidths[0] + 10, startY + 10); // Right column in blue

  // Reset color for the rest of the information
  doc.fillColor("black");

  const bookedAt = new Date(ticket.bookedAt);

// Format the date and time
const formattedDate = bookedAt.toLocaleString('en-IN', {
  weekday: 'short',  // Optional, for day of the week
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});
  // Draw the data rows
  const dataRows = [
    { label: "Booking ID", value: ticket._id },
    { label: "Event", value: event.title },
    { label: "User", value: user.email },
    { label: "Number of Tickets", value: ticket.numberOfTickets },
    { label: "Total Price", value: `INR${ticket.totalPrice}` },
    { label: "Booking Date", value: formattedDate },
  ];

  let currentY = startY + rowHeight;

  dataRows.forEach((row, index) => {
    const rowY = currentY + index * rowHeight;
    // Draw each row with faint background color
    doc.rect(startX, rowY, tableWidth, rowHeight).stroke();
    doc.fillColor("lightgray").rect(startX, rowY, tableWidth, rowHeight).fill(); // Faint background for info rows
    doc.fillColor("black").text(row.label, startX + 10, rowY + 10); // Left column
    doc.text(row.value, startX + columnWidths[0] + 10, rowY + 10); // Right column
  });
  
  doc.end();

  return pdfPath; // Return the path where the PDF is saved
};

// Ticket booking logic
const bookTicket = async (req, res) => {
  const { eventId, numberOfTickets } = req.body;
  const userId = req.userId; // Get the user ID from the authenticated request
  console.log("User from request:", req.user); // Debug user object

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.totalTickets < numberOfTickets) {
      return res.status(400).json({ message: "Not enough tickets available" });
    }

    const totalPrice = event.ticketPrice * numberOfTickets;

    const ticket = new Ticket({
      event: eventId,
      user: userId,
      numberOfTickets,
      totalPrice,
    });

    event.totalTickets -= numberOfTickets;
    event.soldTickets += numberOfTickets;
    await event.save();
    await ticket.save();

    console.log("User passed to generatePDF:", req.user);

    // Generate PDF
    const user = req.user;

    // Get the user's download folder path
    const downloadFolder = path.join(os.homedir(), "Downloads");

    const pdfPath = path.join(downloadFolder, `ticket_${ticket._id}.pdf`);

    await generatePDF(ticket, event, user, pdfPath); 

    res.status(201).json({
      message: "Tickets booked successfully! Your PDF has been downloaded.",
      ticket,
      pdfPath,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error booking tickets" });
  }
};

// Fetch tickets (stubbed example)
const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.userId }).populate("event");
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tickets" });
  }
};

module.exports = {
    bookTicket,
    getTickets
}