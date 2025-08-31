const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Url = require("./models/url.js");
const { nanoid } = require("nanoid");
const validUrl = require("valid-url"); // For URL validation
require("dotenv").config(); // To read .env file
const path = require("path");

const MONGO_URL = "mongodb://127.0.0.1:27017/URL_SHORTENER";
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const session = require("express-session");

app.use(session({
  secret: "your-secret-key", // replace with something secure
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24*60*60*1000 } // 1 day
}));


// Connect to DB
main().then(() => console.log("Connected to DB"))
      .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

// Listen
let port = 5000;
app.listen(port, () => console.log(`Port is listening on ${port}`));

// Home page
app.get("/", (req, res) => {
  res.render("index.ejs");
});

// POST /shorten
app.post("/shorten", async (req, res) => {
  const { originalUrl, customCode, expireDays } = req.body;

  // URL validation
  if (!validUrl.isUri(originalUrl)) {
    return res.render("index.ejs", { error: "Please enter a valid URL!", success: null });
  }

  // Generate short code
  let shortCode = customCode || nanoid(6);

  try {
    // Check if code already exists
    const existing = await Url.findOne({ shortCode });
    if (existing) {
      return res.render("index.ejs", { error: "This custom code is already taken!", success: null });
    }

    // Expiration date
    let expiresAt = null;
    if (expireDays && !isNaN(expireDays)) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(expireDays));
    }

    // Save to DB
    const newUrl = new Url({
      originalUrl,
      shortCode,
      expiresAt
    });
    await newUrl.save();

    // Session-based history
    if (!req.session.history) req.session.history = [];
    req.session.history.push({
      originalUrl,
      shortUrl: `${process.env.BASE_URL}/${shortCode}`,
      expiresAt: expiresAt,
      clicks: 0
    });

    // Render show.ejs with all data
    res.render("show.ejs", {
      shortUrl: `${process.env.BASE_URL}/${shortCode}`,
      clicks: 0,
      expiresAt: expiresAt,
      history: req.session.history
    });

  } catch (err) {
    console.error(err);
    res.render("index.ejs", { error: "Something went wrong. Try again!", success: null });
  }
});


// GET /:shortCode
app.get("/:shortCode", async (req, res) => {
  const { shortCode } = req.params;

  try {
    const urlDoc = await Url.findOne({ shortCode });

    if (!urlDoc) return res.status(404).send("Short URL not found");

    // Step 3: Check expiration
    if (urlDoc.expiresAt && new Date() > urlDoc.expiresAt) {
      return res.status(410).send("This short URL has expired.");
    }

    // Step 1: Increment click counter
    urlDoc.clicks++;
    await urlDoc.save();

    res.redirect(urlDoc.originalUrl);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});
