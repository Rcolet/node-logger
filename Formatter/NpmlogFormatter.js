var NormalizerFormatter = require('./NormalizerFormatter');

module.exports = class NpmlogFormatter extends NormalizerFormatter {
    static keys(){
        return [
            'message',
            'date_time',
            'date',
            'hostname',
            'host'
        ]
    }

    static blackList(){
        [
            'level',
            'LEVEL'
        ]
    }
    
    constructor(config){
        super(config);
        if(config && config.format){
            this.format = config.format;
        } else {
            this.format = "{message}";
        }
        super.verif(
            this.format, 
            NpmlogFormatter.keys(),
            NpmlogFormatter.blackList()
        );
    }

    formatterResult(...message){
        return super.formatterResult("list", {
            message: message
        })
    }
}