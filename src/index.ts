import * as core from "@actions/core";
// import * as core from "./localtest/fakeCoreFunction";
import { commitReadme, updateReadme } from "./utils";
import { load } from "cheerio";

type Article = {
  title?: string;
  url?: string;
  like?: string;
  comment?: string;
  view?: string;
};

async function fetchData(url: string) {
  const result = await fetch(
    "https://ithelp.ithome.com.tw/users/20162289/articles"
  ).then((res) => {
    return res.text();
  });
  return load(result);
}

async function ithomeAction() {
  try {
    console.log("start scraping...");
    const userId = core.getInput("userId"); // Get userId from input

    if (!userId) {
      throw new Error("User ID is required.");
    }

    const limit = parseInt((core.getInput("limit") as string) || "5", 10); // Get limit from input
    const actualLimit = isNaN(limit) ? 5 : Math.max(1, Math.min(limit, 10));

    const url = `https://ithelp.ithome.com.tw/users/${userId}/articles`;
    console.log(
      `Scraping articles for userId: ${userId}, limit: ${actualLimit}`
    );

    const $ = await fetchData(url);
    const articleList: Article[] = [];
    $(".qa-list").each((index, element) => {
      const item: Article = {};
      const detail = $(element).find(".profile-list__condition");

      $(detail)
        .find(".qa-condition")
        .each((index, detailDom) => {
          const value = $(detailDom).find(".qa-condition__count").text().trim();
          switch (index) {
            case 0:
              item.like = value;
              break;
            case 1:
              item.comment = value;
              break;
            case 2:
              item.view = value;
              break;
          }
        });

      const article = $(element).find(".qa-list__title a");
      item.title = article.text().trim();
      item.url = article.attr("href")?.trim();
      articleList.push(item);
    });

    console.log("Scraping completed, closing...");

    const like = core.getInput("like");
    const comment = core.getInput("comment");
    const view = core.getInput("view");
    const icon_emoji = core.getInput("icon_emoji");
    const mapping = {
      like: icon_emoji ? " 👍 " : " - 喜歡: ",
      comment: icon_emoji ? " 💬 " : " - 評論: ",
      view: icon_emoji ? " 👁️ " : " - 瀏覽: ",
    };

    const markdownContent = articleList
      .splice(0, limit)
      .map(
        (article) =>
          `- [${article.title}](${article.url})` +
          `${like ? mapping["like"] + article.like : ""}` +
          `${comment ? mapping["comment"] + article.comment : ""}` +
          `${view ? mapping["view"] + article.view : ""}`
      )
      .join("\n");

    console.log("Markdown content: \n" + markdownContent);

    updateReadme(markdownContent);

    commitReadme();
  } catch (error: any) {
    core.setFailed(`Error updating README: ${error.message}`);
  }
}

ithomeAction();
