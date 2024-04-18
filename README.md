## 如何使用

1. 先幫這個專案按個 star⭐，讓更多的人知道這個專案，也方便之後有需要的人可以參考。😉
2. 到想要使用的專案 repository
3. 將`<!-- ITHOME-POST-LIST:START --><!-- ITHOME-POST-LIST:END -->` 放入你想要使用的 readme 中，github action 會將 blog post 自動更新到這個位置中間。

```markdown
# Blog posts

   <!-- ITHOME-POST-LIST:START -->
   <!-- ITHOME-POST-LIST:END -->
```

4. 新增`.github` 資料夾，再新增`workflows`資料夾，如果之前沒有建立過，就要先建立。
5. 在 `workflows` 資料夾中新增檔案`ithome-post-update.yml`:

```yaml
    name: Latest ithome blog update workflow
    on:
        schedule: # 自動更新時間
        - cron: "0 * * * *" # 每小時更新(可以自動更新)
        workflow_dispatch: # 手動更新
    permissions:
        contents: write # 讀寫權限

    jobs:
        update-readme-with-blog:
        name: Update this repo's README with latest blog posts
        runs-on: ubuntu-latest
        steps:
            - name: Checkout
                uses: actions/checkout@v4
            - name: Ithome Article Post Action
                uses: Charonyuu/ithome_blog_upload@v1.0.1
                with:
                    ghToken: ${{ secrets.GITHUB_TOKEN }}
                    userId: "20162289"
```

6. 替換掉 userId 變成自己 ithome 的 id.範例如下
7. 到專案 repository settings, 點選左側的 Actions > General. 更新 "Workflow permissions"變成 "Read and write permissions"然後儲存

8. 結果範例:

<!-- ITHOME-POST-LIST:START -->
<h2 align="center">📕 My Ithome Latest Article:</h2>

- [[Day 30] 懶得每次都 npm test，用 Husky 幫忙吧 ＆＆ 結語](https://ithelp.ithome.com.tw/articles/10336289) - Likes: 0, Comments: 0, Views: 306
- [[Day 29] 實戰 useIntersection 測試](https://ithelp.ithome.com.tw/articles/10336288) - Likes: 0, Comments: 0, Views: 145
- [[Day 28] useIntersection 實戰 做出 infinite scroll 吧](https://ithelp.ithome.com.tw/articles/10335993) - Likes: 0, Comments: 0, Views: 139
- [[Day 27] useLogin test](https://ithelp.ithome.com.tw/articles/10335623) - Likes: 0, Comments: 0, Views: 126
- [[Day 26] 實戰時間 useLogin](https://ithelp.ithome.com.tw/articles/10335028) - Likes: 0, Comments: 0, Views: 123
<!-- ITHOME-POST-LIST:END -->

## 可以放入的選項

| Workflow 選項        | 預設值                                      | 說明                               | 必填 |
| -------------------- | ------------------------------------------- | ---------------------------------- | ---- |
| `userId`             | `""`                                        | 你的 it 幫幫忙 id id               | yes  |
| `gh_token`           | `${{ secrets.GITHUB_TOKEN }}`               | 你的 GitHub token，用來更新 readme | yes  |
| `limit`              | `5`                                         | 設定要抓幾個 post                  | yes  |
| `like`               | `true`                                      | 是否要顯示喜歡數                   | no   |
| `comment`            | `true`                                      | 是否要顯示留言數                   | no   |
| `view`               | `true`                                      | 是否要顯示閱讀數                   | no   |
| `commit_message`     | `Updated with the latest ithome blog posts` | 自動更新時 commit message          | no   |
| `committer_username` | `ithome-blog-upload-readme-bot`             | 自動更新時 committer username      | no   |
| `committer_email`    | `ithome-blog-upload-readme-bot@example.com` | 自動更新時 committer email         | no   |

想法參考開源 action: https://github.com/gautamkrishnar/blog-post-workflow/tree/d4c2f046016f5d3ff334116fcd3a4adc5807ee55
