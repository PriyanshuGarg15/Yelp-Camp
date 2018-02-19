var middlewareObj={},
    Campground = require("../models/campgrounds"),
    Comment   = require("../models/comment");
    
middlewareObj.checkCampgroundOwner = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground) {
            if(err){
                req.flash("error", "Something went wrong !!");
                res.redirect("back")
            }else{
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You are not Permitted to do that!!");
                    res.redirect("back");
                }
            }
        })
    }else{
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwner = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err){
                req.flash("error", "Something went wrong !!");
                res.redirect("back")
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You are not Permitted to do tha !!");
                    res.redirect("back");
                }
            }
        })
    }else{
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be signed in to do that!!");
    res.redirect("/login");
}


module.exports = middlewareObj;