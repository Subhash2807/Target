const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:8
    },
    coaching:{
        type:String,
        required:true
    },
    age:{
        type:Number,
    },
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})

UserSchema.pre('save',async function(next){
    var user = this;
    if(!user.isModified('password')){
        return next();
    }
    user.password = await bcrypt.hash(user.password,10);
    next();
})


const User = mongoose.model('User',UserSchema);

module.exports = User;

