const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const upload = require("../middleware/uploadPict");

const router = express.Router();

// Endpoint regist user
router.post("/regist", upload.single("image"), async (req, res) => {
  try {
    const { address, name, email, social } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Gambar harus diupload" });
    }

    const newUser = new User({
      address,
      name,
      email,
      social,
      image: req.file.path, // Simpan URL gambar dari Cloudinary
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: "User berhasil disimpan!", user: savedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint GET user berdasarkan address
router.get("/searchByAddress", async (req, res) => {
  try {
    const { address } = req.query;
    if (!address) {
      return res.status(400).json({ message: "Address harus diberikan!" });
    }

    const users = await User.find({ address: new RegExp(address, "i") }); // Case-insensitive search
    if (users.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan!" });
    }

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan!", error });
  }
});

// Endpoint update user
router.put("/update/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;

    // Pastikan ID valid sebelum digunakan
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "ID tidak valid" });
    }

    const { address, name, email, social } = req.body;
    let updateData = { address, name, email, social };

    if (req.file) {
      updateData.image = req.file.path; // Update gambar jika ada file baru
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    res.json({ message: "User berhasil diperbarui!", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint delete user
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Pastikan ID valid sebelum digunakan
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "ID tidak valid" });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    res.json({ message: "User berhasil dihapus!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET semua data dari test_donasi
router.get("/allData", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// // POST data baru ke test_donasi
// router.post("/", async (req, res) => {
//   try {
//     const newUser = new User({
//       addres: req.body.addres,
//       name: req.body.name,
//       alamat: req.body.alamat,
//     });
//     const savedUser = await newUser.save();
//     res.status(201).json(savedUser);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

module.exports = router;
