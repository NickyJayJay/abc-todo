const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    status: {
        type: String,
        default: ""
    },
    priority: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        trim: true,
        maxLength: [120, 'description can not be more than 120 characters']
    },
    id: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('Task', TaskSchema);