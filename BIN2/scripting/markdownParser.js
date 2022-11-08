/**
{
    type: H1,
    text: "Node",
    children: [
        {
            type: H2,
            text: Installation,
            children: [
                {
                    type: P,
                    text: Windows/Mac : Téléchargez l'instaleur sur [Nodejs.org](https://nodejs.org)
                },
                {
                    type: P,
                    text: Linux : lancez les commandes suivantes:
                },
                {
                    type: CODE,
                    lang: sh
                    text: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                          sudo apt-get install -y nodejs
                }
            ]
        },
        {
            type: H2,
            text: Fonctionnalités,
            children: [
                {
                    type: LI,
                    text: [File system](https://nodejs.org/dist/latest-v18.x/docs/api/fs.html)
                },
                {
                    type: LI,
                    text: [Buffer](https://nodejs.org/dist/latest-v18.x/docs/api/buffer.html)
                }
            ]
        }
    ]
}
*/
const fs = require("fs/promises");
const { constants } = require("fs");

const filePath = "../Readme.md";
const outputPath = "./output.html";

const map = {
  "#": "h",
  "-": "li",
  "```": "code",
};

(async () => {
  await fs.access(filePath);
  // Read all file and process
  const data = await fs.readFile(filePath);
  // Open a file descriptor in writable mode and create if not exists
  const outputFile = await fs.open(outputPath, "w+");
  const lines = data.toString().split("\n");
  const result = [];
  let prevNode = null;
  let currentNode = null;
  let multiLineNode = null;
  let temp = "";
  for (let line of lines) {
    // If it is a title
    if (line.startsWith("#")) {
      const level = line.search(/[^#]/);
      const type = map["#"] + level;
      const text = line.substring(level).trim();
      const node = {
        type,
        text,
        level,
        children: [],
      };
      // Use file descriptor in order to write content
      await outputFile.write(Buffer.from(`<${type}>${text}</${type}>`));
      // If no current Node => first Node
      if (!currentNode) {
        result.push(node);
      } else {
        // If current Node is a title
        if (currentNode.type.startsWith("H")) {
          // Check if same level => add to previous Node Title => h1>h2+h2
          if (currentNode.level === level) {
            prevNode.children.push(node);
          } else {
            // Else create new subNode
            currentNode.children.push(node);
            prevNode = currentNode;
          }
        }
      }
      // Assign current Node to last create Node
      currentNode = node;
    }
    // If it is a code block
    else if (line.startsWith("```")) {
      if (!multiLineNode) {
        // If no current code block, create it
        const node = {
          type: map["```"],
          lang: line.substring(3),
        };
        multiLineNode = node;
        // Use file descriptor in order to write code tag (1/2)
        await outputFile.write(Buffer.from(`<${map["```"]}>`));
      } else {
        // End code block and reinit temp variables
        multiLineNode.text = temp;
        currentNode.children.push(multiLineNode);
        // Use file descriptor in order to write code content + end tag (2/2)
        await outputFile.write(
          Buffer.from(`${temp.replace("\n", "<br>")}</${map["```"]}>`)
        );
        multiLineNode = null;
        temp = "";
      }
    }
    // If it is a list
    else if (line.startsWith("-")) {
      const node = {
        type: map["-"],
        text: line.substring(1).trim(),
      };
      // Use file descriptor in order to write li tag (1/2)
      await outputFile.write(
        Buffer.from(`<${node.type}>${node.text}</${node.type}>`)
      );
      currentNode.children.push(node);
    } else {
      // It is a text line
      if (multiLineNode) {
        temp += line + "\n";
      } else if (line !== "") {
        const node = {
          type: "P",
          text: line.trim(),
        };
        // Use file descriptor in order to write p tag (1/2)
        await outputFile.write(
          Buffer.from(`<${node.type}>${node.text}</${node.type}>`)
        );
        currentNode.children.push(node);
      }
    }
  }
  await outputFile.close();
  console.log(JSON.stringify(result));
})();
