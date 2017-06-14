var utils = require("utils");

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad: function () {
        cc.log("======== 麻将游戏·上 ========");
        this.sendCards();
        var shuffle = this.mahjongShuffle(this.cardsArrayInit());
        this.sendCards(shuffle);

        cc.log("======== 麻将游戏·下 ========");
    },

    sendCards : function (shuffle) {
        cc.log("=== 发·牌 ===");
        var userMahjong = new Array();
        

        
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
        cc.log(shuffle);
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
        cc.log("=== 创建牌的数组：筒1·条2·万3 ===");
        var cardSort = new Array();
        for(let i=0; i<3; i++){
            cardSort[i] = new Array();
            for(let j=0; j<36; j++) {
                cardSort[i][j] = (i+1)*100 + Math.floor(j/4+1)*10 + (j%4+1);
            }
        }
        cc.log(cardSort);
        var cardSortSingle = new Array();
        for(let i=0; i<108; i++){
            cardSortSingle[i] = cardSort[Math.floor(i/36)][i%36];
        }
        cc.log(cardSortSingle);
        return cardSortSingle;
    },
});

