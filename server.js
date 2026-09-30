const express = require("express");
const session = require("express-session");

const db = require("./database/db");
const authRoutes = require("./routes/auth");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: "onelink-secret",
        resave: false,
        saveUninitialized: false
    })
);

app.use(express.static("public"));

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.listen(3000, () => {
    console.log("OneLink server running at http://localhost:3000");
});