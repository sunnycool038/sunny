const Post=require('../models/PostModule').Post;
const Category=require('../models/CategoryModel').Category;
const User=require('../models/UserModel').User;
const bcrypt=require('bcryptjs');
const passport=require('passport');
const local=require('passport-local');

module.exports={
    index:async (req,res)=>{
        const posts= await Post.find();
        const categories=await Category.find();
        console.log(categories);
        res.render('default/index',{posts:posts,categories:categories});
    },
    loginGet:(req,res)=>{
        res.render('default/login');
    },
    loginPost:(req,res)=>{
        res.send('you have succesfully submitted data in');
    },
    registerGet:(req,res)=>{
        res.render('default/register');
    },
    registerPost:(req,res)=>{
        let errors=[];
        if(!req.body.firstName){
            errors.push({message:'First Name is mandatory'});
        }
        if(!req.body.lastName){
            errors.push({message:'Last Name is mandatory'});
        }
        if(!req.body.email){
            errors.push({message:'Email is mandatory'});
        }
        if(!req.body.password){
            errors.push({message:'Password is mandatory'});
        }
        if(!req.body.passwordComfirm){
            errors.push({message:'Passwords do not match'});
        }

        if(errors.length>0){
            console.log(errors);
            res.render('default/register',{
                errors:errors,
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                email:req.body.email
            });
        }else{
            User.findOne({email:req.body.email}).then(user=>{
                if(user){
                    req.flash('error-message','Email already exist,try to login');
                    req.redirect('/login');
                }else{
                    const newUser=new User(req.body);
                    bcrypt.genSalt(10,(err,salt)=>{
                        bcrypt.hash(newUser.password,salt,(err,hash)=>{
                            newUser.password=hash;
                            newUser.save().then(user=>{
                                req.flash('success-message','You are now registered');
                                res.redirect('/login');
                            });
                        });
                    });
                }
            });
        }
    },
    singlePost:(req,res)=>{
        var urlArray=req.url.split('/');
        var id=urlArray[urlArray.length-1];
        Post.findById(id).then(post=>{
            if(!post){
                res.status(404).json({message:'No post found'});
            }
            else{
                res.render('default/singlePost');
            }
        });
    }
};