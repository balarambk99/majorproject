const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true,required:"true" },
    start: { type: Date, required: true,required:"true" },
    end:{ type: Date, required: true,required:"true" },
    allDay: { type: Boolean, default: false,required:"true" },
    type: { type: String ,required:"true"},
    electionName: { type: String,required:"true" },
    description: { type: String ,required:"true"},
    status:{type:String,default:"Not Started",required:"true"}
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
