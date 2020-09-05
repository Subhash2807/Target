const router = require('express').Router()
const User = require('../db/modals/students')
const Qna = require('../db/modals/qna')
const Ans = require('../db/modals/ans')
const{checkAuthenticated,isVerified} = require('./auth')


const cloudinary = require('cloudinary')
require('../middleware/cloudinary')
const upload = require('../middleware/multer')


router.get('/qna/coach/:_id',checkAuthenticated, async (req,res)=>{
    try {
        const id = req.params._id
        const qna = await Qna.find({"coaching":id})
          .populate('user')
          .sort({ createdAt: 'desc' })
          .lean()
        res.render('qnacoach', {
          qna
        })
      } catch (err) {
        console.error(err)
        res.render('error/500')
      } 

})

router.get('/qna',checkAuthenticated, async (req,res)=>{
  try {
      const qna = await Qna.find({ })
        .populate('user','name avatar')
        .sort({ createdAt: 'desc' })
        .lean()
      res.render('qna', {
        qna
      })
    } catch (err) {
      console.error(err)
      res.render('error/500')
    } 

})

router.get('/qna/:_id',checkAuthenticated, async (req,res)=>{
    try {
        const id = req.params._id
        const qna = await Qna.findById(id)
          .populate('user', 'name avatar')
          .lean()
        const answers =await Ans.find({"question":id}).populate('user').lean()
        res.render('qnaandans', {
          qna,answers
        })
      } catch (err) {
        console.error(err)
        res.render('error/500')
      } 

})


router.post('/qna/coach/:_id', checkAuthenticated, upload.single('image'), async (req, res) => {
    try {
      const id = req.params._id
      if(req.file){
      const result = await cloudinary.v2.uploader.upload(req.file.path);
      req.body.image = result.secure_url}
      req.body.coaching = id
      req.body.user = req.user.id
      await Qna.create(req.body)
      res.redirect('/qna/coach/'+id)
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
})

router.post('/qna/public', checkAuthenticated, upload.single('image'), async (req, res) => {
  try {
    if(req.file){
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    req.body.image = result.secure_url}
    req.body.user = req.user.id
    await Qna.create(req.body)
    res.redirect('/qna')
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

router.post('/answer/:_id', checkAuthenticated, async (req, res) => {
    try {
        const id = req.params._id  
      req.body.user = req.user.id
      req.body.question = id
      await Ans.create(req.body)
      res.redirect('/qna/' + id)
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
})


module.exports = router