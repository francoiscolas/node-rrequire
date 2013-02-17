// rrequire v0.1.0
// https://github.com/francoiscolas/node-rrequire

var FS   = require('fs');
var PATH = require('path');

var fileName = function (path) {
    return path.split(PATH.sep).pop();
};

var baseName = function (path) {
    return fileName(path).split('.').shift();
};

var isHidden = function (path) {
    return /^\./.test(fileName(path));
};

var camelize = function (string) {
    return string.replace(/(?:^|_|-)+(.)?/g, function(match, chr) {
        return chr ? chr.toUpperCase() : '';
    });
};

var rrequire = function (dir) {
    var tree = {};

    FS.readdirSync(dir).forEach(function (entry) {
        var path = PATH.resolve(dir, entry);
        var stat = FS.statSync(path);

        if (!isHidden(path)) {
            if (stat.isDirectory())
                tree[entry] = rrequire(path);
            else
                tree[camelize(baseName(entry))] = require(path);
        }
    });
    return tree;
};

module.exports = global.rrequire = rrequire;
