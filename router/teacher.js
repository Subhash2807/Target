const router = require('express').Router()
const Student = require('../db/modals/coaching')
const Teacher = require('../db/modals/teachers')
const Coaching = require('../db/modals/coaching')
const Assignment = require('../db/modals/assignment')
const{checkAuthenticated} = require('./auth')
const multer = require('multer')
const upload = new multer({
    limits:{
        fileSize:5000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(pdf)/)){
            return cb(new Error('upload image only'))
        }
        cb(undefined,true)
    }
})

router.get('/home/teacher',checkAuthenticated,async(req,res)=>{
    const assignments = await Assignment.find({coaching:req.user.coaching,subject:req.user.subject})
    // console.log(assignments)
    const coaching = await Coaching.findOne({name:req.user.coaching}).populate(`${req.user.class}`)
    const link = `${req.user.class}${req.user.class}${req.user.subject}`
    res.render('teacher',{name:req.user.name,email:req.user.email,coaching:req.user.coaching,image:req.user.avatar,assignments,link:link});
})

router.post('/notes',checkAuthenticated,upload.single('file'),async (req,res,next)=>{
    
    try {
        const coaching = await Coaching.findOne({name:req.user.coaching})
        coaching[req.user.class].forEach(subj=>{
            if(subj.subject==req.user.subject)
            {
                const temp ={
                    fileName:req.file.originalname,
                    file:req.file.buffer
                }
                subj.notes.push(temp)

            }
        })
        await coaching.save();
    } catch (error) {
        throw new Error(error)
    }
    res.redirect('/home/teacher')
})

module.exports = router

