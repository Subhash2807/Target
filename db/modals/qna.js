const mongoose = require('mongoose')

const QnaSchema = new mongoose.Schema({
    body:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    answers:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ans"
    },
    coaching:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coaching"
    }
})


const Qna = mongoose.model('Qna',QnaSchema);

module.exports = Qna;
