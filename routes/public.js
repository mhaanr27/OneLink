const express = require("express");

const db = require("../database/db");

const router = express.Router();

router.get("/:username", (req, res) => {

    const username = req.params.username;

    db.get(
        `
        SELECT username, name, bio, profile_photo
        FROM users
        WHERE username = ?
        `,
        [username],
        (err, user) => {

            if (err || !user) {
                return res.status(404).json({
                    message: "Profile not found"
                });
            }

            db.all(
                `
                SELECT title, url
                FROM links
                WHERE user_id = ?
                ORDER BY position
                `,
                [user.id],
                (err, links) => {

                    res.json({
                        user: {
                            username: user.username,
                            name: user.name,
                            bio: user.bio,
                            profile_photo: user.profile_photo
                        },
                        links
                    });

                }
            );

        }
    );

});

module.exports = router;