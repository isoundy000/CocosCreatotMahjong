var utils = require("utils");
var eventCenter = require("eventCenter");

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
        discardNode: cc.Node,
        chooseMissing: cc.Node,
    },

    onLoad: function () {
        this.clickCardBtn = false;
        var shuffle = this.mahjongShuffle(this.cardsArrayInit());
        this.sendCards(shuffle);
        this.mahjongShow();
        this.thisVariableInit();
        this.registerEventCenter();
    },
    thisVariableInit : function () {
        this.time = new Array();
        var timer = (new Date()).getTime();
        this.time[this.time.length] = timer;
        this.discardArray = new Array();
        for(let i=0; i<4; i++) 
            this.discardArray[i] = new Array();
        this.couldAnyDiscard = false;
        this.firstDiscard = true;
    },

    registerEventCenter: function() {
        var self = this;
        eventCenter.new("gameSceneDiscardListener", "discardListener",  function(event, data) {
            if(self.couldAnyDiscard){
                self.setArrowShow(data);
                if(data != 0)
                    self.discardFunc(data+1, self.judgeRobotDiscard(data));
            }
        }, 1);
    },
    unRegisterEventCenter : function() {
        eventCenter.delete("gameSceneDiscardListener");
    },
    onDestroy : function() {
        this.unRegisterEventCenter();
    },
    update: function (dt) {

    },

    // 判断机器人出哪张牌 先打缺
    judgeRobotDiscard : function (robot) {
        var missCard = this.chooseMissArray[robot];
        if (missCard == "tong")
            missCard = 1;
        else if (missCard == "tiao")
            missCard = 2;
        else if (missCard == "wan")
            missCard = 3;
        var mahjong = this.player["robot"+robot].mahjong;
        for(let i=0; i<mahjong.length; i++){
            var cardId = mahjong[i].toString().substr(mahjong[i].toString().length-3, 1);
            if (cardId == missCard)
                return i+1;
        }
        return 1;
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
        this.whichDiscard = banker;
        this.getNewCard(banker, 13);
        this.chooseMissingFunc();
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

    // 选缺
    chooseMissingFunc : function () {
        this.chooseMissArray = new Array();
        //机器人选缺
        var leastCard = this.findLeastCards();
        for(let i=1; i<4; i++)
            this.missCardShow(i+1, leastCard[i]);
        //玩家选缺
        var chooseMiss = this.chooseMissing.getChildByName("chooseMiss");
        chooseMiss.active = true;
        var timer = 10;
        this.chooseMissCallback = function(){
            timer--;
            if(timer>=0)
                chooseMiss.getChildByName("timer").getComponent(cc.Label).string = timer;
            else {
                chooseMiss.active = false;
                this.unschedule(this.chooseMissCallback);
                this.missCardShow(1, leastCard[0]);
                this.couldAnyDiscard = true;
            }
        }
        this.schedule(this.chooseMissCallback, 1);
    },
    //选缺结束 图片显示四家缺门
    missCardShow : function (missID, kind) {
        var missing = this.chooseMissing.getChildByName("miss"+missID);
        missing.active = true;
        cc.loader.loadRes("images/mahjong/dapai", cc.SpriteAtlas, function(err, atlas){
            if (err) { log (err); return; }
                var frame = atlas.getSpriteFrame(kind);
                missing.getComponent(cc.Sprite).spriteFrame = frame;
        });
    },
    //选出牌中 最少的一门
    findLeastCards : function () {
        var leastCards = new Array();
        for(let i=0; i<4; i++){
            var mahjong = this.player["robot"+i].mahjong;
            var a=0, b=0, c=0;
            for(let j=0; j<mahjong.length; j++){
                var kind = mahjong[j].toString().substr(mahjong[j].toString().length-3, 1);
                if (kind == 1)
                    a++;
                else if (kind == 2)
                    b++;
                else
                    c++;
            }
            var minAB = a-b>0 ? b : a;
            var min = minAB-c>0 ? c : minAB;
            if(a === min)
                leastCards[i] = "tong";
            else if(b === min)
                leastCards[i] = "tiao";
            else
                leastCards[i] = "wan";
            this.chooseMissArray[i] = leastCards[i];
        }
        cc.log(leastCards);
        return leastCards;
    },
    //玩家选缺
    chooseMissBtnClick : function(event, customEventData) {
        if(customEventData == 1)
            this.chooseMissArray[0] = "tong";
        else if(customEventData == 2)
            this.chooseMissArray[0] = "tiao";
        else if(customEventData == 3)
            this.chooseMissArray[0] = "wan";
        this.chooseMissing.getChildByName("chooseMiss").active = false;
        this.missCardShow(1, this.chooseMissArray[0]);
        this.unschedule(this.chooseMissCallback);
        this.couldAnyDiscard = true;
        eventCenter.dispatch("discardListener", this.whichDiscard);
    },

    // 摸排
    getNewCard : function (player, lastCards) {
        this.player["robot"+player].mahjong[lastCards] = this.restCards[1];
        this.getCardById(this.restCards[1], lastCards+1, player);
        this.restCards = this.reduceGetNewArray(this.restCards, 1);
        var cardNumber = this.centerBox.getChildByName("number");
        cardNumber.getComponent(cc.Label).string = this.restCards.length;
        this.setArrowShow(player);
        let mjArray = this.player["robot"+player].mahjong;
        this.cardSetSort(mjArray, player);
    },
    // 设置该谁出牌的箭头显示
    setArrowShow : function (player) {
        for(let i=1; i<=4; i++)
            this.centerBox.getChildByName("arrow"+i).active = false;
        this.centerBox.getChildByName("arrow"+(player+1)).active = true;
    },
    // 牌 排序 显示
    cardSetSort : function (cardArray, nodeId) {
        var self = this;
        cardArray.sort();
        var mahjongNode = this["mahjongNode"+(nodeId+1)];
        for(let i=1; i<=14; i++)
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
            mahjongNode.setPosition(cc.p(-40*(num-1)/2, 205));
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

    // 选择牌
    downCardBtnClick : function (event, customEventData) {
        cc.log("this.whichDiscard = ", this.whichDiscard);
        cc.log("this.couldAnyDiscard = ", this.couldAnyDiscard);
        if (this.whichDiscard === 0 && this.couldAnyDiscard) {
            var isDoubleClick = this.isDoubleClick();
            var mahjong = this.mahjongNode1.getChildByName("mahjong"+customEventData);
            var theSameKind = false;
            var mj = this.player.robot0.mahjong[customEventData-1];
            var kind = mj.toString().substr(mj.toString().length-3, 1);
            var misArr = 0;
            if(this.chooseMissArray[0] == "tong")
                misArr = 1;
            if(this.chooseMissArray[0] == "tiao")
                misArr = 2;
            if(this.chooseMissArray[0] == "wan")
                misArr = 3;
            if (misArr == kind)
                theSameKind = true;
            var py = mahjong.getPositionY();
            var length = this.player.robot0.mahjong.length;
            if(isDoubleClick && theSameKind)
                this.discardFunc(1, customEventData);//出牌
            else {
                for(let i=1; i<=length; i++) {
                    var all = this.mahjongNode1.getChildByName("mahjong"+i);
                    all.setPosition(cc.p(all.getPositionX(), 0));
                }
                if(this.clickCardBtn === false) {
                    mahjong.setPosition(cc.p(mahjong.getPositionX(), mahjong.getPositionY()+10));            
                    this.clickCardBtn = true;
                } else {
                    if(py === 0){
                        mahjong.setPosition(cc.p(mahjong.getPositionX(), mahjong.getPositionY()+10));            
                        this.clickCardBtn = true;
                    } else {
                        mahjong.setPosition(cc.p(mahjong.getPositionX(), 0));
                        this.clickCardBtn = false;
                    }
                }
            }
        } else {
            cc.log("=== 未到你出牌的时间 ===");
        }
    },

    // 出牌
    discardFunc : function (mahjongNodeId, customEventData) {
        var robotArray = this.player["robot" + [mahjongNodeId-1]];
        var cardId = robotArray.mahjong[customEventData-1];
        var mahjongNode = this["mahjongNode" + mahjongNodeId];
        var mahjong = mahjongNode.getChildByName("mahjong"+customEventData);
        var newMahjong = cc.instantiate(mahjong);
        newMahjong.setScale(0.8, 0.8);
        robotArray.mahjong.splice(customEventData-1, 1);
        var discardArrayI = this.discardArray[mahjongNodeId-1];
        discardArrayI[discardArrayI.length] = cardId;
        var discardNode = this.discardNode.getChildByName("discardNode"+mahjongNodeId);
        discardNode.addChild(newMahjong);
        if(mahjongNodeId === 1) {
            mahjong.setPosition(mahjong.getPositionX(), mahjong.getPositionY()-10);
            this.cardSetSort(robotArray.mahjong, 0);
            if(discardArrayI.length<=12)
                newMahjong.setPosition(30*(discardArrayI.length+1)+40, 0);
            else
                newMahjong.setPosition(30*(discardArrayI.length-11)+40, newMahjong.getContentSize().height-20);
            this.whichDiscard = this.whichDiscard + 1;
        } else if (mahjongNodeId === 2) {
            this.cardSetSort(robotArray.mahjong, 1);
            if(discardArrayI.length<=12)
                newMahjong.setPosition(20, 80-24*(discardArrayI.length+1));
            else
                newMahjong.setPosition(newMahjong.getContentSize().height+22, 80-24*(discardArrayI.length-11));
            this.whichDiscard = this.whichDiscard + 1;
        } else if (mahjongNodeId === 3) {
            this.cardSetSort(robotArray.mahjong, 2);
            if(discardArrayI.length<=12)
                newMahjong.setPosition(30*(discardArrayI.length+1)+40, 0);
            else
                newMahjong.setPosition(30*(discardArrayI.length-11)+40, 15-newMahjong.getContentSize().height);
            this.whichDiscard = this.whichDiscard + 1;
        } else {
            this.cardSetSort(robotArray.mahjong, 3);
            if(discardArrayI.length<=12)
                newMahjong.setPosition(20, 80-24*(discardArrayI.length+1));
            else
                newMahjong.setPosition(20-newMahjong.getContentSize().height, 80-24*(discardArrayI.length-11));
            this.whichDiscard = 0;
        }
        this.couldAnyDiscard = false;
        eventCenter.dispatch("discardListener", this.whichDiscard);
        this.mahjongSetPositon(mahjongNode, robotArray.mahjong.length);
    },
    // 判断是否连击两下牌
    isDoubleClick : function () {
        var timer = (new Date()).getTime();
        this.time[this.time.length] = timer;
        if (this.time.length > 2) {
            this.time[0] = this.time[1];
            this.time[1] = this.time[2];
            this.time.splice(2, 1);
        }
        if (this.time[1] - this.time[0] < 300)
            return true
        else
            return false
    },
    // 点击继续游戏
    goonBtnClick : function () {
        this.couldAnyDiscard = true;
        cc.log(this.player);
        cc.log("=== this.whichDiscard:", this.whichDiscard);
        this.getNewCard(this.whichDiscard, this.player["robot"+this.whichDiscard].mahjong.length);
        eventCenter.dispatch("discardListener", this.whichDiscard);
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

