var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    flash = require("connect-flash");

var passport = require("passport"),
    LocalStrategy = require("passport-local");

var Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user");

var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index");

var app = express();

// var seedDB = require("./seeds");
// seedDB();

app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
    secret: "Any Statement",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.connect("mongodb://127.0.0.1:27017/yelpcamp");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, function() {
    console.log("server started");
});