import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';

const app = express();
const PORT = process.env.PORT || 3000;

// List of allowed origins
const allowedOrigins = [
  'https://jackji13.github.io',
  'http://127.0.0.1:5500',
  'http://localhost:3000'
];

// Configure CORS middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

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
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
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
    console.error('Error during scraping:', error.message);
    res.status(500).send('Error scraping the website');
  }
});

app.listen(PORT, () => {
  console.log(`Input Box Scraper API running on port ${PORT}`);
});