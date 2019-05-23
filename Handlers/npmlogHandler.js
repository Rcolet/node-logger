const Interface = require('./Interface');
const LoggerInterface = require('./LoggerInterface');
const formatter = require('../Formatter/NpmlogFormatter');
const fs = require('fs');

const npmlogHandler = class npmlogHandler {
    constructor(options = undefined){
        this.stdout = true;

        var npmlog = require("npmlog");

        npmlog.addLevel('debug', -999999, { inverse: true }, 'debug');

        for (var label in npmlog.disp) {
            npmlog.disp[label] = "[" + npmlog.disp[label].toLocaleUpperCase() + "]";
        }

        if (options && options.level) {
            npmlog.level = options.level;
        } else {
            npmlog.level = "info";
        }

        if (options && options.stream) {
            if (typeof options.stream === 'string' && options.stream !== "process.stdout") {
                this.stdout = false;
                npmlog.stream = fs.createWriteStream(options.stream, {flags: 'a'});
            }
        }

        this.npmlog = npmlog;
        this.level = npmlog.level;
        Interface.checkImplements(this, LoggerInterface);
        this.formatter = new formatter(options);
    }

    getPrefix(level)
    {
        if (level === 'verbose' || level === 'debug' || this.stdout === true) {
            return '';
        }

        return "[" + new Date().toString() + "]";
    }

    log(level, ...mixed_vars) {
        this.npmlog[level](this.getPrefix(level), ...this.formatter.formatterResult(...mixed_vars));
    }

};

const createLoggerHandler = function createLoggerHandler(options) {
    return new npmlogHandler(options);
};

module.exports = createLoggerHandler;