const express = require("express");
const cors = require("cors");
const { scrapeLogic } = require("./scrapeLogic");
const app = express();

const allowedOrigins = [
  'https://jackji13.github.io',
  'http://127.0.0.1:5500',
  'http://localhost:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

const PORT = process.env.PORT || 4000;

app.get("/scrape", async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).send("URL is required");
  }
  await scrapeLogic(url, res);
});

app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});