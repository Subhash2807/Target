const router = require('express').Router()
const Student = require('../db/modals/students')
const Teacher = require('../db/modals/teachers')
const Coaching = require('../db/modals/coaching')
const Assignment = require('../db/modals/assignment')
const{checkAuthenticated} = require('./auth')
const multer = require('multer')
const e = require('express')
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


router.get('/home/student',checkAuthenticated,async (req,res)=>{

    const coaching = await Coaching.findOne({name:req.user.coaching})
    
    res.render('student',{name:req.user.name,email:req.user.email,coaching:req.user.coaching,image:req.user.avatar,coach:coaching[req.user.class],err:res.locals.error_message,succ:res.locals.success_message});
})

router.post('/addcoaching',checkAuthenticated,async(req,res)=>{
    try {
        let flag = 0;
        req.user.data.forEach(data=>{
            
            if(data.coaching==req.body.coaching)
            {
                const subj = data.subjects.find(subject=> subject===req.body.subject)
                console.log(subj)
                if(subj)
                {
                    flag=1;
                }
                else{
                    data.subjects.push(req.body.subject)
                }
            }
        })


        if(flag==1)
        {
            
            return res.redirect('/home/student')
        }
        else{
            const coaching = await Coaching.findOne({name:req.body.coaching})
            if(!coaching)
            {
                req.flash('error_message','no coaching exit');
                return res.redirect('/home/student')
            }
            coaching.students.push(req.user.id)
            coaching[req.user.class].forEach(data=>{
                if(data.subject===req.body.subject)
                {
                    data.students.push(req.user.id)
                }
            })

            await coaching.save();
            req.user.data.push({
                coaching:req.body.coaching,
                subjects:[req.body.subject]
            })
            await req.user.save()

            req.flash("sucess_messae","new subject added")
            res.redirect("/home/student")
        }
       return res.redirect('/home/student')
    } catch (error) {
        req.flash('error_message',error.message)
        res.redirect('/home/student')
    }
})


router.post('/submit',upload.single('file'),checkAuthenticated,async (req,res)=>{
    if(!req.file)
    {
        req.flash('error_message','no file is uploaded')
        return res.redirect('/home/student')
    }
    else{
        req.body.file = req.file.buffer
        req.body.fileName = req.file.originalname
    }
    try {
        const coaching = await Coaching.findOne({name:req.body.coaching})
        if(!coaching)
        {
            req.flash('error_message','no coaching exit')
            return res.redirect('/home/student');
        }
        const assignment = new Assignment({...req.body,email:req.user.email})
        const result = await assignment.save();
        
        req.user.assignments.push(result.id);
        coaching[req.user.class].forEach((clas)=>{
            const present = clas.students.find(id=>{
                return id==req.user.id
            })
            console.log(present)
            if(present && clas.subject==req.body.subject)
            {
                clas.Assignment.push(result.id);
                
            }
        })
        await coaching.save()
        await req.user.save()
        req.flash('success_message','submitted')
        res.redirect('/home/student')
    } catch (error) {
        req.flash('error_message',error.message)
        res.redirect('/home/student')
        throw new Error(error)
    }
})

module.exports = router