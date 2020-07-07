const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    full_name: {
        type: String
    },
    role: {
        type: String
    },
    birthday: {
        type: Date
    }
})
module.exports = userSchema
