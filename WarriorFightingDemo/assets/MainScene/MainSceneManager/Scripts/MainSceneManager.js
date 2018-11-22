//此组件挂载于SceneManager。用于储存各种数据，以及组件，便于取用与管理
var Global = require('Global');
var globalConstant = require('Constant');
var globalCardData = require("CardData");


cc.Class({
    extends: cc.Component,

    properties: {
        titlePic:cc.Node,

        blackNode:cc.Node,

        effectButton:cc.Node,

        deckBuildPrefab: cc.Prefab,

        //迷你卡牌的生物预制
        miniCreaturePrefab:cc.Prefab,
        //迷你卡牌的法术预制
        miniMagicPrefab:cc.Prefab,

        showCreaturePrefab:cc.Prefab,
        showMagicPrefab:cc.Prefab,

        originMagicCardPrefab:{
            type:cc.Prefab,
            default:null
        },
        originCreatureCardPrefab:{
            type:cc.Prefab,
            default:null
        },

        deckSelectManager:cc.Node,

        hero:cc.Node,

        //筛选类型，三种，分别是 正营，稀有度，法力消耗
        filterType:{
            default: [],
            type: cc.Integer,
        },
        
        maxDeckNum:0,

        cardList:cc.Node,

    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        //此处用于表示初始化是从主菜单进入的
        Global.mainStart = true;

        this.node.on("logSuccess",function(){

            NetworkModule.getGlobal(Global);
            NetworkModule.init();
            this.titlePic.runAction(cc.sequence(
                cc.delayTime(1),
                    cc.spawn(
                        cc.moveBy(3,0,400).easing(cc.easeQuadraticActionInOut()),
                        cc.fadeOut(2.5).easing(cc.easeSineIn())
                    )
                )
            );
            setTimeout(function(){
                this.effectButton.getComponent("EffectButton").come();
            }.bind(this),4000);

            cc.loader.loadResDir("CardTextures/",cc.SpriteFrame, function (err,spriteFrames) {
                if(err){
                    return;
                }
                for(var i = 0;i < spriteFrames.length;i++) {
                    cc.log(parseInt(spriteFrames[i].name));
                    Global.cardSpriteFrames[parseInt(spriteFrames[i].name)] = spriteFrames[i];
                }
                for(i = 0;i < 400;i++) {
                    Global.miniCardNode[i] = null;
                    Global.cardPrefab[i] = null;
                    Global.showCardNode[i] = null;
                }
                self.initPrefab();
                Global.userDeckCardData = [];
                this.getUserCardData(function(flag){
                    cc.log(flag);
                    if(flag === true) {
                        this.getUserDeckData(function(flag){
                            cc.log(flag);
                            if(flag === true){
                                this.deckSelectManager.getComponent("DeckSelectManager").deckInit();
                                Global.initUserData = true;
                            }
                        }.bind(this));
                    }
                }.bind(this));
            }.bind(this));
        }.bind(this));

        if(Global.loginFlag === true) {
            if (true) {
                this.titlePic.active = false;
                //this.hero.position = Global.playerPosition;
                this.effectButton.getComponent("EffectButton").come();
                this.deckSelectManager.getComponent("DeckSelectManager").deckInit();
            }
        }

    },
    match:function(){
        NetworkModule.match();
    },

    lockHero:function(lock){
        var component = this.hero.getComponent("hero-control");
        component.lockHero(lock);
    },
    /**
     * @主要功能 初始化用户卡组数据；持有牌信息
     * @author C14
     * @Date 2018/2/27
     * @parameters
     * @returns
     */
    getUserDeckData:function(fn){
        //按照卡组顺序来排列
        var compare2 = function (obj1, obj2) {
            var val1 = obj1.deck_sort;
            var val2 = obj2.deck_sort;
            if (val1 < val2) {
                return -1;
            } else if (val1 > val2) {
                return 1;
            } else {
                return 0;
            }
        };
        $.ajax({
            url: "/areadly/getUserDeck",
            type: "GET",
            dataType: "json",
            data: {"token":Global.token},
            success: function(rs){
                var deckNum = 0;
                if(rs.status === "200") {
                    cc.log("卡组数据获取成功");
                    //将卡组数据放入
                    Global.userDeckData = rs.userDeckList;
                    Global.userDeckData.sort(compare2);
                    cc.log(Global.userDeckData);
                    for(var j = 0;j < Global.userDeckData.length; j++) {
                        $.ajax({
                            url: "/areadly/getUserDeckCard",
                            type: "GET",
                            dataType: "json",
                            data: {"token": Global.token, "deckId":Global.userDeckData[j].id},
                            success: function (rs) {
                                if (rs.status === "200") {
                                    cc.log("用户卡组卡牌数据获取成功");
                                    Global.userDeckCardData.push(rs.userDeckCardList);
                                    deckNum ++;
                                } else {
                                    deckNum ++;
                                    cc.log("用户卡组卡牌数据获取失败");
                                }
                                if(deckNum >= Global.userDeckData.length){
                                    fn(true);
                                }
                            },
                            error: function () {
                                cc.log("用户卡组卡牌数据获取错误");
                                //fn(false);
                            }
                        });
                    }
                }else{
                    cc.log("卡组数据获取失败");
                }
            },
            error: function(){
                cc.log("卡组数据获取错误");
                //fn(false);
            }
        });

    },
    getUserCardData:function(fn){
        //按照card_id排序
        var compare = function (obj1, obj2) {
            var val1 = obj1.card_id;
            var val2 = obj2.card_id;
            if (val1 < val2) {
                return -1;
            } else if (val1 > val2) {
                return 1;
            } else {
                return 0;
            }
        };
        $.ajax({
            url: "/areadly/getUserCardInfo",
            type: "GET",
            dataType: "json",
            data: {"token":Global.token},
            success: function(rs){
                if(rs.status === "200") {
                    cc.log("用户卡牌数据获取成功");
                    Global.userCard = rs.userCardList;
                    //按照法力水晶消耗排序
                    Global.userCard.sort(compare);
                    cc.log(Global.userCard);
                    fn(true);
                }else{
                    cc.log("用户卡牌数据获取失败");
                    fn(false);
                }
            },
            error: function(){
                cc.log("用户卡牌数据获取错误");
                fn(false);
            }
        });
    },
    /**
     * @主要功能 动态加载牌库资源
     * @author
     * @Date 2018/2/7
     * @parameters
     * @returns
     */
    initPrefab:function(){
        var self = this;
        var results = globalCardData;
        var originNode,originShowCard;
        for(var i = 0;i < results.cardData.length;i++) {
            //如果是魔法牌的话
            if(results.cardData[i].card_type === 0){
                //获取原型魔法牌
                var newNode = cc.instantiate(self.originMagicCardPrefab);
                //获取迷你展示用法术预制
                originNode = cc.instantiate(self.miniMagicPrefab);
                //获取展示用法术预制
                originShowCard = cc.instantiate(self.showMagicPrefab);

                var cardDetailScript = newNode.getComponent("MagicCard");

                cardDetailScript.magicType = results.cardData[i].releaseType;
                cardDetailScript.cardId = results.cardData[i].id;
                cardDetailScript.cardType = 0;
            }else{
                //如果是生物牌的话
                //获取原型生物预制
                newNode = cc.instantiate(self.originCreatureCardPrefab);
                //获取迷你展示用生物预制
                originNode = cc.instantiate(self.miniCreaturePrefab);
                //获取展示用生物预制
                originShowCard = cc.instantiate(self.showCreaturePrefab);

                cardDetailScript = newNode.getComponent("CreepCard");

                cardDetailScript.magicType = results.cardData[i].releaseType;
                cardDetailScript.cardId = results.cardData[i].id;
                cardDetailScript.cardType = 1;
                cardDetailScript.race = results.cardData[i].race;
                cardDetailScript.attack = results.cardData[i].attack;
                cardDetailScript.health = results.cardData[i].health;
                cardDetailScript.speed = results.cardData[i].speed;
            }
            cardDetailScript.usableType = results.cardData[i].usableType;

            var loadScript = newNode.getComponent("Card");
            loadScript.loadSpriteFrame(Global.cardSpriteFrames[results.cardData[i].id]);
            loadScript.manaConsume = results.cardData[i].mana;
            loadScript.rarity = results.cardData[i].rarity;
            loadScript.cardId = results.cardData[i].id;
            loadScript.cName = results.cardData[i].card_name;
            loadScript.describe = results.cardData[i].memo;
            loadScript.storyDescribe = results.cardData[i].detail[0];
            loadScript.cardType = results.cardData[i].card_type;

            Global.miniCardNode[loadScript.cardId] = originNode;
            //Global.showCardNode[loadScript.cardId] = originShowCard;

            Global.cardPrefab[loadScript.cardId] = cc.instantiate(newNode);


            var script = originNode.getComponent("MiniCard");
            var script2 = originShowCard.getComponent("InfoBoard");

            script.manaConsume = loadScript.manaConsume;
            script.rarity = loadScript.rarity;
            script.cName = loadScript.cName;
            script.cardId = loadScript.cardId;
            script.cardType = loadScript.cardType;
            script.loadSpriteFrame(Global.cardSpriteFrames[results.cardData[i].id]);

            script2.manaConsume = loadScript.manaConsume;
            script2.rarity = loadScript.rarity;
            script2.cName = loadScript.cName;
            script2.describe = loadScript.describe;
            script2.storyDescribe = loadScript.storyDescribe;
            script2.cardId = loadScript.cardId;
            script2.cardType = loadScript.cardType;
            script2.loadSpriteFrame(Global.cardSpriteFrames[results.cardData[i].id]);
            //如果是生物牌则注入三个其他的量
            if(loadScript.cardType === 1) {
                script2.attack = cardDetailScript.attack;
                script2.health = cardDetailScript.health;
                script2.speed = cardDetailScript.speed;
                script2.race = cardDetailScript.race;
                //cardDetailScript.race;
            }
            Global.showCardNode[script2.cardId] = cc.instantiate(originShowCard);
        }
    },
    /**
     * @主要功能 开启PVP模式
     * @author C14
     * @Date 2018/2/3
     * @parameters
     * @returns
     */
    pvp:function(){
        this.battleScene();
    },
    /**
     * @主要功能 进入开包场景
     * @author C14
     * @Date 2018/2/25
     * @parameters
     * @returns
     */
    usePackageScene:function(){
        cc.director.loadScene('PackageUseScene');
    },

    battleScene: function(){
        cc.director.loadScene('game');
    },
    changeMyTeamA:function(){
        Global.nowTeam = -1;
    },
    changeMyTeamB:function(){
        Global.nowTeam = 1;
    },

    exitGame:function(){
        cc.director.end();
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
