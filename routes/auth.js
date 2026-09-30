const express = require("express");
const bcrypt = require("bcrypt");

const db = require("../database/db");

const router = express.Router();


// REGISTER
router.post("/register", async (req, res) => {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            `
            INSERT INTO users
            (username, email, password, name, bio)
            VALUES (?, ?, ?, ?, ?)
            `,
            [username, email, hashedPassword, "", ""],
            function (err) {

                if (err) {

                    if (err.message.includes("UNIQUE")) {
                        return res.status(400).json({
                            message: "Username or email already exists"
                        });
                    }

                    return res.status(500).json({
                        message: "Registration failed"
                    });
                }

                res.json({
                    message: "Account created successfully"
                });

            }
        );

    } catch (error) {

        res.status(500).json({
            message: "Server error"
        });

    }

});


// LOGIN
router.post("/login", (req, res) => {

    const { email, password } = req.body;

    db.get(
        `SELECT * FROM users WHERE email = ?`,
        [email],
        async (err, user) => {

            if (err || !user) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }

            const match = await bcrypt.compare(
                password,
                user.password
            );

            if (!match) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }

            req.session.userId = user.id;

            res.json({
                message: "Login successful",
                username: user.username
            });

        }
    );

});


// LOGOUT
router.post("/logout", (req, res) => {

    req.session.destroy(() => {

        res.json({
            message: "Logged out"
        });

    });

});


module.exports = router;