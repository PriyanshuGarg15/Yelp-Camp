var express = require("express");
var router  = express.Router({ mergeParams: true}),
    Campground = require("../models/campgrounds"),
    Comment   = require("../models/comment"),
    middleware = require("../middleware");

//new comment
router.get("/new",middleware.isLoggedIn, function (req,res) {
    Campground.findById(req.params.id,function (err,campground){
        if (err){
            console.log(err);
        }else{
            res.render("comment/new",{campground: campground});
        }
    })
})

router.post("/",middleware.isLoggedIn, function(req,res) {
    Campground.findById(req.params.id,function (err,campground){
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong!!");
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
                        req.flash("success", "Comment Successfully Added!!");
                        res.redirect('/campgrounds/'+campground._id);
                    }
                });
        }
    })
    })
    
    //Edit Comment
router.get("/:comment_id/edit",middleware.checkCommentOwner, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          req.flash("error", "You are not Permitted to do that!!");
          res.redirect("back");
      } else {
        res.render("comment/edit", {campground_id: req.params.id, comment: foundComment});
      }
   });
});
//Update comment
router.put("/:comment_id",middleware.checkCommentOwner, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back")
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
} )
//Delete Campground
router.delete("/:comment_id",middleware.checkCommentOwner, function(req, res){
     Comment.findByIdAndRemove(req.params.comment_id,function(err){
         if(err){
             res.redirect("/campgrounds/"+req.params.id);
         }else{
             req.flash("success", "Comment is Successfully deleted !!");
             res.redirect("/campgrounds/"+req.params.id);
         }
     })
})

module.exports = router;