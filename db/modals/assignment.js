const mongoose = require('mongoose')
const schema = mongoose.Schema

const assignmentSchema = new schema({
    file:Buffer,
    email:String,
    coaching:String,
    subject:String 
})

module.exports = mongoose.model('Assignment',assignmentSchema);