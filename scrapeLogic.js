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


    const elements = await page.evaluate(() => {

      const scrapeElements = (selector) => {
        return Array.from(document.querySelectorAll(selector)).map((element) => {
          const computedStyles = window.getComputedStyle(element);
          let styles = {};
          for (let property of computedStyles) {
            styles[property] = computedStyles.getPropertyValue(property);
          }

          return {
            tagName: element.tagName.toLowerCase(),
            textContent: element.textContent || "",
            innerHTML: element.innerHTML || "",
            id: element.id || "no-id",
            className: element.className || "no-class",
            attributes: Array.from(element.attributes).reduce((attrs, attr) => {
              attrs[attr.name] = attr.value;
              return attrs;
            }, {}),
            styles
          };
        });
      };

      return {
        h1: scrapeElements("h1"),
        hr: scrapeElements("hr"),
        button: scrapeElements("button"),
        input: scrapeElements("input")
      };
    });

    res.json(elements);
  } catch (e) {
    console.error(e);
    res.status(500).send(`Something went wrong: ${e.message}`);
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeLogic };