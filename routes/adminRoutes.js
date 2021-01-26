const express=require('express');
const router=express.Router({mergeParams:true});
const adminController=require('../controllers/adminController');
const {isUserAuthenticated}=require('../config/costomFunctions');


router.all('/*',isUserAuthenticated,(req,res,next)=>{
    req.app.locals.layout='admin';
    next();
})

router.route('/')
    .get(adminController.index);

router.route('/posts')
    .get(adminController.getPosts);

router.route('/posts/create')
    .get(adminController.createPosts)
    .post(adminController.submitPosts);

router.route('/posts/edit/:1d')
    .get(adminController.editPost)
    .put(adminController.editPostSubmit);

router.route('/posts/delete/:id')
    .delete(adminController.deletePost);

/*admin category route*/
router.route('/category')
    .get(adminController.getCategories)
    .post(adminController.createCategory);

router.route('/category/edit/:id')
    .get(adminController.editCategoriesGetRoute)
    .post(adminController.editCategoriesPostRoute);

router.route('/comment')
    .get(adminController.getComment);

module.exports=router;