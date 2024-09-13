const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const SuggestionSchema = new mongoose.Schema({
    username: { 
        type: String,
        required: true
    },
    suggestion: { 
        type: String, 
        required: true 
    },
    isApproved: { 
        type: Boolean, 
        default: false 
    },
    score: { 
        type: Number, 
        default: 0 
    },
    voters: [{ 
        type: String 
    }],
    CreatedAt: { 
        type: Date, 
        default: Date.now 
    },
});

const SuggestionModel = model('Suggestion', SuggestionSchema);
module.exports = SuggestionModel;
