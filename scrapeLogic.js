const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (url, res) => {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "load", timeout: 0 });

    // Scrape all <input> elements
    const inputElements = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("input")).map((input) => ({
        type: input.type || "unknown",
        name: input.name || "unnamed",
        id: input.id || "no-id",
        className: input.className || "no-class",
      }));
    });

    res.json({ inputs: inputElements });
  } catch (e) {
    console.error(e);
    res.status(500).send(`Something went wrong: ${e.message}`);
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeLogic };