import puppeteer from "puppeteer";
import * as core from "@actions/core";
import * as github from "@actions/github";
import { commitReadme, updateReadme } from "./utils";

type Article = {
  title?: string;
  url?: string;
  like?: string;
  comment?: string;
  view?: string;
};

async function ithomeAction() {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
      env: {
        DISPLAY: ":10.0",
      },
    });

    console.log("start puppeteer...");
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36"
    );
    await page.setJavaScriptEnabled(true);
    //   const token = core.getInput("token");
    let limit: number = parseInt(core.getInput("limit")); // 從輸入參數中取得 limit
    if (isNaN(limit)) {
      limit = 5; // 預設取得 5 筆資料
    } else if (limit < 1) {
      limit = 1; // 限制最少要取得 1 筆資料
    } else if (limit > 10) {
      limit = 10; // 限制最多只能取得 10 筆資料
    } else {
      limit = 5;
    }
    let userId = core.getInput("userId"); // 從輸入參數中取得 userId
    if (!userId) {
      throw new Error("User ID is required.");
    }
    console.log("go to page...");
    await page.goto(`https://ithelp.ithome.com.tw/users/${userId}/articles`, {
      waitUntil: "networkidle2",
    });

    console.log("getting data...");
    await page.waitForSelector(".qa-list");
    const result = await page.evaluate(() => {
      const list = document.querySelectorAll(".qa-list");
      const articleList: Article[] = [];
      list.forEach((Dom) => {
        const item: Article = {};
        const detail = Dom.querySelector(".profile-list__condition");
        detail
          ?.querySelectorAll(".qa-condition")
          .forEach((detailDom, index) => {
            const value = detailDom.querySelector(".qa-condition__count");
            switch (index) {
              case 0:
                item.like = value?.textContent || "";
                break;
              case 1:
                item.comment = value?.textContent || "";
                break;
              case 2:
                item.view = value?.textContent || "";
                break;
            }
          });

        const article =
          Dom.querySelector(".qa-list__title")?.querySelector("a");
        item.title = article?.textContent?.trim() || "";
        item.url = article?.href || "";
        articleList.push(item);
      });

      return articleList;
    });

    console.log("finish getting data..., closing browser...");
    console.log(result);

    await browser.close();
    console.log("closed browser...");

    const markdownContent = result
      .splice(0, limit)
      .map(
        (article) =>
          `- [${article.title}](${article.url}) - Likes: ${article.like}, Comments: ${article.comment}, Views: ${article.view}`
      )
      .join("\n");

    updateReadme(markdownContent);

    commitReadme();
  } catch (error: any) {
    core.setFailed(`Error updating README: ${error.message}`);
  }
}

ithomeAction();
