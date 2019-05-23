const async = require('async');
const format = require('./lib/format');
const npmlog = require('./Handlers/npmlogHandler');

const Logger = class Logger {

    constructor(...handlers) {
        this.handlers = [];
        if(handlers.length === 0){
            this.defaultHandlers();
        } else {
            this.addHandlers(handlers);
        }
        this.wrap('error');
        this.wrap('warn');
        this.wrap('notice');
        this.wrap('info');
        this.wrap('debug');
        this.wrap('verbose');
    }

    defaultHandlers(){
        this.addHandler(new npmlog());
    }

    getHandlers() {
        return this.handlers;
    }

    addHandler(handler) {
        this.handlers.push(handler);
    }

    async addHandlers(handlers) {
        const _this = this;
        async.each(handlers,
            (key, each_callback) => {
                _this.addHandler(key);
                each_callback();
            },
            (err) => {
                if(err){
                   console.error(err);
                   process.exit(1);
                }
            }
        )
    }

    log(level, ...mixed_vars) {
        this.handlers.forEach(handler => {
            handler.log(level, ...mixed_vars);
        });
    }

    wrap(level){
        this[level] = (...mixed_vars) => {
            this.log(level, ...format(...mixed_vars));
        };
    }
};

module.exports = Logger;