const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

// List of allowed origins
const allowedOrigins = [
  'https://jackji13.github.io/2024LAB',
  'http://127.0.0.1:5500',
  'http://localhost:3000'
];

// Configure CORS middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// Default route to inform users about the API
app.get('/', (req, res) => {
  res.json({
    message: "Welcome to the Input Box Scraper API!",
    usage: "Use the /scrape endpoint with a 'url' query parameter to scrape input boxes from a website.",
    example: "/scrape?url=https://www.example.com"
  });
});

// Route to scrape input elements
app.get('/scrape', async (req, res) => {
    const url = req.query.url;
    if (!url) {
      return res.status(400).send('Please provide a URL');
    }
  
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2' });
  
      // Extract input boxes and their full computed styles
      const inputElements = await page.evaluate(() => {
        const inputs = Array.from(document.querySelectorAll('input'));
        return inputs.map(input => {
          const computedStyle = window.getComputedStyle(input);
          const styles = Array.from(computedStyle).map(
            property => `${property}: ${computedStyle.getPropertyValue(property)};`
          ).join(' ');
  
          return {
            html: input.outerHTML,
            styles: styles
          };
        });
      });
  
      await browser.close();
      res.json(inputElements);
    } catch (error) {
      res.status(500).send('Error scraping the website');
    }
  });  

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
