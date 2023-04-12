const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Parse JSON and urlencoded request bodies
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Set up Multer middleware for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let userId = req.body.userId || "unknown";
    const folderPath = path.join(__dirname, "../customer/uploads", userId);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Serve images from the uploads directory
router.use(
  "/uploads",
  express.static(path.join(__dirname, "../customer/uploads"))
);

// Handle POST requests to /customer/uploads
router.post("/customer/uploads", upload.single("image"), (req, res) => {
  console.log("ROUTE Upload POST taken !");
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/${
      req.body.userId
    }/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Handle GET requests to /uploads/:userId
router.get("/uploads/:userId", (req, res) => {
  console.log("ROUTE Upload GET taken !");
  const userId = req.params.userId;
  console.log("here is the userid caught:", userId);
  const directoryPath = path.join(__dirname, `../customer/uploads/${userId}`);
  let files = [];
  try {
    files = fs.readdirSync(directoryPath);
  } catch (err) {
    console.error(`Error reading directory: ${err}`);
    res.status(500).json({ error: "Error reading directory" });
    return;
  }
  // const filePaths = files.map((file) => path.join(directoryPath, file));
  const filePaths = files.map((file) => path.basename(file));
  // console.log("filePaths:", filePaths);

  res.json(filePaths);
});

// Handle DELETE requests to /uploads/:userId/:filename
router.delete("/uploads/:userId/:filename", (req, res) => {
    console.log("ROUTE Upload DELETE taken !");
  const userId = req.params.userId;
  console.log("the user id received is:", userId)
  const filename = req.params.filename;
  console.log("the filename received is:", filename)
  const filePath = path.join(
    __dirname,
    `../customer/uploads/${userId}/${filename}`
  );
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.sendStatus(204); // No Content
    } else {
      res.status(404).json({ error: "File not found" });
    }
  } catch (err) {
    console.error(`Error deleting file: ${err}`);
    res.status(500).json({ error: "Error deleting file" });
  }
});

module.exports = router;
