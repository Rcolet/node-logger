const util = require('util');
const async = require('async');

let pos;

module.exports = function format(...mixed_var){
    itIsRequestToUseFormatLib(mixed_var);
    if(Object.keys(pos).length)
        return parseToFormat(...mixed_var);
    return mixed_var;
}

function parseToFormat(...mixed_var){
    let result = [];
    let pt = 0;
    while(pt < mixed_var.length){
        if(pos[pt]){
            let tmp = [mixed_var[pt]];
            for(let i = 0; i < pos[pt]; i++){
                tmp.push(mixed_var[pt + i + 1]);
            }
            result.push(util.format(...tmp));
            pt += pos[pt] + 1;
        } else {
            result.push(mixed_var[pt]);
            pt++;
        }
    }
    return result;
}

async function itIsRequestToUseFormatLib(...mixed_var){
    let pt = 0;
    pos = {};
    await async.each(
        ...mixed_var,
        (toTest, each_callback) => {
            let lengthVar;
            if(typeof toTest === 'string'){
                if(lengthVar = ((toTest).match(/%[sdjifoO%]/g) || []).length){
                    pos[pt] = lengthVar - ((toTest).match(/%%/g) || []).length;
                }
            }
            pt++;
            each_callback();
        }, (err) => {
            if(err) {
                console.log(`ERROR : ${err}`)
                process.exit();
            }
        }
    )
}

