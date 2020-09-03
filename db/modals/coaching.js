const mongoose = require('mongoose')
const schema = mongoose.Schema
const { v4: uuidV4 } = require('uuid')


const coachingSchema = new schema({
    name:{
        type:String,
        trim:true,
        unique:true
    },
    email:String,
    avatar:Buffer,
    address:String,
    students:[{type:schema.Types.ObjectId,ref:'Student'}],
    teachers:[{type:schema.Types.ObjectId,ref:'Teacher'}],
    xi:{type:[{
        subject:String,
        Assignment:[{type:schema.Types.ObjectId,ref:'Assignment'}],
        link:String,
        students:[{type:schema.Types.ObjectId,ref:'Student'}],
        notes:{type:[{fileName:String,
            file:Buffer}]},
        Teacher:{type:schema.Types.ObjectId,ref:'Teacher'},
    }],
        default:[{
            subject:'Physics'
        },
        {subject:'Chemistry'},
        {subject:'Maths'}
    ]},

    xii:{type:[{
        subject:String,
        Assignment:[{type:schema.Types.ObjectId,ref:'Assignment'}],
        link:String,
        students:[{type:schema.Types.ObjectId,ref:'Student'}],
        notes:{type:[{fileName:String,
        file:Buffer}]},
        Teacher:{type:schema.Types.ObjectId,ref:'Teacher'},
    }],
default:[{
    subject:'Physics'
},{subject:'Chemistry'},{subject:'Maths'}]}

})

coachingSchema.methods.toJSON = function()
{
    const coaching = this
    const coachingObject = coaching.toObject()
    delete coachingObject.students
    return coachingObject
}

const Coaching = mongoose.model('Coaching',coachingSchema);
module.exports = Coaching;

// xi:[{
//     subject:{
//         type:String,
//         default:'Physics'
//     },
//     Assignment:[{type:schema.Types.ObjectId,ref:'Assignment'}],
//     students:[{type:schema.Types.ObjectId,ref:'Student'}],
//     notes:[{type:Buffer}],
//     Teacher:{type:schema.Types.ObjectId,ref:'Teacher'},
    
// },
// {
//     subject:{
//         type:String,
//         default:'Chemistry'
//     },
//     Assignment:[{type:schema.Types.ObjectId,ref:'Assignment'}],
//     students:[{type:schema.Types.ObjectId,ref:'Student'}],
//     notes:[{type:Buffer}],
//     Teacher:{type:schema.Types.ObjectId,ref:'Teacher'},
    
// },
// {
//     subject:{
//         type:String,
//         default:'Maths'
//     },
//     Assignment:[{type:schema.Types.ObjectId,ref:'Assignment'}],
//     students:[{type:schema.Types.ObjectId,ref:'Student'}],
//     notes:[{type:Buffer}],
//     Teacher:{type:schema.Types.ObjectId,ref:'Teacher'},
    
// }],
// xii:[{
//     subject:{
//         type:String,
//         default:'Physics'
//     },
//     Assignment:[{type:schema.Types.ObjectId,ref:'Assignment'}],
//     students:[{type:schema.Types.ObjectId,ref:'Student'}],
//     notes:[{type:Buffer}],
//     Teacher:{type:schema.Types.ObjectId,ref:'Teacher'},
    
// },
// {
//     subject:{
//         type:String,
//         default:'Chemistry'
//     },
//     Assignment:[{type:schema.Types.ObjectId,ref:'Assignment'}],
//     students:[{type:schema.Types.ObjectId,ref:'Student'}],
//     notes:[{type:Buffer}],
//     Teacher:{type:schema.Types.ObjectId,ref:'Teacher'},
    
// },
// {
//     subject:{
//         type:String,
//         default:'Maths'
//     },
//     Assignment:[{type:schema.Types.ObjectId,ref:'Assignment'}],
//     students:[{type:schema.Types.ObjectId,ref:'Student'}],
//     notes:[{type:Buffer}],
//     Teacher:{type:schema.Types.ObjectId,ref:'Teacher'},
    
// }]