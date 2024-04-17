import { updateReadme, commitReadme } from "../src/utils"; // Update with the actual filename
import * as core from "@actions/core";
import * as fs from "fs";
import { spawn } from "child_process";

jest.mock("fs");
jest.mock("child_process", () => ({
  spawn: jest.fn(),
}));
jest.mock("@actions/core", () => ({
  setFailed: jest.fn(),
  getInput: jest.fn().mockImplementation((input) => {
    switch (input) {
      case "gh_token":
        return "fake_token";
      case "committer_username":
        return "fake_user";
      case "committer_email":
        return "fake_email@example.com";
      case "commit_message":
        return "fake_commit_message";
    }
  }),
  info: jest.fn(),
}));

describe("updateReadme", () => {
  it("should update the README.md file successfully", () => {
    const newContent = "Test Article Content";
    const mockReadFileSync = jest.spyOn(fs, "readFileSync").mockReturnValue(`
      <!-- ITHOME-POST-LIST:START -->
      <!-- ITHOME-POST-LIST:END -->
    `);
    const mockWriteFileSync = jest
      .spyOn(fs, "writeFileSync")
      .mockImplementation();

    updateReadme(newContent);

    expect(mockReadFileSync).toHaveBeenCalledWith("README.md", "utf8");
    expect(mockWriteFileSync).toHaveBeenCalled();
    expect(mockWriteFileSync.mock.calls[0][1]).toContain(
      "Test Article Content"
    );
  });

  // it("throws an error if the content area is not found", () => {
  //   const newContent = "Test Article Content";
  //   jest.spyOn(fs, "readFileSync").mockReturnValue(`No tags here`);
  //   try {
  //     updateReadme(newContent);
  //     // If the function does not throw, force the test to fail
  //     throw new Error("updateReadme did not throw any error as expected");
  //   } catch (error: any) {
  //     expect(error.message).toContain(
  //       "Cannot find the specified content area in README."
  //     );
  //   }
  // });
});

describe("commitReadme", () => {
  const mockSpawn = spawn as jest.MockedFunction<typeof spawn>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("executes git commands correctly", async () => {
    const mockSpawnImplementation = () => ({
      stdout: {
        on: jest.fn((event, handler) => {
          if (event === "data") handler("data");
        }),
      },
      on: jest.fn((event, handler) => {
        if (event === "close") handler(0);
      }),
      stderr: {
        on: jest.fn(),
      },
    });

    mockSpawn.mockImplementation(mockSpawnImplementation as any);

    await commitReadme();

    expect(mockSpawn).toHaveBeenCalledWith(
      "git",
      expect.any(Array),
      expect.any(Object)
    );
    expect(mockSpawn).toHaveBeenCalledWith("git", ["push"], expect.anything());
    expect(jest.requireMock("@actions/core").info).toHaveBeenCalledWith(
      "Readme updated successfully in the upstream repository"
    );
  });
});
