var utils = require("utils");

cc.Class({
    extends: cc.Component,

    properties: {
        mahjongNode1: cc.Node,
        mahjongNode2: cc.Node,
        mahjongNode3: cc.Node,
        mahjongNode4: cc.Node,
        menuBtn: cc.Node,
        menuBack: cc.Node,
        centerBox: cc.Node,
    },

    onLoad: function () {
        this.clickCardBtn = false;
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
            for(let i=0; i<4; i++){
                var mahjongNode = self["mahjongNode"+(i+1)];
                for(let j=0; j<13; j++){
                    var count = self.player["robot"+i].mahjong[j]
                    var frame = atlas.getSpriteFrame(self.getImgByCardId(count));
                    var mahjong = mahjongNode.getChildByName("mahjong"+(j+1));
                    var pai = mahjong.getChildByName("card");
                    pai.getComponent(cc.Sprite).spriteFrame = frame;
                }
            }
        });
        var banker = utils.intRandom(0, 3); //随机选择一位庄家
        this.getNewCard(banker, 13);
    },
    // 根据牌的id选择牌
    getCardById : function (cardId, num, nodeId) {
        var self = this;
        var mahjongNode = this["mahjongNode"+(nodeId+1)];
        this.mahjongSetPositon(mahjongNode, num);
        var mahjong = mahjongNode.getChildByName("mahjong"+num);
        mahjong.active = true;
        cc.loader.loadRes("images/mahjong/pai", cc.SpriteAtlas, function(err, atlas){
            if (err) { log (err); return; }
            var frame = atlas.getSpriteFrame(self.getImgByCardId(cardId));
            var pai = mahjong.getChildByName("card");
            pai.getComponent(cc.Sprite).spriteFrame = frame;
        });
    },
    // 根据 cardId 获取 img 名称
    getImgByCardId : function (cardId) {
        var img;
        var cardNum = cardId.toString().substr(cardId.toString().length-2, 1);
        if(cardId<200)
            img = "nan_tong_" + cardNum;
        else if(cardId>200 && cardId<300)
            img = "nan_tiao_" + cardNum;
        else
            img = "nan_wan_" + cardNum;
        return img;
    },

    // 摸排
    getNewCard : function (player, lastCards) {
        this.player["robot"+player].mahjong[lastCards] = this.restCards[1];
        this.getCardById(this.restCards[1], lastCards+1, player);
        this.restCards = this.reduceGetNewArray(this.restCards, 1);
        var cardNumber = this.centerBox.getChildByName("number");
        cardNumber.getComponent(cc.Label).string = this.restCards.length;
        this.setArrowShow(player);
        if(lastCards === 13) {
            let mjArray = this.player["robot"+player].mahjong;
            this.cardSetSort(mjArray, player);
        }
    },
    // 设置该谁出牌的箭头显示
    setArrowShow : function (player) {
        for(let i=1; i<4; i++)
            this.centerBox.getChildByName("arrow"+i).active = false;
        this.centerBox.getChildByName("arrow"+(player+1)).active = true;
    },
    // 牌 排序 显示
    cardSetSort : function (cardArray, nodeId) {
        var self = this;
        cardArray.sort();
        var mahjongNode = this["mahjongNode"+(nodeId+1)];
        for(let i=1; i<15; i++) 
            mahjongNode.getChildByName("mahjong"+i).active = false;
        cc.loader.loadRes("images/mahjong/pai", cc.SpriteAtlas, function(err, atlas){
            if (err) { log (err); return; }
            for(let i=0; i<cardArray.length; i++){
                var frame = atlas.getSpriteFrame(self.getImgByCardId(cardArray[i]));
                var mahjong = mahjongNode.getChildByName("mahjong"+(i+1));
                mahjong.active = true;
                var pai = mahjong.getChildByName("card");
                pai.getComponent(cc.Sprite).spriteFrame = frame;
            }
        });
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
        var mahjong = this.mahjongNode1.getChildByName("mahjong"+customEventData);
        var py = mahjong.getPositionY();
        cc.log("py1 = ", py);
        var length = this.player.robot0.mahjong.length;
        for(let i=1; i<=length; i++) {
            var all = this.mahjongNode1.getChildByName("mahjong"+i);
            all.setPosition(cc.p(all.getPositionX(), 0));
        }
        if(this.clickCardBtn === false) {
            mahjong.setPosition(cc.p(mahjong.getPositionX(), mahjong.getPositionY()+10));            
            this.clickCardBtn = true;
        } else {
            cc.log("py2 = ", py);
            if(py === 0){
                mahjong.setPosition(cc.p(mahjong.getPositionX(), mahjong.getPositionY()+10));            
                this.clickCardBtn = true;
            } else {
                mahjong.setPosition(cc.p(mahjong.getPositionX(), 0));
                this.clickCardBtn = false;
            }
        }
    },

    menuBtnClick : function () {
        this.scheduleOnce(function(){
            if(!this.menuBack.active) {
                this.isMenuOpen = true;
                this.menuBack.active = true;
            } else {
                this.isMenuOpen = false;
                this.menuBack.active = false;
            }
        }, 0.1);
        
    },
    setBtnClick : function () {

    },
    skinBtnClick : function () {

    },
    helpBtnClick : function () {

    },
    exitBtnClick : function () {
        cc.director.loadScene('MainScene');
    },
});

