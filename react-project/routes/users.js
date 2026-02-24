const express = require('express');
const router = express.Router();
const userService = require('../service/userService');
const multer = require('multer');
const path = require('path');

// 1. Change storage to Memory
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

router.post('/add', upload.single('photo'), async (req, res) => {
    try {
        const userData = req.body;

        // 2. req.file.buffer contains the actual binary data
        if (req.file) {
            userData.profile_pic = req.file.buffer; 
        }

        await userService.register(userData);
        res.status(201).json({ message: "Saved to DB successfully!" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// POST: Add new employee (from Tomcat or React)
router.post('/add', async (req, res) => {
    try {
        await userService.register(req.body);
        res.status(201).json({ message: "Successful Registration" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// POST: Login validation
router.post('/validate', async (req, res) => {
    try {
        const user = await userService.validate(req.body.userId, req.body.password);
        if (user) {
            res.status(200).json({ message: "Login Successful", user: user });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// GET: View all employees
router.get('/all', async (req, res) => {
    try {
        const users = await userService.viewAll();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT: Update employee profile info
router.put('/update/:userId', async (req, res) => {
    try {
        await userService.updateProfile(req.params.userId, req.body);
        res.status(200).json({ message: "Update successful" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT: Change password
router.put('/update-password', async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;
    try {
        await userService.updatePassword(userId, oldPassword, newPassword);
        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
});

// DELETE: Remove employee
router.delete('/delete/:userId', async (req, res) => {
    try {
        await userService.removeUser(req.params.userId);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;