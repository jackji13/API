convert this to markdown format

# HTML Elements Scraper API

**Website URL:** [HTML Elements Scraper Frontend](https://jackji13.github.io/2024LAB/project%20009/index.html)

**Github Repo URL:** [https://github.com/jackji13/API/](https://github.com/jackji13/API/)

**API URL:** [https://element-scaper-api.onrender.com/](https://element-scaper-api.onrender.com/)

## Overview

The HTML Elements Scraper API allows you to scrape specific HTML elements from any publicly accessible website. It retrieves elements along with their attributes, computed CSS styles, and screenshots. The API is built using Node.js, Express, and Puppeteer.

## Features

- **Element Scraping:** Retrieve detailed information about specific HTML elements such as input, button, h1, and hr.
- **Attribute Extraction:** Extract all attributes of the selected elements.
- **CSS Styles:** Get computed CSS styles for each element.
- **Screenshots:** Capture screenshots of each scraped element.
- **CORS Enabled:** Securely access the API from allowed origins.
- **Error Handling:** Robust error handling to manage unexpected issues during scraping.

## How to Use the API

### Endpoint

**GET** /scrape

### Query Parameters

- url (string, required): The URL of the website you want to scrape.
- elementType (string, required): The type of HTML element you want to scrape (e.g., input, button, h1, hr).

### Sample Request

```bash
GET https://element-scaper-api.onrender.com/scrape?url=https://example.com&elementType=button
```

### Sample Response

```JSON
{
  "button": [
    {
      "tagName": "button",
      "textContent": "Click Me",
      "innerHTML": "Click Me",
      "id": "submitBtn",
      "className": "btn primary",
      "attributes": {
        "type": "submit",
        "id": "submitBtn",
        "class": "btn primary"
      },
      "styles": {
        "color": "rgb(255, 255, 255)",
        "background-color": "rgb(0, 123, 255)",
        // ... more styles
      },
      "screenshot": "<base64-encoded image data>"
    }
    // ... more elements
  ]
}
```

## Installation 

### Prerequisites

- Node.js (version 14 or higher)
- NPM or Yarn

## Steps to Install and Run Locally

### 1. Clone the Repository:
    git clone https://github.com/jackji13/API.git

### 2. Navigate to the Project Directory:
    cd html-elements-scraper-api

### 3. Install Dependencies:

    npm install

### 4. Set Up Environment Variables:
Create a .env file in the root directory and add the following variables:

```bash
PUPPETEER_EXECUTABLE_PATH=/path/to/chrome
NODE_ENV=development
PORT=4000
```
- PUPPETEER_EXECUTABLE_PATH: (Optional) Specify a custom path for Puppeteer's Chrome executable if needed.
- NODE_ENV: Set to production or development.
- PORT: The port on which the API will run (default is 4000).

### 5. Start the Server:
    npm start

The API will be running at http://localhost:4000.

## Deployment

The API is deployed and accessible at https://element-scaper-api.onrender.com/. Ensure that the deployment environment has all necessary environment variables set and that Puppeteer has access to a compatible version of Chromium.

## CORS Configuration

The API is configured to allow requests only from specific origins to enhance security. The allowed origins are defined in the allowedOrigins array within index.js.

### Allowed Origins

    https://jackji13.github.io
    http://127.0.0.1:5500
    http://localhost:3000
    http://localhost:4000 (if running frontend locally)

If you're deploying the frontend to a new domain, ensure to add it to the allowedOrigins array:
```javascript
const allowedOrigins = [
  'https://jackji13.github.io',
  'http://127.0.0.1:5500',
  'http://localhost:3000',
  'http://localhost:4000', // Ensure your frontend origin is allowed
  'https://your-new-domain.com'
];
```

## Error Handling

The API includes comprehensive error handling to manage various scenarios:

- Missing Parameters: Returns a 400 Bad Request if required query parameters are missing.
- Scraping Errors: Logs errors related to scraping individual elements and continues processing other elements.
- Server Errors: Returns a 500 Internal Server Error for unexpected issues.

### Example Error Response
```JSON
{
  "error": "Something went wrong: [Error Message]"
}
```

## Limits and Performance

- Element Limit: To prevent excessive resource usage, the API limits the number of elements processed to 10 by default. You can adjust this limit in scrapeLogic.js by modifying the maxElements variable.
```javascript
const maxElements = 10; // Adjust this number as needed
```

- Timeouts: The API sets a 60-second timeout for page navigation to accommodate slower-loading pages. You can adjust this timeout in scrapeLogic.js as needed.
```javascript
await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
```