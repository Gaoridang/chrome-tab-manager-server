const cors = require("cors");
const express = require("express");
const puppeteer = require("puppeteer");
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post("/api/crawl", async (req, res) => {
  const { url } = req.body;
  const browser = await puppeteer.launch({
    headless: "new",
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  const selector =
    "#root > div.sc-bBHHxi.sc-cNKqjZ.ljidQ > div.sc-brSvTw.hRJeFN > div > div";
  const textContent = await page.$$eval(
    selector + " p, " + selector + " pre",
    (elements) => {
      return elements.map((element) => element.innerText).join("\n");
    }
  );

  await browser.close();

  res.send({ textContent });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
