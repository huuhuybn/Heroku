const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String, required: true
    },
    timePublished: {
        type: String, required: true
    },
    img: {
        type: String
    }
})
module.exports = itemSchema
