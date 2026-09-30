const express = require("express");

const db = require("../database/db");
const requireLogin = require("../middleware/auth");

const router = express.Router();


// GET OWN PROFILE
router.get("/", requireLogin, (req, res) => {

    db.get(
        `SELECT id, username, email, name, bio, profile_photo
         FROM users
         WHERE id = ?`,
        [req.session.userId],
        (err, user) => {

            if (err || !user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            db.all(
                `SELECT id, title, url, position
                 FROM links
                 WHERE user_id = ?
                 ORDER BY position`,
                [req.session.userId],
                (err, links) => {

                    res.json({
                        user,
                        links
                    });

                }
            );

        }
    );

});


// UPDATE PROFILE
router.put("/", requireLogin, (req, res) => {

    const { name, bio, profile_photo } = req.body;

    db.run(
        `
        UPDATE users
        SET name = ?, bio = ?, profile_photo = ?
        WHERE id = ?
        `,
        [
            name,
            bio,
            profile_photo,
            req.session.userId
        ],
        err => {

            if (err) {
                return res.status(500).json({
                    message: "Update failed"
                });
            }

            res.json({
                message: "Profile updated"
            });

        }
    );

});


// ADD LINK
router.post("/links", requireLogin, (req, res) => {

    const { title, url } = req.body;

    if (!title || !url) {
        return res.status(400).json({
            message: "Title and URL are required"
        });
    }

    try {

        new URL(url);

    } catch {

        return res.status(400).json({
            message: "Invalid URL"
        });

    }

    db.get(
        `SELECT MAX(position) AS maxPosition
         FROM links
         WHERE user_id = ?`,
        [req.session.userId],
        (err, row) => {

            const position =
                row.maxPosition === null
                    ? 0
                    : row.maxPosition + 1;

            db.run(
                `
                INSERT INTO links
                (user_id, title, url, position)
                VALUES (?, ?, ?, ?)
                `,
                [
                    req.session.userId,
                    title,
                    url,
                    position
                ],
                function (err) {

                    if (err) {
                        return res.status(500).json({
                            message: "Could not add link"
                        });
                    }

                    res.json({
                        message: "Link added",
                        id: this.lastID
                    });

                }
            );

        }
    );

});


// DELETE LINK
router.delete("/links/:id", requireLogin, (req, res) => {

    db.run(
        `
        DELETE FROM links
        WHERE id = ?
        AND user_id = ?
        `,
        [
            req.params.id,
            req.session.userId
        ],
        function (err) {

            if (err) {
                return res.status(500).json({
                    message: "Delete failed"
                });
            }

            if (this.changes === 0) {
                return res.status(403).json({
                    message: "You cannot delete this link"
                });
            }

            res.json({
                message: "Link deleted"
            });

        }
    );

});


module.exports = router;