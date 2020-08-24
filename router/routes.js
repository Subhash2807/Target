const router = require('express').Router()
const User = require('../db/user')
const passport = require('passport')
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('connect-flash')


router.use(cookieParser('secret'))
router.use(session({
    secret:process.env.SECRET,
    resave:true,
    saveUninitialized:true,
    maxAge:60*60*24*2*1000
}))

router.use(passport.initialize())
router.use(passport.session())

router.use(flash())

//Global variable

router.use((req,res,next)=>{
    res.locals.success_message = req.flash('success_message')
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error')
    next();
})


const checkAuthenticated =(req,res,next)=>{
    if(req.isAuthenticated())
    {
        res.set('Cache-control','no-cache,private,no-store,must-revalidate,post-check=0,pre-check=0');
        return next();
    }
    else{
        res.redirect('/login');
    }
}



// Authentication Strategy

var localStrategy = require('passport-local').Strategy
 passport.use(new localStrategy({usernameField:'email'},(username,password,done)=>{
    User.findOne({email:username},(err,data)=>{
        if(err) throw err;
        if(!data)
        {
            return done(null,false,{message:"no such user is exited"})
        }
        bcrypt.compare(password,data.password,(err,match)=>{
            if(err)
            {
                return done(null,false);
            }
            else if (!match)
            {
                return done(null,false,{message:"password doesn't matched"})
            }
            if(match)
            {
                return done(null,data);
            }
        })
    })
 }))

 passport.serializeUser((user,cb)=>{
     cb(null,user.id)
 })

 passport.deserializeUser((id,cb)=>{
     User.findById(id,(err,user)=>{
         cb(err,user)
     })
 })

 // end of authentication strategy






router.get('/login',(req,res)=>{
    res.render('login')
})

router.get('/register',(req,res)=>{
    res.render('register');
})

router.post('/register',async (req,res)=>{
    var {name,email,password,password2,coaching} = req.body;

    if(password2!==password)
    {
       return res.render('register',{err:'password doesn\'t matched'})
    }
    if(!email || !password || !coaching || !name)
    {
        return res.render('register',{err:'all field must be filled'})
    }
    if(password.length<8)
    {
        return res.render('register',{err:'min password length is 8'})
    }
    try{

        var user = await User.findOne({email});
        console.log(user)
        if(user)
        {
            return res.render('register',{err:'user exit with this username'});
        }
        else{
            user = new User({email,password,name,coaching});
            await user.save();
            req.flash('success_message',"register successfully....logijn to continue")
            return res.redirect('/login');
            
        }
    }
    catch(e)
    {
        console.log(e)
        return res.render('register',{err:e})
    }
})

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        failureRedirect:'/login',
        successRedirect:'/home',
        failureFlash:true
    })(req,res,next);
})

router.get('/home',checkAuthenticated,(req,res)=>{
    res.render('home',{name:req.user.name,email:req.user.email,coaching:req.user.coaching});
})


router.get('/logout',(req,res)=>{
    req.logOut();
    res.redirect('/login');
})

module.exports = router;    