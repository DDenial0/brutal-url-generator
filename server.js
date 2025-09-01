import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8081;

// Middleware to parse plain text
app.use(express.text());

// CORS middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// Serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Proxy endpoint
app.put("/getserver", async (req, res) => {
  const cc = req.body.trim().toUpperCase();
  if (!cc || cc.length !== 2) {
    return res.status(400).send("Invalid country code");
  }

  try {
    const response = await fetch("https://master.brutal.io", {
      method: "PUT",
      body: cc,
      headers: { "Content-Type": "text/plain" }
    });

    const text = await response.text();
    res.send(text);
  } catch (err) {
    console.error("Error fetching from master.brutal.io:", err);
    res.status(500).send("Error contacting master server");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
