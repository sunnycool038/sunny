const {globalVariables}= require("./config/configuration");
const express= require('express');
const bodyParser=require('body-parser');
const mongoose= require('mongoose');
const path=require('path');
const hbsexp=require('express-handlebars');
const Handlebars=require('handlebars');
const {allowInsecurePrototypeAccess}=require('@handlebars/allow-prototype-access');
const {mongoDbUrl,PORT}=require('./config/configuration');
const flash= require('connect-flash');
const session=require('express-session');
const methodOverride=require('method-override');
const {selectOption}=require('./config/costomFunctions');
const fileUpload=require('express-fileupload');
const passport=require('passport');

const app=express();

//configure mongoose to connect to mongodb
mongoose.connect(mongoDbUrl,{useNewUrlParser:true})
.then(response=>{
    console.log('mongodb connected successfully.');
}).catch(err=>{
    console.log('database econnection failed');
});

/*configure express */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));



/*flash and session */
app.use(session({
    secret:'anysecret',
    saveUninitialized:true,
    resave:true
}));
app.use(flash());
app.use(globalVariables);

/*passport middleware*/
app.use(passport.initialize());
app.use(passport.session());

/*file upload middleware*/
app.use(fileUpload());


/*set up view engine to use handlebars*/
const hbs=hbsexp.create({
    defaultLayout:'default',
    extname:'handlebars',
    helpers:{select:selectOption},
    handlebars:allowInsecurePrototypeAccess(Handlebars)
})
app.engine('handlebars',hbs.engine);
app.set('view engine','handlebars');

/*method override middleware*/
//app.use(methodOverride('newMethod'));

/*routes*/
const defaultRoutes=require('./routes/defaultRoutes');
const adminRoutes=require('./routes/adminRoutes');
app.use('/',defaultRoutes);
app.use('/admin',adminRoutes);

app.use('/',(req,res)=>{
    res.send('Welcome to the cms app');
})

/*start the server*/
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})


