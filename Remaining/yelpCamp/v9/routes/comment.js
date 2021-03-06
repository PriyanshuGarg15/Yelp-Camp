var express = require("express");
var router  = express.Router({ mergeParams: true}),
    Campground = require("../models/campgrounds"),
    Comment   = require("../models/comment")

//new comment
router.get("/new",isLoggedIn, function (req,res) {
    Campground.findById(req.params.id,function (err,campground){
        if (err){
            console.log(err);
        }else{
            res.render("comment/new",{campground: campground});
        }
    })
})

router.post("/",isLoggedIn, function(req,res) {
    Campground.findById(req.params.id,function (err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        }else{
            Comment.create(req.body.comment,function(err, comment) {
                    if (err){
                        console.log(err);
                    }else{
                        comment.author.id = req.user._id;
                        comment.author.username = req.user.username;
                        comment.save();
                        campground.comments.push(comment._id);
                        campground.save();
                        res.redirect('/campgrounds/'+campground._id);
                    }
                });
        }
    })
    })
//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;