// let unit                  = require('./unit');

export function parse(/* params */) {
    // ...
}

export default class MathParser {
  standardizeUnits = function(string) {
    string = string.replace(/ohms/gi,"&#x2126;");
    string = string.replace("micro","&#x00b5;");
    string = string.replace("milli","m");
    string = string.replace("kilo","k");
    string = string.replace("mega","M");
    return string;
  };
}
