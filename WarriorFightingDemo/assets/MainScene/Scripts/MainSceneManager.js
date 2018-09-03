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

    // use this for initialization
    onLoad: function () {
        var self = this;
        //此处用于初始化全部的全局变量
        Global.mainStart = true;
        Global.bagNum = [0,0,0,0];
        Global.storyEnable = [false ,false ,false ,false];


        this.node.on("logSuccess",function(){
            NetworkModule.getGlobal(Global);
            NetworkModule.init();
            //this.cardListScript = this.cardList.getComponent('CardList');
            //this.cardListScript.mainScript = this;

            //动态加载牌库资源
            //self.cardListScript.initPrefab();

            setTimeout(function(){
                self.initUserData(function(flag){

                });
            },1000);

            for(var i = 0;i < 10;i++)
                cc.log("随机数:" + Math.seededRandom(0,1));

            for(i = 0;i < 100;i++)
                Global.userCard[i] = 0;
        }.bind(this));

    },
    match:function(){
        NetworkModule.match();
    },
    /**
     * @主要功能 初始化用户数据；包括用户的卡组信息，持有牌信息
     * @author C14
     * @Date 2018/2/27
     * @parameters
     * @returns
     */
    initUserData:function(fn){
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
        cc.loader.loadResDir("CardTextures/",cc.SpriteFrame, function (err,spriteFrames) {
            if(err){
                //cc.error("失败了%s","CardData.json");
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
                    //将卡组数据放入
                    Global.userDeckData = rs.userDeckList;
                    //Global.totalDeckData[i].deck = [];
                    //for(var n = 0; n < 300; n++)Global.totalDeckData[i].deck[n] = 0;
                    //Global.totalDeckData[i].sort = rs.userDeckList[i].deck_sort;
                    ////cc.log(rs.userDeckList[i].id);
                    //}

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
                                } else {
                                    cc.log("用户卡组卡牌数据获取失败");
                                }
                            },
                            error: function () {
                                cc.log("用户卡组卡牌数据获取错误");
                                fn(false);
                            }
                        });
                    }
                    fn(true);
                }else{
                    cc.log("卡组数据获取失败");
                }
            },
            error: function(){
                cc.log("卡组数据获取错误");
                fn(false);
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
                    Global.userCard = rs.userCardList;
                    //按照法力水晶消耗排序
                    Global.userCard.sort(compare);
                    cc.log(Global.userCard);
                }else{
                    cc.log("用户卡牌数据获取失败");
                }
            },
            error: function(){
                cc.log("用户卡牌数据获取错误");
                fn(false);
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
