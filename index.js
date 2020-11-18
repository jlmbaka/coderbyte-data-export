const puppeteer = require("puppeteer");
const fs = require("fs");

const config = require("./config.json");
const cookies = require("./cookies.json");

(async () => {
  // Create the browser instance
  const browser = await puppeteer.launch();
  const context = browser.defaultBrowserContext();

  // Create the page instance
  const page = await browser.newPage();
  // Login to Coderbyte
  if (!Object.keys(cookies).length) {
    await page.goto("https://coderbyte.com/sl#login", {
      waitUntil: "networkidle2",
    });
    await page.type('input[type="text"].login-field-input', config.username, {
      delay: 30,
    });
    await page.type(
      'input[type="password"].login-field-input',
      config.password,
      {
        delay: 30,
      }
    );
    await page.click(".login-actions button");
    await page.waitForNavigation({ waitUntil: "networkidle0" });
    await page.waitForTimeout(15000);
    const currentCookies = await page.cookies();
    fs.writeFileSync("./cookies.json", JSON.stringify(currentCookies));
  } else {
    //User Already Logged In
    await page.setCookie(...cookies);
  }
  console.log("Page URL:", page.url());
  await page.screenshot({ path: "screenshot.png" });
  await page.goto(
    "https://coderbyte.com/dashboard/kinshasadigital-6selg:html-assessment-xmmwn8ee5s",
    { waitUntil: "networkidle2" }
  );
  console.log("Page URL:", page.url());
  await page.screenshot({ path: "screenshot2.png" });
  await browser.close();
})();
