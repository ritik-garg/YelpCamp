var express = require("express");
var router = express.Router({ mergeParams: true });
var middleware = require("../middleware");

var Campground = require("../models/campground"),
    Comment = require("../models/comment");

router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: campground });
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res) {
    Comment.create(req.body.comment, function(err, comment) {
        Campground.findById(req.params.id, function(err, campground) {
            if (err) {
                req.flash("error", "Something Went Wrong");
                console.log(err);
            } else {
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save();

                campground.comments.push(comment);
                campground.save(function(err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        req.flash("success", "Successfully Added Comment");
                        res.redirect("/campgrounds/" + req.params.id);
                    }
                });
            }
        });
    });
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            Comment.findById(req.params.comment_id, function(err, foundComment) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("comments/edit", { campground: foundCampground, comment: foundComment });
                }
            });
        }
    });
});

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;