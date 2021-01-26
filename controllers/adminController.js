const { post } = require('../routes/adminRoutes');

const Post=require('../models/PostModule').Post;
const Category=require('../models/CategoryModel').Category;
const comment=require('../models/CommentModel').Comment;
const {isEmpty}=require('../config/costomFunctions');
const { User } = require('../models/UserModel');


module.exports={
    index:(req,res)=>{
        res.render('admin/index');
    },
    getPosts:(req,res)=>{
        Post.find().populate('category').then(posts=>{
            res.render('admin/posts/index', {posts:posts});
        });
    },
    submitPosts:(req,res)=>{
        const commentsAllowed=req.body.allowComments? true: false;

        let fileName='';
        if(!isEmpty(req.files)){
            let file=req.files.uploadedFile;
            filename=file.name;
            let uploadDir='./public/uploads/';
            file.mv(uploadDir+filename,(err)=>{
                if(err){
                    throw err;
                }
            });
        }
        const newPost=new Post({
            title:req.body.title,
            description:req.body.description,
            status: req.body.status,
            allowComments:commentsAllowed,
            category:req.body.category,
            file:`/uploads/${filename}`
        });
        newPost.save().then(post=>{
            console.log(post);
            req.flash('success-message','post created sucessfully');
            res.redirect('/admin/posts');
        });
    },
    createPosts:(req,res)=>{
        Category.find().then(cats=>{
            res.render('admin/posts/create',{categories:cats});
        })
        
    },
    editPost:(req,res)=>{
        var urlArray=req.url.split('/');
        var id=urlArray[urlArray.length-1];
        Post.findById(id).then(posts=>{
            Category.find().then(cats=>{
                res.render('admin/posts/edit', {posts:posts,categories:cats});
            })
        });
    },
    editPostSubmit:(req,res)=>{
        const commentsAllowed=req.body.allowComments? true: false;
        var urlArray=req.url.split('/');
        var idA=urlArray[urlArray.length-1];
        var idB=idA.split('?');
        var id=idB[0];
        Post.findById(id).then(post=>{
            console.log(post);
            post.title=req.body.title;
            post.status=req.body.status;
            post.allowComments=commentsAllowed;
            post.description=req.body.description;
            post.category=req.body.category;

            post.save().then(updatePost=>{
                req.flash('success-message',`The post ${updatePost.title} has been updated`);
                res.redirect('/admin/posts');
            });
        });
    },
    deletePost:(req,res)=>{
        var urlArray=req.url.split('/');
        var idA=urlArray[urlArray.length-1];
        var idB=idA.split('?');
        var id=idB[0];
        Post.findByIdAndDelete(id)
        .then(deletedPost=>{
            req.flash('success-message',`the post ${deletedPost.title} has been deleted.`);
            res.redirect('/admin/posts');
        });
    },
    /*ALL CATEGORY METHODS*/
    getCategories:(req,res)=>{
        Category.find().then(cats=>{
            res.render('admin/category/index',{categories:cats});
        })
    },
    createCategory:(req,res)=>{
        var categoryName=req.body.name;
        console.log(categoryName);
        if(categoryName){
            const newCategory=new Category({
                title:categoryName
            });
            newCategory.save().then(category=>{
                res.status(200).json(category);
            });
        }
    },
    editCategoriesGetRoute:async (req,res)=>{
        var urlArray=req.url.split('/');
        var catId=urlArray[urlArray.length-1];
        const cats=await Category.find();
        Category.findById(catId).then(cat=>{
            res.render('admin/category/edit',{category:cat,categories:cats});
        });
    },
    editCategoriesPostRoute:(req,res)=>{
        var urlArray=req.url.split('/');
        var catId=urlArray[urlArray.length-1];
        const newTitle=req.body.name;
        if(newTitle){
            Category.findById(catId).then(category=>{
                category.title=newTitle;
                category.save().then(updated=>{
                    res.status(200).json({url:'/admin/category'});
                });
            });
        }
    },

    /*comment section*/
    getComment:(req,res)=>{
        Comment.find()
        .populate(User)
        .then(comment=>{
            res.send('admin/comment/index',{comment:comment});
        });
    }
};