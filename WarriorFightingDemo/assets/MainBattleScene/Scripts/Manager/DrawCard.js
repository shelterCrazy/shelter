var Global = require('Global');

cc.Class({
    extends: cc.Component,
    
    properties: {
        magicCardPrefab: {
            default: [],
            type: [cc.Prefab]
        },
        biologyCardPrefab: {
            default:[],
            type: cc.Prefab
        },
        cardGroup: {
            default: [],
            type: cc.Node,
        },

        myMDeck:{
            default:[],
            type: cc.Prefab,
        },
        myCDeck:{
            default:[],
            type: cc.Prefab,
        },

        Deck: {
            default: [],
            type: cc.Node,
        },
        //英雄的节点
        heroNode: cc.Node,
        
        //指定卡片生成的X坐标    
        positionX: 0,
        //指定卡片生成的类型  
        cardTypeFlag: 0,
        //handCardMaxNum: 0,
        drawCardFlag: 0,
        
        roll: cc.Node,
    },
    
    // use this for initialization
    onLoad: function () {
        var i = 0,j = 0;
        this.returnPostion = 0;
        this.cardTypeFlag = cc.randomMinus1To1();
        this.heroScript = this.heroNode.getComponent('Player');

        var deckDatas = {
            name:"我的卡组",
            num:0,
            magicDeck:{
                default: [],
                type: cc.Integer,
            },
            creatureDeck:{
                default:[],
                type: cc.Integer,
            },
            //卡组的类型
            type: {
                type: cc.Enum({
                    //幻想
                    //科学
                    Science: 0,
                    Fantasy: 1,
                    //混沌
                    Chaos: 2,
                }),
                default: 0,
            },
            usable:true,
        }
        Global.totalDeckData.push(deckDatas);
        Global.deckUsage = 0;
        Global.totalDeckData[Global.deckUsage].magicDeck = [30,30];
        Global.totalDeckData[Global.deckUsage].creatureDeck = [30,30];
        //this.cardListScript = this.cardList.getComponent('CardList');


        for(i = 0 ;i < Global.totalDeckData[Global.deckUsage].magicDeck.length ; i++){
            if(Global.totalDeckData[Global.deckUsage].magicDeck[i] !== 0){
                for(j = 0 ;j < Global.totalDeckData[Global.deckUsage].magicDeck[i];j++) {
                    this.myMDeck.push(this.magicCardPrefab[i]);
                }
            }
        }
        for(i = 0 ;i < Global.totalDeckData[Global.deckUsage].creatureDeck.length ; i++){
            if(Global.totalDeckData[Global.deckUsage].creatureDeck[i] !== 0){
                for(j = 0 ;j < Global.totalDeckData[Global.deckUsage].creatureDeck[i];j++) {
                    this.myCDeck.push(this.biologyCardPrefab[i]);
                }
            }
        }
        //先发6张牌再说
        for(i = 0 ;i < 6 ; i++){
            this.showNewCard();
        }
        //4秒补充一张牌
        this.delayTime(4);
    },

    showNewCard: function(){
        cc.log("现在的手牌个数:"+this.heroScript.handCard.length);
        if(this.heroScript.handCard.length < 9){
            this.creatCardType();
        }
    },
    creatCardType: function(){
        //if(this.cardTypeFlag < -0.5){
        //    this.creatNewCard(this.magicCardPrefab[0]);
        //}else if(this.cardTypeFlag < 0){
        //    this.creatNewCard(this.biologyCardPrefab[1]);
        //}else if(this.cardTypeFlag < 0.5){
        //    this.creatNewCard(this.magicCardPrefab[1]);
        //}else{
        //    this.creatNewCard(this.biologyCardPrefab[0]);
        //}
        var rand = 0;
        if(this.myCDeck.length + this.myMDeck.length === 0)return;

        rand = Math.floor(Math.random() * (this.myCDeck.length + this.myMDeck.length - 1));

        if(rand >= this.myMDeck.length) {
            if(this.heroScript.handCard.length < 9) {
                this.creatNewCard(this.myCDeck[rand - this.myMDeck.length]);
            }
            this.myCDeck.splice(rand - this.myMDeck.length, 1);
        }else{
            if(this.heroScript.handCard.length < 9) {
                this.creatNewCard(this.myMDeck[rand]);
            }
            this.myMDeck.splice(rand, 1);
        }
    },
    creatNewCard: function(cardObject){
        var newCard = cc.instantiate(cardObject);
        //script作为初始化使用的卡牌的脚本
        var script = newCard.getComponent('Card');
        script.roll = this.roll;
        script.hero = this.heroNode;
        script.team = this.heroScript.team;
        newCard.y = 0;

        var script2 = null;
        if(script.cardType === 0){
            script2 = newCard.getComponent('MagicCard');
        }else{
            script2 = newCard.getComponent('CreepCard');
        }
        script2.hero = this.heroNode;
        script2.backRoll = this.roll;

        //newCard.tag = this.positionX;
        // ------------------------------------------------------------------------------ //
        script.drawCardScript = this;
        //script.cardIndex = this.cardGroup.length;
        // ------------------------------------------------------------------------------ //
        this.heroScript.handCard.push(newCard);

        //this.positionX++;
        //this.cardTypeFlag = cc.randomMinus1To1();
        this.node.addChild(newCard, script.cardIndex);
        // this.cardShape(newCard);
        // this.cardUse(newCard);
    },

    // 删除牌
    deleteCard: function (card) {
        for(var index = 0;index < this.heroScript.handCard.length;index++){
            if(card === this.heroScript.handCard[index]){
                this.heroScript.handCard.splice(index, 1);
            }
        }
        cc.log(this.heroScript.handCard.length);
        card.removeFromParent(true);
    },
    

    
    delayTime: function(time){
            this.schedule(this.showNewCard,time);
    },
    
    //cardShape: function(cardObject){
    //    cardObject.on(cc.Node.EventType.MOUSE_ENTER,function () {
    //            cardObject.runAction(cc.speed(cc.scaleBy(1.2,1.2), 7));
    //    }, this);
    //    cardObject.on(cc.Node.EventType.MOUSE_LEAVE,function(){
    //        cardObject.stopAllActions();
    //        cardObject.runAction(cc.speed(cc.scaleTo(1,1),7));
    //    },this);
    //},
    
    //cardUse: function(cardObject){
    //        cardObject.on(cc.Node.EventType.MOUSE_DOWN, function () {
    //            //cardObject.opacity = 90;
    //            cardObject.on(cc.Node.EventType.MOUSE_MOVE,cardMove,this);
    //        }, this);
    //        cardObject.on(cc.Node.EventType.MOUSE_UP,function(){
    //            //cardObject.opacity = 1000;
    //            cardObject.off(cc.Node.EventType.MOUSE_MOVE,cardMove,this);
    //
    //            if(cardObject.y >= 100){
    //                var script = cardObject.getComponent('Card');
    //                if(this.heroComponent.mana >= script.manaConsume
    //                   && script.getUseState() === true){
    //
    //                    this.heroComponent.mana -= script.manaConsume;
    //                    script.useCard();
    //                    this.cardGroup.splice(this.cardGroup.indexOf(cardObject),1);
    //                    this.fnRenewCard();
    //                    this.positionX--;
    //                    cardObject.removeFromParent();
    //                }else{
    //                    cardObject.x = 120*this.cardGroup.indexOf(cardObject);
    //                    cardObject.y = 0;
    //                }
    //
    //            }else{
    //                    cardObject.x = 120*this.cardGroup.indexOf(cardObject);
    //                    cardObject.y = 0;
    //                }
    //        },this);
    //        function cardMove(event) {
    //                cardObject.x += event.getDeltaX();
    //                cardObject.y += event.getDeltaY();
    //                if(cardObject.y >= 100){
    //                //cardObject.opacity = 1000;
    //            }
    //        }
    //},

////刷新卡牌的位置
//    fnRenewCard:function(){
//        var i = 0;
//        for(i = 0;i < this.cardGroup.length ; i++){
//            this.cardGroup[i].x = 120*i;
//        }
//    },

    changeCardToUsing: function (event) {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
