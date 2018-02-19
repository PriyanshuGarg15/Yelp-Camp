var express           = require("express"),c
      app                  = express(),
      bodyParser     = require("body-parser"),
      mongoose       = require("mongoose"),
      Campground   = require("./models/campgrounds"),
      comment          = require("./models/comment"),
      seedDB            = require("./seeds");

seedDB();
mongoose.connect("mongodb://localhost/yelp_camp");

// Campground.create( {name:"Salmon Creek",image:"https://farm9.staticflickr.com/8167/7121865553_e1c6a31f07.jpg"
//                                    description:"This is a huge Granite Hill, Granite is a good Container. No Bathrooms, No water !" },
//      function (err,campground) {
//     if (err){
//         console.log(err);
//     }else{
//         console.log(campground);
//     }
//
//     }
// );

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
            res.render("index",{campgrounds: allCamp});
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
    res.render("new");

})

//SHOW-show information about one campground
app.get("/campgrounds/:id", function (req,res) {
    Campground.findById(req.params.id).populate("comments").exec( function (err,foundCampground){
        if(err){
            console.log(err)
        }else{
            res.render("show",{campground: foundCampground})
        }
    });
})

app.listen(3000,function(){
    console.log("YelpCamp Server has started!!");
});