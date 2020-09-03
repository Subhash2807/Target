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

const loginCheck = (req,res,next)=>{
    if(req.isAuthenticated())
    {
        if(req.user.type=="Teacher")
        res.redirect('/home/teacher')
        else
        res.redirect('/home/student')
    }
    else{
        return next()
    }
}

module.exports = {checkAuthenticated,loginCheck}