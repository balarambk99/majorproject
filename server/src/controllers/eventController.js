const Event = require("../models/Event");

// Create a new event
exports.createEvent = async (req, res) => {
    try {
        const { title, start, allDay, type, electionName, description,end } = req.body;
        console.log(req.body)
         console.log("hellow   add new")
        if (!title || !start) {
            console.log("hello")
            return res.status(400).json({ error: "Title and start date are required." });
        }

        const newEvent = new Event({
            title,
            start,
            allDay,
            type,end,
            electionName,
            description,
        });
        console.log(newEvent)

        await newEvent.save();
        console.log("sucee")
        res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
};

// Get all events
exports.getEvents = async (req, res) => {
    try {
        console.log("dhh")
        const events = await Event.find();
        console.log(events);
        res.status(200).json({election:events});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
    try { //console.log("dhgjh",req.body);
        const { data}=req.body;
        console.log(data)
        const deletedEvent = await Event.findOneAndDelete(data.title);

        if (!deletedEvent) {
            //console.log("df")
            return res.status(404).json({ message: 'Event not found' });
        }

        // If deletion is successful
        return res.status(200).json({ message: 'Event deleted successfully', deletedEvent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Update an existing event
exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
           console.log(status)
        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            {status: status },
            { new: true, runValidators: true }
        );


        if (!updatedEvent) {
            console.log("well come")
            return res.status(404).json({ error: "Event not found" });
        }

        res.status(200).json({ message: "Event updated successfully", event: updatedEvent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
