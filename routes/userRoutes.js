const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const upload = require("../middleware/uploadPict");

const router = express.Router();

/**
 * @swagger
 * /users/regist:
 *   post:
 *     summary: Registrasi user baru
 *     description: Menambahkan user baru ke database dengan gambar profil
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               social:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User berhasil disimpan!
 *       400:
 *         description: Gambar harus diupload atau request tidak valid.
 */
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

/**
 * @swagger
 * /users/searchByAddress:
 *   get:
 *     summary: Cari user berdasarkan address
 *     description: Mengambil daftar user berdasarkan address yang diberikan.
 *     parameters:
 *       - name: address
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Data user yang cocok ditemukan
 *       400:
 *         description: Address harus diberikan
 *       404:
 *         description: User tidak ditemukan
 */
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

/**
 * @swagger
 * /users/update/{id}:
 *   put:
 *     summary: Update user
 *     description: Mengupdate data user berdasarkan ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               social:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User berhasil diperbarui
 *       400:
 *         description: ID tidak valid atau request tidak valid
 *       404:
 *         description: User tidak ditemukan
 */
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

/**
 * @swagger
 * /users/delete/{address}:
 *   delete:
 *     summary: Delete user berdasarkan address
 *     description: Menghapus user berdasarkan address yang diberikan.
 *     parameters:
 *       - name: address
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Data user yang cocok ditemukan
 *       400:
 *         description: Address harus diberikan
 *       404:
 *         description: User tidak ditemukan
 */
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

/**
 * @swagger
 * /users/allData:
 *   get:
 *     summary: Ambil semua data user
 *     description: Mengambil seluruh data user yang tersimpan di database.
 *     responses:
 *       200:
 *         description: Data user berhasil diambil
 *       500:
 *         description: Terjadi kesalahan server
 */
router.get("/allData", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
