import express from "express";
import multer from "multer";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import cors from "cors";
const app = express();
const upload = multer({ dest: "uploads/" });
app.use(
  cors({
    origin: "*",
  })
);
app.post("/api/transcribe", upload.single("audio"), (req, res) => {
  const filePath = path.resolve(req.file.path);

  exec(`python transcribe.py ${filePath}`, (err, stdout, stderr) => {
    fs.unlinkSync(filePath);

    if (err) {
      console.error(stderr);
      res.status(500).send("Transcription failed");
      return
    }

    console.log(stdout.trim());
    res.status(200).send(stdout.trim());
    return
  });
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
