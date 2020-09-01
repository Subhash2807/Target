const mongoose = require('mongoose')
const schema = mongoose.Schema

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
        students:[{type:schema.Types.ObjectId,ref:'Student'}],
        notes:[{type:Buffer}],
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
        students:[{type:schema.Types.ObjectId,ref:'Student'}],
        notes:[{type:Buffer}],
        Teacher:{type:schema.Types.ObjectId,ref:'Teacher'},
    }],
default:[{
    subject:'Physics'
},{subject:'Chemistry'},{subject:'Maths'}]}

})

coachingSchema.pre('save',function(next){
    const coaching = this;
    // coaching.xi.push({subject:'Physics'})
    // coaching.xi.push({subject:'Chemistry'})
    // coaching.xi.push({subject:'Maths'})
    // coaching.xii.push({subject:'Physics'})
    // coaching.xii.push({subject:'Chemistry'})
    // coaching.xii.push({subject:'Maths'})

next();


})

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