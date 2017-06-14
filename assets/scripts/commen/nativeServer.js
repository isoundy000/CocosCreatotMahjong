var NativeServer    = {};
var dataPath        = "majiangLocalData";
var selfAdd         = 0;

NativeServer.uniqueID= function () {
    var head = (new Date()).getTime();
    selfAdd = selfAdd + 1;
    if( ! NativeServer.UniqueIDPool || NativeServer.UniqueIDPool.length <= 0 ){
        NativeServer.UniqueIDPool = [];
    }
    NativeServer.UniqueIDPool[selfAdd] = head+selfAdd;
    var id = NativeServer.UniqueIDPool[selfAdd];
    return id
}

NativeServer.login = function(lander, isNew, playerID) {
    var db = require("db");
    var userInfo = db.get("UserInfo")
    if( userInfo ){
        return
    }
    var timer = (new Date()).getTime()
    var timerFour = timer.toString().substr(timer.toString().length-4)
    playerID = playerID || "1000"+timerFour;
    this.playerID = playerID;
    var dbFile = JSON.parse(cc.sys.localStorage.getItem(dataPath + playerID ));
    if(!dbFile) {
        dbFile = this.createNewUserData(lander, playerID);
    }
    for(let k in dbFile){
        db.GameData[k] = dbFile[k]
    }
    this.saveDB();
}

NativeServer.createNewUserData = function (lander, playerID) {
    var data            = {}
    var userInfo        = {}
    userInfo.lander     = lander
    userInfo.id         = playerID
    userInfo.roomCard   = 2017
    userInfo.sex        = ""
    userInfo.head       = ""
    userInfo.nickname   = ""
    userInfo.ip         = ""

    data.UserInfo = userInfo
    return data
}

NativeServer.saveDB = function(){
    var db = require("db");
    cc.sys.localStorage.setItem(dataPath + this.playerID, JSON.stringify(db.GameData));
}

module.exports = NativeServer;