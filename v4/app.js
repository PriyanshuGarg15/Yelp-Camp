var express           = require("express"),c
      app                  = express(),
      bodyParser     = require("body-parser"),
      mongoose       = require("mongoose"),
      Campground   = require("./models/campgrounds"),
      Comment          = require("./models/comment"),
      seedDB            = require("./seeds");

seedDB();
mongoose.connect("mongodb://localhost/yelp_camp");


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");

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
app.get("/campgrounds/:id/comments/new", function (req,res) {
    Campground.findById(req.params.id,function (err,campground){
        if (err){
            console.log(err);
        }else{
            res.render("comment/new",{campground: campground});
        }
    })
})

app.post("/campgrounds/:id/comments",function(req,res) {
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


app.listen(3000,function(){
    console.log("YelpCamp Server has started!!");
});