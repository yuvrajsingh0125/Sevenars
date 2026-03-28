// backend/server.js
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { encryptAES256, decryptAES256, generateSecretKey } from "./encryption/aes.js";
import { randomBytes } from 'crypto';
import { generateSHA256 } from "./hashing/sha.js";
import mongoose from 'mongoose';
import { User } from './model/user.js';
import { Data } from './model/data.js';
const algorithm = 'aes-256-cbc';
const iv = randomBytes(16);



const app = express();
const PORT = 3000;

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose
    .connect("mongodb://localhost:27017/blockchain")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.warn("⚠️ MongoDB not available, skipping:", err.message));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.post('/hash', upload.single('file'), async (req, res) => {
  const file = req.file;
  const text = req.body.text;

  const secretKey = generateSecretKey();

  // 🔐 Split secret key into 3 parts
  const keyPart1 = secretKey.slice(0, 10);
  const keyPart2 = secretKey.slice(10, 22);
  const keyPart3 = secretKey.slice(22, 32);

  try {
    const fileStorageURL = "https://your-cloud-service.com/encrypted-file";

    // Try blockchain upload, fall back gracefully if node not running
    async function tryBlockchain(hash, url) {
      try {
        const { uploadToBlockchain } = await import('./scripts/interact.js');
        return await uploadToBlockchain(hash, url);
      } catch {
        return { fileId: null, fileHash: hash, fileURL: url, hasAccess: false, message: '⚠️ Blockchain node offline — hash stored locally only.' };
      }
    }

    // ✅ Encrypt FILE
    if (file) {
      const fileContent = file.buffer.toString('utf-8');
      const encrypted = encryptAES256(fileContent, secretKey);
      const hash = generateSHA256(encrypted);
      const blockchainResult = await tryBlockchain(hash, fileStorageURL);

      return res.json({
        type: 'file',
        encrypted,
        hash,
        secretKeyFragments: [keyPart1, keyPart2, keyPart3],
        ...blockchainResult,
        message: '✅ File encrypted.'
      });
    }

    // ✅ Encrypt TEXT
    if (text) {
      const encrypted = encryptAES256(text, secretKey);
      const hash = generateSHA256(encrypted);
      const blockchainResult = await tryBlockchain(hash, fileStorageURL);

      if (mongoose.connection.readyState === 1) {
        const newRecord = new Data({ encrypted, hash, secretKeyFragments: keyPart1, fileType: "text", blockchainData: blockchainResult });
        await newRecord.save();
      }

      return res.json({
        type: 'text',
        encrypted,
        hash,
        secretKeyFragments: [keyPart1, keyPart2, keyPart3],
        ...blockchainResult,
        message: '✅ Text encrypted.'
      });
    }

    return res.status(400).json({ message: "❌ Provide either a file or text to encrypt." });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "❌ Encryption failed.", error: err.message });
  }
});

app.post('/decrypt', (req, res) => {
  const { encrypted, secretKey } = req.body;

  if (!encrypted || !secretKey) {
    return res.status(400).json({ message: "❌ Missing encrypted text or secret key" });
  }

  try {
    console.log("🔐 Attempting decryption... Encrypted data length:", encrypted.length);
    const decrypted = decryptAES256(encrypted, secretKey);
    return res.json({ decrypted });
  } catch (err) {
    console.error("❌ Decryption error:", err.message);
    return res.status(500).json({ message: "❌ Decryption failed", error: err.message });
  }
});


app.post("/signup", async (req, res) => {
  if (mongoose.connection.readyState !== 1)
    return res.status(503).json({ message: "⚠️ Database not available" });
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "❌ All fields are required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "❌ Email already exists" });
  }

  const user = new User({ fullName, email, password });
  await user.save();
  res.status(201).json({ message: "✅ Signup successful!" });
});

app.post("/login", async (req, res) => {
  if (mongoose.connection.readyState !== 1)
    return res.status(503).json({ message: "⚠️ Database not available" });
  const { email, password } = req.body;

  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    res.json({ message: "✅ Login successful", token });
  } catch (err) {
    res.status(401).json({ message: err.message || "❌ Login failed" });
  }
});

// Optional API route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});