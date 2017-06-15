var utils = require("utils");

cc.Class({
    extends: cc.Component,

    properties: {
        mahjongNode1: cc.Node,
        mahjongNode2: cc.Node,
        mahjongNode3: cc.Node,
        mahjongNode4: cc.Node,
    },

    onLoad: function () {
        var shuffle = this.mahjongShuffle(this.cardsArrayInit());
        this.sendCards(shuffle);
        this.mahjongShow();
    },

    // 发牌算法
    sendCards : function (shuffle) {
        var player = {};
        for(let i=0; i<4; i++){
            player["robot"+i] = {};
            player["robot"+i].mahjong = new Array();
        }
        for(let i=0; i<52; i++){
            if(i<13) player.robot0.mahjong[i] = shuffle[i];
            else if(i>=13 && i<26) player.robot1.mahjong[i-13] = shuffle[i];
            else if(i>=26 && i<39) player.robot2.mahjong[i-26] = shuffle[i];
            else if(i>=39) player.robot3.mahjong[i-39] = shuffle[i];
            shuffle = this.reduceGetNewArray(shuffle, i);
        }
        for(let i=0; i<4; i++) player["robot"+i].mahjong.sort();

        this.player = player;
        this.restCards = shuffle;
    },

    // 麻将发牌显示
    mahjongShow : function () {
        var self = this;
        for(let i=0; i<4; i++){
            var mahjongNode = this["mahjongNode"+(i+1)];
            mahjongNode.getChildByName("mahjong14").active = false;
            this.mahjongSetPositon(mahjongNode, 13);
        }
        cc.loader.loadRes("images/mahjong/pai", cc.SpriteAtlas, function(err, atlas){
            if (err) { log (err); return; }
            var img;
            for(let i=0; i<4; i++){
                var mahjongNode = self["mahjongNode"+(i+1)];
                for(let j=0; j<13; j++){
                    var count = self.player["robot"+i].mahjong[j]
                    var cardNum = count.toString().substr(count.toString().length-2, 1);
                    if(count<200)
                        img = "nan_tong_" + cardNum;
                    else if (count>200 && count<300)
                        img = "nan_tiao_" + cardNum;
                    else
                        img = "nan_wan_" + cardNum;
                    var frame = atlas.getSpriteFrame(img);
                    var mahjong = mahjongNode.getChildByName("mahjong"+(j+1));
                    var pai = mahjong.getChildByName("card");
                    pai.getComponent(cc.Sprite).spriteFrame = frame;
                }
            }
        });
    },

    // 选缺
    chooseNoNeed : function () {
        
    },

    // 根据牌的数量调整牌的位置
    mahjongSetPositon : function (mahjongNode, num) {
        var name = mahjongNode.name;
        if(name === "mahjongNode1")
            mahjongNode.setPosition(cc.p(-40*(num-1)/2, -250));
        else if(name === "mahjongNode2")
            mahjongNode.setPosition(cc.p(-350, 23*(num-1)/2));
        else if(name === "mahjongNode3")
            mahjongNode.setPosition(cc.p(-40*(num-1)/2, 200));
        else
            mahjongNode.setPosition(cc.p(350, 23*(num-1)/2));
    },

    // 洗牌
    mahjongShuffle : function (mahjongOld) {
        var mahjong = utils.cloneData(mahjongOld);
        var shuffle = new Array();
        for(let i=0; i<mahjongOld.length; i++){
            var random = utils.intRandom(0, mahjongOld.length-i-1);
            shuffle[i] = mahjong[random];
            mahjong = this.reduceGetNewArray(mahjong, random);
        }
        return shuffle;
    },
    // 随机取出一张牌后 原来的数组中减去被取出的那张牌
    reduceGetNewArray : function (mahjong, random) {
        for(var i=mahjong.length-1; i>=0; i--){
            if(i === random){
                mahjong.splice(i, 1);
            }
        }
        return mahjong;
    },

    // 牌的初始化 按顺序
    cardsArrayInit : function () {
        var cardSort = new Array();
        for(let i=0; i<3; i++){
            cardSort[i] = new Array();
            for(let j=0; j<36; j++) {
                cardSort[i][j] = (i+1)*100 + Math.floor(j/4+1)*10 + (j%4+1);
            }
        }
        var cardSortSingle = new Array();
        for(let i=0; i<108; i++){
            cardSortSingle[i] = cardSort[Math.floor(i/36)][i%36];
        }
        return cardSortSingle;
    },

    downCardBtnClick : function (event, customEventData) {
        cc.log("=== customEventData: ", customEventData);
    },
});

