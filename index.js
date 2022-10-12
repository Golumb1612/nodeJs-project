const express = require("express");
require("dotenv").config()
const mongoose = require("mongoose");
const register = require("./routes/register");
const login = require("./routes/login");
const profile = require("./routes/profile");
const bizCard = require("./routes/bizcard");

const PORT = process.env.PORT || 8000;
const app = express();
app.use(express.json())

mongoose.connect(process.env.db, {
        useNewUrlParser: true
    })
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.log(err));
    
    
    app.use("/api/register", register);
    app.use("/api/login", login);
    app.use("/api/profile", profile);
    app.use("/api/bizcard", bizCard);

    app.get("*", (req, res) => {
      res.send("Lost something?");
    });

app.listen(PORT, () => console.log("Server connected on port", PORT));