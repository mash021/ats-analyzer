const { execSync } = require("child_process");
const fs = require("fs");

function createCommit() {
  const date = new Date().toISOString();
  const commitMessage = `Auto commit: ${date}`;

  try {
    // اضافه کردن تغییرات
    execSync("git add .");

    // ایجاد commit
    execSync(`git commit -m "${commitMessage}"`);

    // push کردن تغییرات
    execSync("git push origin main");

    console.log(`Commit created successfully at ${date}`);

    // ذخیره زمان آخرین commit
    fs.writeFileSync("last-commit.txt", date);
  } catch (error) {
    console.error("Error creating commit:", error);
  }
}

// اجرای تابع
createCommit();
