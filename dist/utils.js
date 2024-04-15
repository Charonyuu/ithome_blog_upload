"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReadme = void 0;
const fs = require("fs");
const core = require("@actions/core");
function updateReadme(newContent) {
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
        fs.writeFileSync(readmePath, updatedContent, "utf8");
        console.log("README updated successfully.");
    }
    catch (error) {
        core.setFailed(`Error updating README: ${error.message}`);
    }
}
exports.updateReadme = updateReadme;
//# sourceMappingURL=utils.js.map