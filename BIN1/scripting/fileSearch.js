const fs = require("node:fs/promises");
const fsSync = require("node:fs");
const path = require("node:path");
const ProgressBar = require("../../Bonus/ProgressBar");
const constants = fsSync.constants;
let bar;
const rootPath = "./";
const filters = {
  name: undefined,
  type: undefined,
  date: undefined,
};

/**
 * @param {Date} date1
 * @param {Date} date2
 * @returns Boolean
 */
function checkDateEquals(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * @param {String} type
 * @param {String} path
 * @returns Boolean
 */
async function checkType(type, filePath) {
  try {
    const mimeType = await getMimeType(filePath);
    return mimeType.startsWith(type);
  } catch (e) {
    console.error(e);
    return false;
  }
}

function getMimeType(file, sync = false) {
  const { exec, execSync } = require("node:child_process");
  if (sync) return execSync(`file --mime-type -b ${file}`).toString();

  return new Promise((res, rej) => {
    exec(`file --mime-type -b ${file}`, (err, stdout, sterr) => {
      if (err) rej(sterr);
      else res(stdout);
    });
  });
}

async function searchFiles(filePath) {
  try {
    filePath = path.resolve(filePath);
    await fs.access(filePath, constants.R_OK);
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      const subresult = (
        await Promise.all(
          (
            await fs.readdir(filePath)
          ).map((f) => searchFiles(path.resolve(filePath, f)))
        )
      ).filter((f) => f !== undefined);
      return subresult;
    } else {
      const totalFilters = Object.values(filters).reduce(
        (acc, item) => (item !== undefined ? ++acc : acc),
        0
      );
      let count = 0;
      count += !!filters.name && new RegExp(filters.name).test(filePath);
      count += !!filters.type && (await checkType(filters.type, filePath));
      count +=
        !!filters.date &&
        checkDateEquals(new Date(stat.birthtime), new Date(filters.date));

      if (totalFilters === count) {
        return { name: filePath, stat: stat };
      }
    }
  } catch (e) {
    console.error(e);
  }
}

async function searchDuplicates(files) {
  return (
    await Promise.all(
      files.map(async (origin, oIndex) => {
        let results = files
          .slice(oIndex + 1)
          .map((to) => (checkDuplicate(origin, to) ? to : undefined));
        results = results.filter((r) => r !== undefined);
        bar.setValue(oIndex);
        return results.length
          ? {
              origin,
              duplicates: results,
            }
          : null;
      })
    )
  ).filter((d) => d !== null);
}

function checkDuplicate(file1, file2) {
  // If size differs, return false
  if (file1.stat.size !== file2.stat.size) return false;
  // If mimeType differs, return false
  if (getMimeType(file1.name, true) !== getMimeType(file2.name, true))
    return false;

  const fo = fsSync.openSync(file1.name, "r");
  const ft = fsSync.openSync(file2.name, "r");
  let oBlock = Buffer.alloc(16384);
  let bytesRead;
  while ((bytesRead = fsSync.readSync(fo, oBlock)) !== 0) {
    const tBlock = Buffer.alloc(16384);
    fsSync.readSync(ft, tBlock);
    // If origin Buffer differs from targetBuffer, break;
    if (oBlock.compare(tBlock) !== 0) break;
  }
  fsSync.closeSync(fo);
  fsSync.closeSync(ft);
  // If reach end of origin file, it's a match else return false
  return bytesRead === 0;
}

(async () => {
  const files = (await searchFiles(rootPath)).flat(Infinity);
  console.log("nbFiles", files.length);
  bar = new ProgressBar(30, files.length);
  bar.start();
  const duplicates = await searchDuplicates(files);
  console.log(
    //files,
    duplicates.map((o) => ({
      origin: o.origin.name,
      dups: o.duplicates.map((f) => f.name),
    }))
  );
})();
