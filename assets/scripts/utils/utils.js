var utils = {
    debugLog : true,

    log : function() {
        if(!utils.debugLog) { return }
        for(var k in arguments) {
            cc.log(arguments[k]);
        }
    },

    newRandomSeed : function() {
        Math.seed = (new Data()).getTime();
    },

    intRandom : function(min, max) {
        min = parseFloat(min);
        max = parseFloat(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    cloneData : function(fa) {
        var cloneObj;
        if (fa.constructor == Object) {
            cloneObj = new fa.constructor();
        }else if (fa.constructor == Array) { 
            cloneObj = [];
        }
        else
        {
            cloneObj = new fa.constructor(fa.valueOf());
        }
        for(var key in fa) {
            if(cloneObj[key] !== fa[key]) {
                if(typeof(fa[key]) === "object") {
                    cloneObj[key] = this.cloneData(fa[key]);
                }else {
                    cloneObj[key] = fa[key];
                }
            }
        }
        return cloneObj;
    },
}

module.exports = utils;