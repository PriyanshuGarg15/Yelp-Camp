var express= require("express");
var app=express();
var bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
var campgrounds=[
    {name:"Salmon Creek",image:"https://farm9.staticflickr.com/8167/7121865553_e1c6a31f07.jpg"},
    {name:"Idaho Parks",image:"https://farm8.staticflickr.com/7205/7121863467_eb0aa64193.jpg"},
    {name:"Beach Camping",image:"https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg"}
]

app.get("/",function (req,res) {
    res.render("landing");

})

app.get("/campgrounds",function (req,res) {
    res.render("campgrounds",{campgrounds: campgrounds});

})

app.post("/campgrounds",function (req,res) {
    var name=req.body.name;
    var image=req.body.image;
    var newCampground={name: name , image: image};
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");


})

app.get("/campgrounds/new",function (req,res) {
    res.render("new");

})

app.listen(3000,function(){
    console.log("YelpCamp Server has started!!");
});