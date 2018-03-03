//此组件挂载于SceneManager。用于储存各种数据，以及组件，便于取用与管理
var Global = require('Global');
var globalConstant = require('Constant');
cc.Class({
    extends: cc.Component,

    properties: {
        
        //玩家的金币数量
        coin: 0,
        
        //玩家的灵魂(类似粉尘)数量
        soul: 0,

        //玩家可以打开的卡牌包数量
        bags: 0,
        
        
        //生物卡片预览用的预制
        miniCreaturePrefab: cc.Prefab,
        
        //魔法卡片预览用的预制
        miniMagicPrefab: cc.Prefab,
        
        //玩家现在拥有的卡
        //myCCards: [cc.Integer],
        //
        //myMCards:[cc.Integer],
    
    
        deckBuildPrefab: cc.Prefab,

        //一个卡组的数据
        //totalDeckData: [Global.totalDeckData.type],
        //玩家当前组的卡组的组成
        myCardDeck:{
            default:[],
            type: cc.Integer,
        },
        //myMDeck:{
        //    default:[],
        //    type: cc.Integer,
        //},
        //myCDeck:{
        //    default:[],
        //    type: cc.Integer,
        //},
        
        
        showMagicPrefab:cc.Prefab,
        
        showCreaturePrefab:cc.Prefab,

        //筛选类型，三种，分别是 正营，稀有度，法力消耗
        filterType:{
            default: [],
            type: cc.Integer,
        },
        
        maxDeckNum:0,

        cardList:cc.Node,

    },
    /**
     * @主要功能 选择筛选类型
     * @author
     * @Date 2018/2/2
     * @parameters
     * @returns
     */
    filterTypeSelect:function(event, customEventData) {
        this.filterType[customEventData[0] - '0'] = customEventData[1] - '0';
        this.cardListScript.renewShowCardGroup();
        cc.log(this.filterType);
    },
    // use this for initialization
    onLoad: function () {
        var self = this;
        //var deckDatas = Global.deckData;
        //deckDatas.magicDeck = [1,2,3];
        //此处用于初始化全部的全局变量
        Global.mainStart = true;
        Global.bagNum = [0,0,0,0];
        Global.storyEnable = [false ,false ,false ,false];

        this.cardListScript = this.cardList.getComponent('CardList');
        this.cardListScript.mainScript = this;
        //动态加载牌库资源
        setTimeout(function(){
            self.cardListScript.initPrefab();
        },1500);


        setTimeout(function(){
            self.initUserData();
        },500);


        for(var i = 0;i < 100;i++)
            Global.userCard[i] = 0;

    },

    /**
     * @主要功能 初始化用户数据；包括用户的卡组信息，持有牌信息
     * @author C14
     * @Date 2018/2/27
     * @parameters
     * @returns
     */

    initUserData:function(){
        cc.loader.loadResDir("CardTextures/",cc.SpriteFrame, function (err,spriteFrames) {
            if(err){
                cc.error("失败了%s","CardData.json");
                return;
            }
            for(var i = 0;i < spriteFrames.length;i++) {
                cc.log(parseInt(spriteFrames[i].name));
                Global.cardSpriteFrames[parseInt(spriteFrames[i].name)] = spriteFrames[i];
            }
            //for(i = 0;i < 100;i++) {
            //    Global.cardSpriteFrames[i] = Global.cardSpriteFrames[i];
            //}
            cc.log(spriteFrames);
            //cc.loader.releaseRes("CardTextures/", cc.SpriteFrame);
        });
        $.ajax({
            url: "/areadly/getUserDeck",
            type: "GET",
            dataType: "json",
            data: {"token":Global.token},
            success: function(rs){
                if(rs.status === "200") {
                    cc.log("卡组数据获取成功");

                    for(var i = 0;i < rs.userDeckList.length;i++){
                        var deckDatas = {
                            name:rs.userDeckList[i].deck_name,
                            sort:0,
                            deckId:rs.userDeckList[i].id,
                            deck:{
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
                            usable:false
                        };
                        Global.totalDeckData.push(deckDatas);
                        Global.totalDeckData[i].deck = [];
                        for(var n = 0; n < 100; n++)Global.totalDeckData[i].deck[n] = 0;
                        Global.totalDeckData[i].sort = rs.userDeckList[i].deck_sort;
                    }

                    for(var j = 0;j < Global.totalDeckData.length;j++) {
                        $.ajax({
                            url: "/areadly/getUserDeckCard",
                            type: "GET",
                            dataType: "json",
                            data: {"token": Global.token, "deckId":Global.totalDeckData[j].deckId},
                            success: function (rs) {
                                if (rs.status === "200") {
                                    cc.log("用户卡组卡牌数据获取成功");
                                    var num = 0;
                                    for (var n = 0; n < rs.userDeckCardList.length; n++) {
                                        for(var j = 0;j < Global.totalDeckData.length;j++) {
                                            if(Global.totalDeckData[j].deckId === rs.userDeckCardList[n].deck_id)
                                                Global.totalDeckData[j].deck[rs.userDeckCardList[n].card_id]++;
                                        }
                                    }

                                } else {
                                    cc.log("用户卡组卡牌数据获取失败");
                                }
                            },
                            error: function () {
                                cc.log("用户卡组卡牌数据获取错误");
                            }
                        });
                    }

                }else{
                    cc.log("卡组数据获取失败");
                }
            },
            error: function(){
                cc.log("卡组数据获取错误");
            }
        });
        $.ajax({
            url: "/areadly/getUserCardInfo",
            type: "GET",
            dataType: "json",
            data: {"token":Global.token},
            success: function(rs){
                if(rs.status === "200") {
                    cc.log("用户卡牌数据获取成功");
                    for(i = 0;i < 100;i++)Global.userCard[i] = 0;
                    for(var i = 0;i < rs.userCardList.length;i++){
                        Global.userCard[rs.userCardList[i].card_id] ++;
                    }

                }else{
                    cc.log("用户卡牌数据获取失败");
                }
            },
            error: function(){
                cc.log("用户卡牌数据获取错误");
            }
        });
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
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
