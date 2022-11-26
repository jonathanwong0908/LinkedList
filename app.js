const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
require("dotenv").config();

const app = express();

const authRoutes = require("./routes/auth");

mongoose.connect("mongodb://localhost/LinkedList");
// session
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false
}))

// app.use(cors());

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// passport
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
    console.log(req.isAuthenticated(), req.user);
    res.render("main");
})

app.listen(3000);