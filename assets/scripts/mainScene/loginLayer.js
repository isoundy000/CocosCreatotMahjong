var nativeServer = require("nativeServer");
var db           = require("db");

cc.Class({
    extends: cc.Component,

    properties: {
        loginLayerNode: cc.Node,
        wxLogin: cc.Node,
        guestLogin: cc.Node,
        agreeToggle: cc.Node,
        agreeText: cc.Node,
        agreeBoxPrefab: cc.Prefab,
        promptBoxPrefab: cc.Prefab,
    },

    onLoad: function () {
        
    },

    wxLoginBtnClick : function() {
        this.promptBoxFunc(this.promptBoxPrefab, "jing_qing_qi_dai");
    },

    guestLoginBtnClick : function() {
        var isChecked = this.agreeToggle.getComponent(cc.Toggle).isChecked
        if(isChecked == true){
            cc.director.loadScene('MainScene');
            this.guestUserInfo();
        } else {
            this.promptBoxFunc(this.promptBoxPrefab, "user_doc_not_choose");
        }
    },

    agreeTextBtnClick : function() {
        this.promptBoxFunc(this.agreeBoxPrefab);
        this.agreeToggle.getComponent(cc.Toggle).isChecked = true;
    },

    guestUserInfo : function() {
        var userinfo = db.get("UserInfo")
        if(userinfo === undefined)
            nativeServer.login("guest", "new");
        else
            nativeServer.login("guest", "old", userinfo.id);
    },

    promptBoxFunc : function(prefab, cs) {
        this.loginLayerNode.active = true;
        var promptBox = cc.instantiate(prefab);
        promptBox.setPosition(cc.p(0, 0));
        this.loginLayerNode.addChild(promptBox);
        if (cs) promptBox.getComponent("promptBox").getMessageFrom(cs);
    },
});
