const fs = require("fs");
const path = require("path");

function removeComments(code) {
  let output = "";
  let i = 0;
  const len = code.length;

  let inString = false;
  let stringChar = "";
  let inComment = false;
  let commentType = "";

  while (i < len) {
    const char = code[i];
    const nextChar = code[i + 1];

    if (inComment) {
      if (commentType === "single") {
        if (char === "\n") {
          inComment = false;
          output += char;
        }
      } else if (commentType === "multi") {
        if (char === "*" && nextChar === "/") {
          inComment = false;
          i++;
        }
      }
      i++;
      continue;
    }

    if (inString) {
      output += char;
      if (char === "\\") {
        i++;
        if (i < len) output += code[i];
      } else if (char === stringChar) {
        inString = false;
      }
      i++;
      continue;
    }

    if (char === "/" && nextChar === "/") {
      inComment = true;
      commentType = "single";
      i += 2;
      continue;
    }
    if (char === "/" && nextChar === "*") {
      inComment = true;
      commentType = "multi";
      i += 2;
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      inString = true;
      stringChar = char;
      output += char;
      i++;
      continue;
    }

    output += char;
    i++;
  }

  return output;
}

const targetDir = path.join(__dirname, "../src");

function processDirectory(directory) {
  if (!fs.existsSync(directory)) {
    console.log(`Directory not found: ${directory}`);
    return;
  }

  const items = fs.readdirSync(directory);

  items.forEach((item) => {
    const fullPath = path.join(directory, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (stat.isFile()) {
      const ext = path.extname(item);
      if ([".js", ".jsx", ".ts", ".tsx"].includes(ext)) {
        console.log(`Cleaning: ${fullPath}`);
        const content = fs.readFileSync(fullPath, "utf8");
        const cleaned = removeComments(content);
        fs.writeFileSync(fullPath, cleaned);
      }
    }
  });
}

if (require.main === module) {
  console.log("Starting comment cleanup...");
  processDirectory(targetDir);
  console.log("Cleanup complete!");
}

module.exports = { removeComments };
