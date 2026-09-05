const musicModel = require("../model/music.model");
const jwt = require("jsonwebtoken");
const album = require("../services/storage.service");
const albumModel = require("../model/album.model");


async function createMusic(req, res) {
  try {
    const token =
      req.cookies.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role !== "artist") {
      return res.status(403).json({
        message: "You don't have permission to upload music",
      });
    }

    const file = req.file || req.files?.[0];
    const { title } = req.body;

    if (!title || !file) {
      return res.status(400).json({
        message: "Title and music file are required",
      });
    }

    const music = await musicModel.create({
      title,
      uri: file.originalname, // later replace with ImageKit URL..
  
      artist: decoded.id,
    });

    return res.status(201).json({
      message: "Music uploaded successfully",
      music,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: err.message,
    });
  }
}

async function createAlbum(req, res) {
  try {
    const token =
      req.cookies.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role !== "artist") {
      return res.status(403).json({
        message: "You don't have permission to create albums",
      });
    }

    const { title, musicIds } = req.body;

    if (!title || !musicIds) {
      return res.status(400).json({
        message: "Title and musicIds are required",
      });
    }

    const album = await albumModel.create({
      title,
      artist: decoded.id,
      musics: musicIds,
    });

    return res.status(201).json({
      message: "Album created successfully",
      album,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: err.message,
    });
  }
}

async function getAllMusics(req,res) {

    const musics = await musicModel
    .find()
    .limit(5)
    .populate("artist" , "username email")

    res.status(200).json({
        message: "Musics fetched successfully",
        musics: musics,
    })
}

async function getAllAlbums(req,res) {

const albums = await albumModel.find().select("title artist").populate("artist", "username email")

res.status(200).json({
message: "Albums fetched successfully",
albums: albums,
})

}

async function getAlbumById(req , res) {

const albumId = req.params.albumId;

const album = await albumModel.findById(albumId).populate("artist" , "username email").populate("musics");

if (!album) {
    return res.status(404).json({ message: "Album not found" });
}

return res.status(200).json({
message: "Album fetched successfully",
album,
})

}

module.exports = { createMusic , createAlbum, getAllMusics, getAllAlbums, getAlbumById};




