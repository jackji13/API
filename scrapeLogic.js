const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (url, elementType, res) => {
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
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    // Only scrape the selected element type
    const elementHandles = await page.$$(elementType);

    // Limit the number of elements to prevent excessive processing
    const maxElements = 10; // Adjust this number as needed
    const limitedElementHandles = elementHandles.slice(0, maxElements);

    // Process elements in parallel to improve performance
    const elementsData = await Promise.all(
      limitedElementHandles.map(async (element) => {
        try {
          // Scroll the element into view
          await element.evaluate((node) => {
            node.scrollIntoView({ block: "center", inline: "center" });
          });

          // Check if the element is visible
          const isVisible = await element.evaluate((el) => {
            const style = window.getComputedStyle(el);
            return (
              style &&
              style.display !== "none" &&
              style.visibility !== "hidden" &&
              parseFloat(style.opacity) > 0 &&
              el.offsetHeight > 0 &&
              el.offsetWidth > 0
            );
          });

          if (!isVisible) {
            // Skip elements that are not visible
            return null;
          }

          // Extract data from the element
          const elementData = await element.evaluate((node) => {
            const computedStyles = window.getComputedStyle(node);
            let styles = {};
            for (let property of computedStyles) {
              styles[property] = computedStyles.getPropertyValue(property);
            }
            return {
              tagName: node.tagName.toLowerCase(),
              textContent: node.textContent || "",
              innerHTML: node.innerHTML || "",
              id: node.id || "no-id",
              className: node.className || "no-class",
              attributes: Array.from(node.attributes).reduce((attrs, attr) => {
                attrs[attr.name] = attr.value;
                return attrs;
              }, {}),
              styles,
            };
          });

          // Take screenshot of the element
          const screenshotBuffer = await element.screenshot({ encoding: "base64" });
          elementData.screenshot = screenshotBuffer; // base64-encoded screenshot

          return elementData;
        } catch (error) {
          console.error(`Error processing element:`, error);
          // Continue processing other elements
          return null;
        }
      })
    );

    // Filter out any null results
    const elements = elementsData.filter((el) => el !== null);

    res.json({ [elementType]: elements });
  } catch (e) {
    console.error(e);
    res.status(500).send(`Something went wrong: ${e.message}`);
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeLogic };
