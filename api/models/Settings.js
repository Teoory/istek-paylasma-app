const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const settingsSchema = new Schema({
    allowGuestSuggestions: { 
        type: Boolean, 
        default: false 
    },
});

const Settings = model('Settings', settingsSchema);


module.exports = Settings;