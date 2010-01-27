var Unit = {};

Unit.labels = { ohms : '\u2126', kilo_ohms : 'k\u2126', mega_ohms : 'M\u2126' };

Unit.normalizeToOhms = function(value, unit) {
    switch (unit) {
    case Unit.labels.ohms:
        return value;
    case Unit.labels.kilo_ohms:
        return value * 1000;
    case Unit.labels.mega_ohms:
        return value * 1e6;
    }
    return null;
};
    
Unit.ohmCompatible = function(unit) {
    if (unit == Unit.labels.ohms || unit == Unit.labels.kilo_ohms ||
        unit == Unit.labels.mega_ohms)
    {
        return true;
    }
    return false;
};

// Return a string with a unit representing the resistance value.
// value: resistance value in ohms
Unit.res_str = function(value) {
    var vstr;
    var unit;
    
    if (value < 1000) {
        vstr = String(value);
        unit = Unit.labels.ohms;
    }
    else {
        vstr = String(value / 1000);
        unit = Unit.labels.kilo_ohms;
    }
    
    var n = vstr.match('.') ?  4 : 3;
    if (vstr.length > n) {
        vstr = vstr.substring(0, n);
    }
    return vstr + unit;
};