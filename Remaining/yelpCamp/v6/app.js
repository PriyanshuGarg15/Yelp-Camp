var express                  = require("express"),
      app                    = express(),
      bodyParser             = require("body-parser"),
      mongoose               = require("mongoose"),
      passport               = require("passport"),
      LocalStrategy          = require("passport-local"),
      passportLocalMongoose  = require("passport-local-mongoose"),
      Campground             = require("./models/campgrounds"),
      Comment                = require("./models/comment"),
      User                   = require("./models/user"),
      seedDB                 = require("./seeds");

seedDB();
mongoose.connect("mongodb://localhost/yelp_camp_v6");


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));// serving the public directory

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
    next();
})

app.get("/",function (req,res) {
    res.render("landing");

})

//INDEX-show all Campgrounds
app.get("/campgrounds",function (req,res) {
    Campground.find({},function (err,allCamp){
        if(err){
            console.log(err);
        }else{
            res.render("campground/index",{campgrounds: allCamp});
        }
    } )


})

//CREATE- add new campground to DB
app.post("/campgrounds",function (req,res) {
    var name=req.body.name;
    var image=req.body.image;
    var description =req.body.description;
    var newCampground={name: name , image: image,description: description};

    Campground.create(newCampground, function (err,newlyAdded) {
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }

    })
})

//NEW-show form to add new Campground
app.get("/campgrounds/new",function (req,res) {
    res.render("campground/new");

})

//SHOW-show information about one campground
app.get("/campgrounds/:id", function (req,res) {
    Campground.findById(req.params.id).populate("comments").exec( function (err,foundCampground){
        if(err){
            console.log(err)
        }else{
            res.render("campground/show",{campground: foundCampground})
        }
    });
})

//------------------------------------------
//        COMMENT ROUTES
//------------------------------------------
app.get("/campgrounds/:id/comments/new",isLoggedIn, function (req,res) {
    Campground.findById(req.params.id,function (err,campground){
        if (err){
            console.log(err);
        }else{
            res.render("comment/new",{campground: campground});
        }
    })
})

app.post("/campgrounds/:id/comments",isLoggedIn, function(req,res) {
    Campground.findById(req.params.id,function (err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        }else{
            Comment.create(req.body.comment,function(err, comment) {
                    if (err){
                        console.log(err);
                    }else{
                        campground.comments.push(comment._id);
                        campground.save();
                        res.redirect('/campgrounds/'+campground._id);
                    }
                });
        }
    })
    })
    
//AUTH routes

//register
app.get("/register",function(req, res) {
    res.render("register")
});
app.post("/register", function(req, res) {
    User.register(new User({username: req.body.username}),req.body.password, function(err,user){
        if(err){
            console.log(err);
            return res.redirect("/register");
        }passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        })
    })
})

app.get("/login", function(req, res) {
    res.render("login")
})
app.post("/login", passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res) {
})
app.get("/logout",function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP,function(){
    console.log("YelpCamp Server has started!!");
});