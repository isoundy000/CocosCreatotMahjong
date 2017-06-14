cc.Class({
    extends: cc.Component,

    properties: {
        promptBoxNode: cc.Node,
        content: cc.Label,
    },

    getMessageFrom : function(message, data) {
        this.msg = message;
        this.data = data;
        this.updateContent();
    },

    updateContent : function () {
        if(this.msg === "jing_qing_qi_dai")
            this.content.string = "敬请期待！";
        else if (this.msg === "user_doc_not_choose")
            this.content.string = "请先阅读用户协议！";
    },

    sureBtnClick : function () {
        this.promptBoxNode.removeFromParent();
    },

    closeBtnClick : function () {
        this.promptBoxNode.removeFromParent();
    },
});
