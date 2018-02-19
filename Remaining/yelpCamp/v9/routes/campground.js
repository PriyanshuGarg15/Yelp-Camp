var express    = require("express"),
    router     = express.Router(),
    Campground = require("../models/campgrounds");

//INDEX-show all Campgrounds
router.get("/",function (req,res) {
    Campground.find({},function (err,allCamp){
        if(err){
            console.log(err);
        }else{
            res.render("campground/index",{campgrounds: allCamp});
        }
    } )
})

//CREATE- add new campground to DB
router.post("/",isLoggedIn ,function (req,res) {
    var name=req.body.name;
    var image=req.body.image;
    var author= {
        id: req.user._id,
        username: req.user.username
    }
    // console.log(req.user.username);
    var description =req.body.description;
    var newCampground={name: name , image: image,description: description,author: author};
    Campground.create(newCampground, function (err,newlyAdded) {
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    })
})

//NEW-show form to add new Campground
router.get("/new",isLoggedIn , function (req,res) {
    res.render("campground/new");
})

//SHOW-show information about one campground
router.get("/:id", function (req,res) {
    Campground.findById(req.params.id).populate("comments").exec( function (err,foundCampground){
        if(err){
            console.log(err)
        }else{
            res.render("campground/show",{campground: foundCampground})
        }
    });
})
//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;