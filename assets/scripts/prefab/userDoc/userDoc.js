cc.Class({
    extends: cc.Component,

    properties: {
        userDoc: cc.Node,
    },

    onLoad: function () {

    },

    sureBtnClick : function() {
        this.userDoc.removeFromParent();
    },
});
