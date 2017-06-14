cc.Class({
    extends: cc.Component,

    properties: {
    	parentNode: cc.Node,
        createRoomNode: cc.Node,

        luzhouPrefab: cc.Prefab,
    },

    onLoad: function () {
    	this.promptBoxFunc(this.luzhouPrefab);
    },

    createRoomBtnClick : function () {
    	cc.director.loadScene('GameScene');
    },

    luzhouBtnClick : function () {
    	this.promptBox.active = true;
    },
    xingwenBtnClick : function () {
    	this.promptBox.active = false;
    },
    changningBtnClick : function () {
		this.promptBox.active = false;
    },
    jianganBtnClick : function () {
    	this.promptBox.active = false;
    },
    xuyongBtnClick : function () {
    	this.promptBox.active = false;
    },
    gulinBtnClick : function () {
    	this.promptBox.active = false;
    },
    hejiangBtnClick : function () {
    	this.promptBox.active = false;
    },

    promptBoxFunc : function(prefab, cs) {
        this.createRoomNode.active = true;
        this.promptBox = cc.instantiate(prefab);
        this.promptBox.setPosition(cc.p(0, 0));
        this.createRoomNode.addChild(this.promptBox);
        if (cs) this.promptBox.getComponent("promptBox").getMessageFrom(cs);
    },

    closeBtnClick : function () {
    	this.parentNode.removeFromParent();
    },
});
