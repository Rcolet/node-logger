const moment = require("moment");
const async = require('async');
const os = require('os');

module.exports = class NormalizerFormatter {

    constructor(config){
        this.dateFormat = "";
        if(config && config.dateFormat){
            this.dateFormat = config.dateFormat;
        } else {
            this.dateFormat = "";
        }
        this.listKeyFormat = [];
        this.TYPE = {
            string: "string",
            list: "list"
        }
        this.verif();
    }

    async verif(format, keys, blacklist = []){
        var regex = /\{([^\s]+)\}/g;
        var tmp;
        while (tmp = regex.exec(format)) this.listKeyFormat.push(tmp[1]);
        await async.each(blacklist, (blackKey, each_callback) => {
            let re = new RegExp(`\\b${blackKey}\\b`, 'g');
            if(format.search(re) !== -1){
                console.log(`ERROR : "${blackKey}" it is already implemented in ${this.constructor.name.replace('Formatter', ' Logger')}`);
                console.log(`ERROR : Delete "${blackKey}" in your date format config`);
                process.exit();
            }
            each_callback();
        }, (err) => {
            if(err){
                console.log("ERROR :  loop fail...");
            } else {
                for(let userKey of this.listKeyFormat){
                    if(!keys.includes(userKey)){
                        console.log(`ERROR : "{${userKey}}" is not compitible for date format in ${this.constructor.name.replace('Formatter', ' Logger')}`);
                        process.exit();
                    }
                }
            }
        })
    }

    formatterResult(type, data){
        const date = moment().format(this.dateFormat);
        let result;
        const dataBis = {
            ...data,
            date: date, 
            date_time: date,
            host: os.hostname(),
            hostname: os.hostname()
        };
        switch (type) {
            case this.TYPE.string:
                result = "";
                this.listKeyFormat.map(key => {
                    if(typeof dataBis[key] === 'string')
                        result += dataBis[key];
                    else
                        result += JSON.stringify(dataBis[key]);
                    result += " ";
                });
                return result;
            case this.TYPE.list:
                result = [];
                this.listKeyFormat.map(key => {
                    result.push(dataBis[key]);
                });
                return result;
            default:
                echo `ERROR : ${type} not exist to formatter result`;
                process.exit();
                break;
        }
    }
}