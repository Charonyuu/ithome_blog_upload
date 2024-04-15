"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commitReadme = exports.updateReadme = void 0;
const fs_1 = __importDefault(require("fs"));
const core = __importStar(require("@actions/core"));
const child_process_1 = require("child_process");
function updateReadme(newContent) {
    const readmePath = "README.md";
    try {
        // 讀取 README 文件的原始內容
        const previousContent = fs_1.default.readFileSync(readmePath, "utf8");
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
        const updatedContent = previousContent.slice(0, startIndex + startTag.length) +
            "\n" +
            `<h2 align="center">📕 My Ithome Latest Article:</h2>` +
            "\n" +
            "\n" +
            newContent +
            "\n" +
            previousContent.slice(endIndex);
        console.log("updatedContent", updatedContent);
        // 將更新後的內容寫入 README 文件
        fs_1.default.writeFileSync(readmePath, updatedContent, "utf8");
        console.log("README updated successfully.");
    }
    catch (error) {
        core.setFailed(`Error updating README: ${error.message}`);
    }
}
exports.updateReadme = updateReadme;
const exec = (cmd, args = [], options = {}) => new Promise((resolve, reject) => {
    let outputData = "";
    const optionsToCLI = {
        ...options,
    };
    if (!optionsToCLI.stdio) {
        Object.assign(optionsToCLI, { stdio: ["inherit", "inherit", "inherit"] });
    }
    const app = (0, child_process_1.spawn)(cmd, args, optionsToCLI);
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
const commitReadme = async () => {
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
exports.commitReadme = commitReadme;
//# sourceMappingURL=utils.js.map