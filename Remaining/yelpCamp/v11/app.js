var   express                = require("express"),
      app                    = express(),
      bodyParser             = require("body-parser"),
      mongoose               = require("mongoose"),
      flash                  = require("connect-flash"),
      passport               = require("passport"),
      LocalStrategy          = require("passport-local"),
      passportLocalMongoose  = require("passport-local-mongoose"),
      Campground             = require("./models/campgrounds"),
      Comment                = require("./models/comment"),
      User                   = require("./models/user"),
      seedDB                 = require("./seeds"),
      methodOverride         = require("method-override"),
      commentRoutes          = require("./routes/comment"),
      indexRoutes            = require("./routes/index"),
      campgroundRoutes       = require("./routes/campground");
      

//seedDB();
mongoose.connect("mongodb://localhost/yelp_camp_v11");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(flash());
app.use(express.static(__dirname + "/public"));// serving the public directory
app.use(methodOverride("_method"));//methodOverride 

//PASSPORT CONFIGURATIONS

app.use(require("express-session")({
    secret:"This is much now",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser= req.user;
    res.locals.error      = req.flash("error");
    res.locals.success    = req.flash("success");
    next();
})

app.get("/",function (req,res) {
    res.render("landing");

})
app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.listen(process.env.PORT, process.env.IP,function(){
    console.log("YelpCamp Server has started!!");
});