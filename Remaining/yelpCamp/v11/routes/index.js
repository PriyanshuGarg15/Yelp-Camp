var express = require("express");
var router  = express.Router(),
    Campground = require("../models/campgrounds"),
    User = require("../models/user"),
    passport =require("passport");

//register
router.get("/register",function(req, res) {
    res.render("register")
});
//post register
router.post("/register", function(req, res) {
    User.register(new User({username: req.body.username}),req.body.password, function(err,user){
        if(err){
            req.flash("error",err.message);
            return res.redirect("/register");
        }passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp"+user.username);
            res.redirect("/campgrounds");
        })
    })
})
//login
router.get("/login", function(req, res) {
    res.render("login")
})
//post login
router.post("/login", passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res) {
})

//logout
router.get("/logout",function(req, res) {
    req.logout();
    req.flash("success", "You are successfully logged out !!");
    res.redirect("/campgrounds");
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to log in to do that!!");
    res.redirect("/login");
}


module.exports = router;
