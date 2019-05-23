var NormalizerFormatter = require('./NormalizerFormatter');

module.exports = class SyslogFormatter extends NormalizerFormatter {
    static keys(){
        return [
            'app_name',
            'level',
            'LEVEL',
            'message'
        ]
    }

    static blackList(){
        return [
            'date', 
            'date_time',
            'hostname',
            'host'
        ]
    }
    
    constructor(config){
        super(config);
        this.config = config;
        if(this.config.format) {  
            super.verif(
                this.config.format, 
                SyslogFormatter.keys(),
                SyslogFormatter.blackList()
            );
        } else {
            super.verif(
                "{app_name} {level} {message}",
                SyslogFormatter.keys(),
                SyslogFormatter.blackList()
            );
        }
    }

    formatterResult(level, message){
        return super.formatterResult("string", {
            app_name: this.config.app_name,
            level: level,
            LEVEL: level.toUpperCase(),
            message: message
        })
    }
}