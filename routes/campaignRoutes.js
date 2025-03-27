const express = require("express");
const mongoose = require("mongoose");
const Campaign = require("../models/campaignModel");
const upload = require("../middleware/uploadPict");

const router = express.Router();

/**
 * @swagger
 * /campaigns/createCampaign:
 *   post:
 *     summary: Membuat campaign baru
 *     description: Menambahkan campaign baru ke database collection "campaigns"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               contractAddress:
 *                 type: string
 *               name:
 *                 type: string
 *               typeAnimal:
 *                 type: string
 *               description:
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
router.post("/createCampaign", upload.single("image"), async (req, res) => {
  try {
    const { contractAddress, name, typeAnimal, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Gambar harus diupload" });
    }

    const newCampaign = new Campaign({
      contractAddress,
      name,
      typeAnimal,
      description,
      image: req.file.path, // Simpan URL gambar dari Cloudinary
    });

    const savedCampaign = await newCampaign.save();
    res.status(201).json({ message: "User berhasil disimpan!", campaign: savedCampaign });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /campaigns/getCampaign/{id}:
 *   get:
 *     summary: Mendapatkan campaign berdasarkan ID
 *     description: Mengambil data campaign dari database berdasarkan ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID campaign yang ingin diambil
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan campaign
 *       404:
 *         description: Campaign tidak ditemukan
 */
router.get("/getCampaign/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "ID tidak valid" });
    }

    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign tidak ditemukan!" });
    }

    res.json(campaign);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /campaigns/updateCampaign/{id}:
 *   put:
 *     summary: Memperbarui campaign berdasarkan ID
 *     description: Mengupdate data campaign yang ada di database
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID campaign yang ingin diperbarui
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               contractAddress:
 *                 type: string
 *               name:
 *                 type: string
 *               typeAnimal:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Campaign berhasil diperbarui
 *       400:
 *         description: ID tidak valid atau request tidak valid
 *       404:
 *         description: Campaign tidak ditemukan
 */
router.put("/updateCampaign/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "ID tidak valid" });
    }

    const { contractAddress, name, typeAnimal, description } = req.body;
    let updateData = { contractAddress, name, typeAnimal, description };

    if (req.file) {
      updateData.image = req.file.path; // Update gambar jika ada file baru
    }

    const updatedCampaign = await Campaign.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedCampaign) {
      return res.status(404).json({ error: "Campaign tidak ditemukan" });
    }

    res.json({ message: "Campaign berhasil diperbarui!", campaign: updatedCampaign });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /campaigns/deleteCampaign/{id}:
 *   delete:
 *     summary: Menghapus campaign berdasarkan ID
 *     description: Menghapus campaign yang ada di database
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID campaign yang ingin dihapus
 *     responses:
 *       200:
 *         description: Campaign berhasil dihapus
 *       400:
 *         description: ID tidak valid
 *       404:
 *         description: Campaign tidak ditemukan
 */
router.delete("/deleteCampaign/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "ID tidak valid" });
    }

    const deletedCampaign = await Campaign.findByIdAndDelete(id);

    if (!deletedCampaign) {
      return res.status(404).json({ error: "Campaign tidak ditemukan" });
    }

    res.json({ message: "Campaign berhasil dihapus!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /campaigns/getAllCampaign:
 *   get:
 *     summary: Ambil semua data user
 *     description: Mengambil seluruh data user yang tersimpan di database.
 *     responses:
 *       200:
 *         description: Data user berhasil diambil
 *       500:
 *         description: Terjadi kesalahan server
 */
router.get("/getAllCampaign", async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
