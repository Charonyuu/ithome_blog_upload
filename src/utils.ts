import fs from "fs";
import * as core from "@actions/core";
// import * as core from "../localtest/fakeCoreFunction";
import { spawn } from "child_process";

export function updateReadme(newContent: string) {
  const readmePath = "README.md";

  try {
    // 讀取 README 文件的原始內容
    const previousContent = fs.readFileSync(readmePath, "utf8");
    console.log("getting previousContent", previousContent);
    // 定義 README 中要替換的區域標記
    const startTag = "<!-- ITHOME-POST-LIST:START -->";
    const endTag = "<!-- ITHOME-POST-LIST:END -->";

    // 找到要替換的區域的起始和結束位置
    const startIndex = previousContent.indexOf(startTag);
    const endIndex = previousContent.indexOf(endTag);
    console.log("startIndex and endIndex", startIndex, endIndex);

    if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
      throw new Error("Cannot find the specified content area in README.");
    }

    // 構建更新後的 README 內容
    const updatedContent =
      previousContent.slice(0, startIndex + startTag.length) +
      "\n" +
      `<h2 align="center">📕 My Ithome Latest Article:</h2>` +
      "\n" +
      "\n" +
      newContent +
      "\n" +
      previousContent.slice(endIndex);

    console.log("updatedContent", updatedContent);
    // 將更新後的內容寫入 README 文件
    fs.writeFileSync(readmePath, updatedContent, "utf8");

    console.log("README updated successfully.");
  } catch (error: any) {
    core.setFailed(`Error updating README: ${error.message}`);
  }
}

const exec = (
  cmd: string,
  args: string[] = [],
  options: { stdio?: any[] } = {}
) =>
  new Promise((resolve, reject) => {
    let outputData = "";
    const optionsToCLI = {
      ...options,
    };
    if (!optionsToCLI.stdio) {
      Object.assign(optionsToCLI, { stdio: ["inherit", "inherit", "inherit"] });
    }
    const app = spawn(cmd, args, optionsToCLI);
    if (app.stdout) {
      // Only needed for pipes
      app.stdout.on("data", function (data) {
        outputData += data.toString();
      });
    }

    app.on("close", (code) => {
      if (code !== 0) {
        return reject({ code, outputData });
      }
      return resolve({ code, outputData });
    });
    app.on("error", () => reject({ code: 1, outputData }));
  });

export const commitReadme = async () => {
  const GITHUB_TOKEN = core.getInput("gh_token");
  // Getting config
  const committerUsername = core.getInput("committer_username");
  const committerEmail = core.getInput("committer_email");
  const commitMessage = core.getInput("commit_message");
  // Doing commit and push
  await exec("git", ["config", "--global", "user.email", committerEmail]);
  if (GITHUB_TOKEN) {
    // git remote set-url origin
    await exec("git", [
      "remote",
      "set-url",
      "origin",
      `https://${GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git`,
    ]);
  }
  await exec("git", ["config", "user.name", committerUsername]);
  await exec("git", ["add", "README.md"]);
  await exec("git", ["commit", "-m", commitMessage]);
  await exec("git", ["push"]);
  core.info("Readme updated successfully in the upstream repository");
};
