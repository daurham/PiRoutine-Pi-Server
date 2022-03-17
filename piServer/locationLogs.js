const fs = require('fs');
const file = 'Log.txt';

const writeLog = (loc, des, oldData = null) => {
  let mergedData = `
{
    "Location": ${loc},
    "Description: ${des}
}
${oldData}
  `;
  fs.writeFile(file, mergedData, (err, finalData) => {
    if (err) {
      console.log('fs.writeFile ERR: ', err);
    }
    console.log('Recorded new txt data!');
  })
};

const readLog = (cb) => {
  fs.readFile(file, (err, txtFileData) => {
    if (err) {
      cb(err);
    } else {
      cb(null, txtFileData);
    }
  });
};

module.exports = passData = (loc, des) => {
  readLog((err, txt) => {
    if (err) {
      console.log('[function] "readData" ERROR: ', err);
    } else {
      writeLog(loc, des, txt);
    }
  })
};