const fs = require("fs/promises");
const path = require("path");

// Container to be exported
const lib = {};

// base dir of the data folder
lib.baseDir = path.join(__dirname, "..", ".data");

// write data to a file
lib.create = async function (dir, file, data) {
  let fileHandle;
  try {
    // open file and get filehandle
    fileHandle = await fs.open(
      path.join(this.baseDir, dir, `${file}.json`),
      "wx"
    );

    // write to file using file handle
    await fileHandle.writeFile(JSON.stringify(data), "utf-8");
  } catch (error) {
   if(error.code === 'EEXIST'){
    console.log('File already exist')
   }else{
    console.log(error.code)
   }
  } finally {
    // close file after writting.
    if (fileHandle) {
      await fileHandle.close();
    }
  }
};


module.exports = lib;
