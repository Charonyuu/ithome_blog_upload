// fake_core.ts

// 這是假的核心功能模組，用來模擬 GitHub Actions 環境中的核心功能。
type Inputs = {
  userId: string;
  limit: string;
  committer_username: string;
  committer_email: string;
  commit_message: string;
  like: boolean;
  comment: boolean;
  view: boolean;
  icon_emoji: boolean;
};

function getInput(inputName: string) {
  const inputs: Inputs = {
    userId: "20162289", // 這裡設定你的假資料
    limit: "5",
    committer_username: "fake_user",
    committer_email: "fake_email@fake_email.com",
    commit_message: "fake_commit_message",
    like: false,
    comment: false,
    view: true,
    icon_emoji: false,
  };
  return inputs[inputName as keyof Inputs] || "";
}

function setFailed(message: string) {
  console.error(message);
}

function info(message: string) {
  console.log(message);
}

export { getInput, setFailed, info };
