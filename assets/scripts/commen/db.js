var eventCenter = require("eventCenter");
var nativeServer = require("nativeServer");

var db = {
    userInfo : null,
    GameData : {},
    keys_ :
      [
        "UserInfo",
      ],

    get : function(key, isLog) {
        if(isLog !== undefined) {
            cc.log(db.GameData[key] ,"\n-- db get" + key + " --")
        }
        return db.GameData[key]
    },

    set : function(key, value, isLog) {
        db.GameData[key] = value
        eventCenter.dispatch(key, value)
        if(isLog !== undefined) {
            cc.log(value, "\n-- db set" + key + " --")
        }
        require("nativeServer").saveDB(db.GameData)
    },

    initDB : function() {
        for(let k in this.keys_) {
            let v = this.keys_[k];
            db.GameData[v] = {};
        }
    }
}
module.exports = db;