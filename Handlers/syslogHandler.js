const syslog = require('modern-syslog');
const Interface = require('./Interface');
const LoggerInterface = require('./LoggerInterface');
const SyslogFormatter = require('../Formatter/SyslogFormatter');

const SyslogHandler = class Syslog{

    prorityConvert(){
        return {
            "error": "LOG_ERR",
            "warn": "LOG_WARNING",
            "notice": "LOG_NOTICE",
            "info": "LOG_INFO",
            "verbose": "LOG_DEBUG",
            "debug": "LOG_DEBUG"
        }
      }

    constructor(config) {config;
        this.defaultConfig = {
            "ident": "app",
            "facility": "LOCAL7",
            "host": "127.0.0.1",
            "msgId": "default",
            "app_name": "default",
            "limit_level": "LOG_INFO",
            "option": "LOG_CONS"
        }
        if(config){
            config = {
                ...this.defaultConfig,
                ...config
            }
        } else {
            config = this.defaultConfig
        }

        syslog.open(config.ident, config.option, syslog.toFacility(`LOG_${config.facility}`));
        syslog.upto(config.limit_level);
        Interface.checkImplements(this, LoggerInterface);
        this.formatter = new SyslogFormatter(config);
    }

    log(level, ...mixed_vars) {
        syslog.log(syslog.level[this.prorityConvert()[level]], this.formatter.formatterResult(level, mixed_vars));
    }
};

const createSyslogHandler = function createSyslogHandler(config) {
    return new SyslogHandler(config);
};

module.exports = createSyslogHandler;


