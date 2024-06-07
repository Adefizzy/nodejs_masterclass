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
   return await fileHandle.writeFile(JSON.stringify(data), "utf-8");
  } finally {
    // close file after writting.
    if (fileHandle) {
      await fileHandle.close();
    }
  }
};

lib.read = async function(dir, file){
    try {
        const data = await fs.readFile(path.join(this.baseDir, dir, `${file}.json`), 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if(error.code === 'ENOENT') return null
        console.log('Error occurred while reading file')
    }
}

lib.update = async function(dir, file, data){
    let fd;
    try {
         fd = await fs.open(path.join(this.baseDir, dir, `${file}.json`), 'r+');

        await fd.truncate();

        await fd.writeFile(JSON.stringify(data), "utf8")

    } catch (error) {
        if(error.code === 'ENOENT'){
            console.log('file does not exist')
        }else{
            console.log(error)
        }
      
    }finally{
        if(fd) fd.close()
    }
}

lib.delete = async function(dir, file){
    try {
        await fs.unlink(path.join(this.baseDir, dir, `${file}.json`))

    } catch (error) {
        console.log(error)
    }
}

module.exports = lib;
