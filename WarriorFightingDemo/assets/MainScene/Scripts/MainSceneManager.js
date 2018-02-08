//此组件挂载于SceneManager。用于储存各种数据，以及组件，便于取用与管理
var Global = require('Global');
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
        myCCards: [cc.Integer],
        
        myMCards:[cc.Integer],
    
    
        deckBuildPrefab: cc.Prefab,

        //一个卡组的数据
        //totalDeckData: [Global.totalDeckData.type],
        //玩家现在在组的卡组的组成
        myMDeck:{
            default:[],
            type: cc.Integer,
        },
        myCDeck:{
            default:[],
            type: cc.Integer,
        },
        
        
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
        //var deckDatas = Global.deckData;
        //deckDatas.magicDeck = [1,2,3];
        //此处用于初始化全部的全局变量


        Global.bagNum = [0,0,0,0];
        Global.storyEnable = [false ,false ,false ,false];

        this.cardListScript = this.cardList.getComponent('CardList');
        this.cardListScript.mainScript = this;
        //动态加载牌库资源
        this.cardListScript.initPrefab();
        for(var i = 0 ;i < 9 ;i++) {
            var deckDatas = {
                name:"默认卡组",
                num:0,
                magicDeck:{
                    default: [],
                    type: cc.Integer
                },
                creatureDeck:{
                    default:[],
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
                usable:true
            };
            deckDatas.num = i;
            deckDatas.name = "卡组" + i;
            Global.totalDeckData.push(deckDatas);
            Global.totalDeckData[i].magicDeck = [];
            for(var n = 0; n < 100; n++)Global.totalDeckData[i].magicDeck[n] = 0;
            Global.totalDeckData[i].magicDeck[0] = 40;
            Global.totalDeckData[i].creatureDeck = [];
            for(n = 0; n < 100; n++)Global.totalDeckData[i].creatureDeck[n] = 0;
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
    battleScene: function(){
        Global.mainStart = true;
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
