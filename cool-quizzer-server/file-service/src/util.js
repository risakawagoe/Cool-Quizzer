var path = require('path');
const { v4 } = require("uuid");

const generateUniqueFilename = (filename) => {
    const extname = path.extname(filename);
    const endpos = filename.length - extname.length;
    const basename = filename.substr(0, endpos);
    return basename + '_' + v4() + extname;
}

module.exports = { generateUniqueFilename };