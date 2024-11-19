const express = require("express");
const cors = require("cors");
const { scrapeLogic } = require("./scrapeLogic");
const app = express();

const allowedOrigins = [
  'https://jackji13.github.io',
  'http://127.0.0.1:5500',
  'http://localhost:3000',
  'http://localhost:4000', // Ensure your frontend origin is allowed
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
  const { url, elementType } = req.query;
  if (!url || !elementType) {
    return res.status(400).send("URL and elementType are required");
  }
  await scrapeLogic(url, elementType, res);
});

app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
