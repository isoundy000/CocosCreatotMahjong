var db = require("db");

cc.Class({
    extends: cc.Component,

    properties: {
    	mainSceneNode: cc.Node,
    	nickname: cc.Label,
    	userID: cc.Label,
    	roomCardNum: cc.Label,
    	promptBoxPrefab: cc.Prefab,
    	createRoomPrefab: cc.Prefab,
    },

    onLoad: function () {
    	this.mainInit();
    },

    update: function (dt) {

    },

    mainInit: function () {
    	var userinfo = db.get("UserInfo");
        if(!userinfo) return;
    	this.roomCardNum.string = userinfo.roomCard;
    	this.nickname.string = userinfo.nickname;
    	this.nickname.string = userinfo.id;
    },

    headBtnBtnClick : function () {

    },

    daerBtnClick : function () {
    	this.promptBoxFunc(this.createRoomPrefab);
    },

    wechatShareBtnClick : function () {
    	this.promptBoxFunc(this.promptBoxPrefab, "jing_qing_qi_dai");
    },

    shopBtnClick : function () {

    },


    recordBtnClick : function () {

    },

    newsBtnClick : function () {

    },

    helpBtnClick : function () {

    },

    setBtnClick : function () {

    },

    addRoomBtnClick : function () {

    },

    addRoomCardBtnClick : function () {

    },

    promptBoxFunc : function(prefab, cs) {
        this.mainSceneNode.active = true;
        var promptBox = cc.instantiate(prefab);
        promptBox.setPosition(cc.p(0, 0));
        this.mainSceneNode.addChild(promptBox);
        if (cs) promptBox.getComponent("promptBox").getMessageFrom(cs);
    },
});
