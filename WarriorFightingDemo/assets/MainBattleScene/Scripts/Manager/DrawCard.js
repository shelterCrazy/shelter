//获取全局变量脚本
var Global = require('Global');
var globalConstant = require('Constant');
var globalCardData = require("CardData2");

/**
 * @主要功能 加载牌库，实现抽牌
 * @author 天际/老黄/C14
 * @Date 2017/8/12
 */
cc.Class({
    extends: cc.Component,
    
    properties: {
        originMagicCardPrefab:cc.Prefab,
        originCreatureCardPrefab:cc.Prefab,
        //全体魔法生物牌的预制
        magicCardPrefab: {
            default: [],
            type: [cc.Prefab]
        },
        biologyCardPrefab: {
            default:[],
            type: cc.Prefab
        },
        myCardDeck:{
            default:[],
            type: cc.Prefab,
        },
        //魔法牌预制组，按照卡组的数据进行初始化
        myMDeck:{
            default:[],
            type: cc.Prefab,
        },
        //生物牌预制组，按照卡组的数据进行初始化
        myCDeck:{
            default:[],
            type: cc.Prefab,
        },
        //总牌库，节点形式存放
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

        mainGameManagerNode:cc.Node,
        
        roll: cc.Node,

        cameraControlNode:cc.Node,
    },
    
    // use this for initialization
    onLoad: function () {
        var i = 0,j = 0;
        var self = this;
        var url = "Data/CardData2";
        this.cardTypeFlag = cc.randomMinus1To1();

        this.mainGameManagerScript = this.mainGameManagerNode.getComponent("MainGameManager");
        this.heroNode = this.mainGameManagerScript.heros[0];
        this.heroScript = this.heroNode.getComponent('Hero');


        if(true){//Global.mainStart === false) {

            for(i = 0;i < 400;i++) {
                Global.cardPrefab[i] = null;
                //Global.userCard[i] = 0;
            }

            //cc.loader.loadRes(url, function (err, results) {
            //    if(err){
            //        cc.error("失败了!!%s","CardData.json");
            //        cc.log(err);
            //        return;
            //    }
            /**
             * @主要功能 直接利用CardData的文档来进行初始化
             */
            var results = globalCardData;
                for(i = 0;i < results.cardData.length;i++) {
                    if(results.cardData[i].card_type === 0){
                        var newNode = cc.instantiate(self.originMagicCardPrefab);
                        var cardDetailScript = newNode.getComponent("MagicCard");

                        cardDetailScript.magicType = results.cardData[i].releaseType;
                        cardDetailScript.cardId = results.cardData[i].id;
                        if(results.cardData[i].branch === 1){
                            cardDetailScript.isBranch = true;
                        }else{
                            cardDetailScript.isBranch = false;
                        }
                        cardDetailScript.branchNum = results.cardData[i].branch_num;
                        cardDetailScript.cardType = 0;
                    }else{
                        newNode = cc.instantiate(self.originCreatureCardPrefab);
                        cardDetailScript = newNode.getComponent("CreepCard");

                        cardDetailScript.magicType = results.cardData[i].releaseType;
                        cardDetailScript.cardId = results.cardData[i].id;
                        cardDetailScript.cardType = 1;
                        //cardDetailScript.race = results.cardData[i].race;
                        cardDetailScript.attack = results.cardData[i].attack;
                        cardDetailScript.health = results.cardData[i].health;
                        cardDetailScript.speed = results.cardData[i].speed;
                    }
                    cardDetailScript.usableType = results.cardData[i].usableType;


                    var loadScript = newNode.getComponent("Card");
                    //loadScript.loadSpriteFrame(Global.cardSpriteFrames[results.cardData[i].id]);
                    loadScript.manaConsume = results.cardData[i].mana;
                    loadScript.rarity = results.cardData[i].rarity;
                    loadScript.cardId = results.cardData[i].id;
                    loadScript.cName = results.cardData[i].card_name;
                    loadScript.describe = results.cardData[i].memo;
                    //loadScript.storyDescribe = results.cardData[i].detail[0];
                    loadScript.cardType = results.cardData[i].card_type;
                    Global.cardPrefab[results.cardData[i].id] = cc.instantiate(newNode);
                }
            //});

            //初始化一个卡组数据
            var deckDatas = {
                name: "我的卡组",
                num: 0,
                deck: {
                    default: [],
                    type: cc.Integer
                },
                //卡组的类型
                type: {
                    type: cc.Enum({
                        //幻想
                        //科学
                        Science: 0,
                        Fantasy: 1,
                        //混沌
                        Chaos: 2
                    }),
                    default: 0
                },
                usable: true
            };
            //将卡组数据推入到全局的总卡组数据中
            Global.totalDeckData.push(deckDatas);

            //Global.totalDeckData[Global.deckUsage].creatureDeck = [10,10,10,10,10,10,0];
            //卡组使用第0号卡组
            Global.deckUsage = 0;
            //初始化卡组的卡片构成
            Global.totalDeckData[Global.deckUsage].deck = [0,3,0,0,3,0,0,3];
            Global.totalDeckData[Global.deckUsage].deck[303] = 3;
            Global.totalDeckData[Global.deckUsage].deck[4] = 3;//六芒星召唤阵太变态
            Global.totalDeckData[Global.deckUsage].deck[301] = 2;
            Global.totalDeckData[Global.deckUsage].deck[110] = 3;
            Global.totalDeckData[Global.deckUsage].deck[109] = 0;
            Global.totalDeckData[Global.deckUsage].deck[105] = 5;
            Global.totalDeckData[Global.deckUsage].deck[103] = 3;
            Global.totalDeckData[Global.deckUsage].deck[104] = 30;
            Global.totalDeckData[Global.deckUsage].deck[102] = 3;
            Global.totalDeckData[Global.deckUsage].deck[302] = 3;
            Global.totalDeckData[Global.deckUsage].deck[307] = 3;
            Global.totalDeckData[Global.deckUsage].deck[108] = 1;
            Global.totalDeckData[Global.deckUsage].deck[107] = 3;
            Global.totalDeckData[Global.deckUsage].deck[311] = 3;
            Global.totalDeckData[Global.deckUsage].deck[309] = 3;
            Global.totalDeckData[Global.deckUsage].deck[308] = 3;
        }
        setTimeout(function(){
            //将预制按照数量放入卡组部分
            for(i = 0 ;i < Global.totalDeckData[Global.deckUsage].deck.length ; i++){
                if(Global.totalDeckData[Global.deckUsage].deck[i] !== 0){
                    for(j = 0 ;j < Global.totalDeckData[Global.deckUsage].deck[i];j++) {
                        self.myCardDeck.push(Global.cardPrefab[i]);
                    }
                }
            }
            //先发6张牌再说
            for(i = 0 ;i < 6 ; i++){
                self.showNewCard();
            }
            //4秒补充一张牌
            self.delayTime(4);
        },100);

    },
    /**
     * @主要功能 按照time运行抽牌函数
     * @author 天际
     * @Date 2017/8/12
     * @parameters
     * @returns
     */
    delayTime: function(time){
        this.schedule(this.showNewCard,time);
    },

    /**
     * @主要功能 发一张牌
     * @author 天际
     * @Date 2017/8/12
     * @parameters
     * @returns
     */
    showNewCard: function() {
        //如果手牌数量小于9张，那么发一张牌
        if(this.heroScript.handCard.length < globalConstant.handMaxNum){
            this.creatCardType();
        }
    },

    /**
     * @主要功能 创建随机数，从牌库取一张牌（预制）传递给
     *            creatNewCard()
     * @author 天际/老黄/C14
     * @Date 2018/8/13
     * @parameters
     * @returns
     */
    creatCardType: function(){
        var rand = 0;

        //如果牌库没牌了
        if(this.myCardDeck.length === 0)return;

        //创造从0号到总卡组牌数的随机数
        rand = Math.floor(Math.random() * (this.myCardDeck.length - 1));

        //如果手牌没满
        if(this.heroScript.handCard.length < globalConstant.handMaxNum) {
            //按照预制为手牌添加生物牌
            this.creatNewCard(this.myCardDeck[rand]);
        }
        //删除被抽出的那张牌
        this.myCardDeck.splice(rand, 1);
    },
    /**
     * @主要功能 丢弃一张牌
     * @author C14
     * @Date 2018/1/16
     * @parameters
     * @returns
     */
    throwCard:function() {
        if(this.heroScript.handCard.length > 0){
            var rand = Math.floor(Math.random() * (this.heroScript.handCard.length - 1));
            for(var i = 0;i < this.node.children.length;i++){
                if(this.heroScript.handCard[rand] === this.node.children[i]){
                    this.node.children[i].removeFromParent(true);
                    break;
                }
            }
            this.heroScript.handCard.splice(rand,1);
        }
    },
    getCertainCard:function(cardId) {
        if(this.heroScript.handCard.length < globalConstant.handMaxNum) {
            this.creatNewCard(this.myCardDeck[cardId]);
        }
    },
    /**
     * @主要功能 给予预制，将其添加到手牌中
     * @author 天际/C14
     * @Date 2017/8/12
     * @parameters cardObject 卡片预制
     * @returns
     */
    creatNewCard: function(cardObject){
        //新卡为该预制的节点化
        var newCard = cc.instantiate(cardObject);
        //script作为初始化使用的卡牌的脚本
        var script = newCard.getComponent('Card');
        //script2作为获取卡片细节的脚本，细节即牌的大类型
        var script2 = null;
        script.roll = this.roll;
        script.cameraControl = this.cameraControlNode;
        script.mainGameManager = this.mainGameManagerNode;
        script.hero = this.heroNode;
        script.team = Global.nowTeam;
        newCard.y = 0;


        if(script.cardType === 0){
            script2 = newCard.getComponent('MagicCard');
        }else{
            script2 = newCard.getComponent('CreepCard');
        }
        //注入英雄节点
        script2.hero = this.heroNode;
        //注入场景滚动节点
        script2.backRoll = this.roll;

        // ------------------------------------------------------------------------------ //
        //将此抽牌脚本给予该牌
        script.drawCardScript = this;
        //script.cardIndex = this.cardGroup.length;
        // ------------------------------------------------------------------------------ //
        //英雄的手牌节点，加入此新牌
        this.heroScript.handCard.push(newCard);

        //此节点加入该新牌作为子节点
        //this.node.addChild(newCard);
        this.node.addChild(newCard, script.cardIndex);
    },

    /**
     * @主要功能 删除牌，卡牌使用后调用此函数
     * @author 天际
     * @Date 2017/8/12
     * @parameters
     * @returns
     */
    deleteCard: function (card) {
        for(var index = 0;index < this.heroScript.handCard.length;index++){
            if(card === this.heroScript.handCard[index]){
                this.heroScript.handCard.splice(index, 1);
            }
        }
        card.removeFromParent(true);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
