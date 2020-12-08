const puppeteer = require("puppeteer");
const fs = require("fs");
const ObjectsToCsv = require("objects-to-csv");

const config = require("./config.json");
const cookies = require("./cookies.json");

const actionsIndex = 7;

function getChallengeUrl() {
  const challengeUrls = process.argv.slice(2);
  console.log(challengeUrls);
  return challengeUrls[0];
}

const challengeUrl = getChallengeUrl();

async function extractTestResultsFromDashboard() {
  const dashboard = document.querySelectorAll(
    "li.mainTableHeaderRow, li.candidateRow.candidateRow"
  );

  const actionsIndex = 7;
  const results = [...dashboard].map((line, rowIndex) =>
    [...line.children].slice(0, actionsIndex + 1).map((item, columnIndex) => {
      if (columnIndex === actionsIndex) {
        const url =
          rowIndex === 0
            ? item.innerText.trim()
            : item.querySelector("a").href.trim();
        return url;
      }
      return item.innerText.trim();
    })
  );
  return results;
}

const detailsColumns = {
  code: "",
  mc: "",
  "Largest Four Score": "",
  "Largest Four Lang": "",
  "Sum Multiplier Score": "",
  "Sum Multiplier Lang": "",
  "Moving Median Score": "",
  "Moving Median Lang": "",
  "HTML Elements Score": "",
  "HTML Elements Lang": "",
  "React Tic Tac Toe Score": "",
  "React Tic Tac Toe Lang": "",
};

async function extractResultFromReportPage() {
  const detailsColumns = {
    code: "",
    mc: "",
    "Largest Four Score": "",
    "Largest Four Lang": "",
    "Sum Multiplier Score": "",
    "Sum Multiplier Lang": "",
    "Moving Median Score": "",
    "Moving Median Lang": "",
    "HTML Elements Score": "",
    "HTML Elements Lang": "",
    "React Tic Tac Toe Score": "",
    "React Tic Tac Toe Lang": "",
  };

  const details = {
    ...detailsColumns,
  };

  // console.log(document);
  const code = document.querySelector("p.code span:nth-child(2)").textContent;
  details["code"] = code;
  const mc = document.querySelector("p.mc span:nth-child(2)").textContent;
  details["mc"] = mc;

  // challenge result and time
  const challenges = [
    ...document.querySelectorAll(".chalTitle, .chalScore, .chalLang"),
  ];
  for (let i = 0; i < challenges.length; i += 3) {
    const chalTitle = challenges[i].innerText.trim();
    const chalScore = challenges[i + 1].innerText.trim();
    const chalLang = challenges[i + 2].innerText.trim();
    details[`${chalTitle} Score`] = chalScore;
    details[`${chalTitle} Lang`] = chalLang;
  }
  // chal recording: time
  // ("ul.chalsListing.vidRecordings");
  // multiple choice
  // ("ul .chalsListing .mcAnswers");

  // plagiarism issue: 3rd aside on the page

  // return [code, mc];
  return Object.values(details);
}

(async () => {
  // Create the browser instance
  const browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
  });

  // Create the page instance
  const page = await browser.newPage();

  // Login to Coderbyte
  console.log("Logging in...");
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
    console.log("Log in complete");
  } else {
    //User Already Logged In
    console.log("Already logged in");
    await page.setCookie(...cookies);
  }

  // Navigate to challenge page
  await page.goto(challengeUrl, { waitUntil: "networkidle2" });
  console.log("Page URL:", page.url());
  await page.screenshot({ path: "screenshot2.png" });

  // create extract results from page
  console.log("extracting dashboard results...");
  const dashboardResults = await page.evaluate(extractTestResultsFromDashboard);
  console.log("dashboard results extracted");

  // Crawl report pages
  let index = 0;
  const resultWithDetails = [];
  const length = dashboardResults.length;
  for (const result of dashboardResults) {
    // handle header
    if (index === 0) {
      resultWithDetails.push([...result, ...Object.keys(detailsColumns)]);
    } else {
      // fetch report
      const reportUrl = result[actionsIndex];
      console.log(`Navigating to ${reportUrl}...`);
      await page.goto(reportUrl, { waitUntil: "networkidle2" });
      try {
        const detailedResults = await page.evaluate(
          extractResultFromReportPage
        );
        resultWithDetails.push([...result, ...detailedResults]);
      } catch (err) {
        console.log(`could not evaluate ${reportUrl}`, err);
      }
    }
    console.log(index, "/", length);
    index++;
  }
  console.log("---");
  console.log(resultWithDetails);

  // create and write CSV to disk
  const csv = new ObjectsToCsv(resultWithDetails);
  await csv.toDisk(`./out/results_${new Date().getTime()}.csv`);

  // Kill everything
  await browser.close();
})();
