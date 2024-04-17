// fake_core.ts
function getInput(inputName: string) {
  const inputs: { [key: string]: string } = {
    userId: "20162289", // 這裡設定你的假資料
    limit: "5",
    committer_username: "fake_user",
    committer_email: "fake_email@fake_email.com",
    commit_message: "fake_commit_message",
  };
  return inputs[inputName] || "";
}

function setFailed(message: string) {
  console.error(message);
}

function info(message: string) {
  console.log(message);
}

export { getInput, setFailed, info };
