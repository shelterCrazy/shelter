//var SmallMap = require('SmallMap');
var globalConstant = require("Constant");
var Global = require("Global");
var CardData = require("CardData");
var BattleData = require("BattleData");

/**
 * @主要功能:  游戏流程控制器
 * 主要功能是负责单机联机的确认
 * 加载场景的效果
 * 然后加载入场的效果动画，初始化用户卡牌，卡组，抽卡
 * 初始化手牌
 * 游戏开始
 * 游戏结束，结算流程，数据保存
 * 支持debug功能，快速略过前面的部分步骤
 * @type {Function}
 */
cc.Class({
    extends: cc.Component,

    properties: {
        debug:false,
        //原始的卡牌预制
        originMagicCardPrefab:cc.Prefab,
        originCreatureCardPrefab:cc.Prefab,
        //小地图节点
        mapLayer: cc.Node,

        mainGameNode:cc.Node,

        playerNum:0,
        //摄像机节点
        cameraLayer:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:
//    module.exports = {
//    //玩家人数 为1是单人模式
//    playerNum:0,
//    //玩家数据组，包括队伍，卡组构成，英雄Id
//    playerData:[
//        {
//
//        }
//    ],
//    playerDeck:[],
//    //玩家的队伍号
//    playerTeam:0,
//    //房间号
//    room:"",
//    //场景名称
//    sceneName:""
//
//};
     init:function(){
         //主管理器脚本
         var mainGameScript = this.mainGameNode.getComponent("MainGameManager");
         //获取摄像头的脚本
         var cameraScript = this.cameraLayer.getComponent("CameraControl");
         //如果是调试模式的话，那么需要重新初始化所有的卡牌
         //否则由于之前已经完成了初始化，不用再次初始化了
         if(this.debug){
             this.debugBattleScene();
             this.initCardData();
         }
        //大于等于2，多人模式
         if(BattleData.playerNum >= 2){
             //多人模式需要运行对战前的动画
             //首先加载双方英雄
             //镜头首先移动到敌方的位置，显示对方的一些信息，立绘
             //使active为true，并且显示出当前的法力水晶在内的各种UI
             //发牌
             //移动镜头返回

             if(Global.mainStart === false){
                 //从此JS文件的输入数据中得到玩家人数
                 BattleData.playerNum = this.playerNum;
             }
             //通过主节点创建英雄
             mainGameScript.heroCreate(0,-1);
             mainGameScript.heroCreate(0,1);

             ////获取小地图脚本
             var mapScript = this.mapLayer.getComponent("SmallMap");
             //英雄标记中添加两个英雄节点（方便坐标获取）
             mainGameScript.heros[0].getComponent("Unit")._mapSign =
                 mapScript.fnCreateHeroSign(mainGameScript.heros[0]);
             mainGameScript.heros[1].getComponent("Unit")._mapSign =
                 mapScript.fnCreateHeroSign(mainGameScript.heros[1]);
             //摄像头脚本初始化
             cameraScript.init();
             //摄像头的目标设置为双方的英雄
             cameraScript.targets[0] = mainGameScript.heros[0];
             cameraScript.target = cameraScript.targets[0];
             cameraScript.targets[1] = mainGameScript.heros[1];
             //瞬移到对方英雄的位置
             cameraScript.teleport(null, 1);

            //开启跟随标记，返回我方英雄所在的位置
             cameraScript.followFlag = true;
             cameraScript.followTargetNum = 0;
             //选取一个追踪的目标
             //cameraScript.takeFollowTarget(this.mainGameScript.viewHero[1]);
         }else{
             //单人

         }

     },



    /**
     * @主要功能 传递对手的数据，之后注入双方的数据，加载场景，进入游戏
     * 用于DEBUG
     * @author C14
     * @Date 2019/3/3
     * @parameters
     * @returns
     */
    debugBattleScene:function(){
        //如果不是从主菜单开始的
        if(Global.mainStart === false){
            //从此JS文件的输入数据中得到玩家人数
            BattleData.playerNum = 2;
        }
        //玩家所在的队伍等于之前定义的全局中的队伍
        BattleData.playerTeam = Global.nowTeam;
        //房间也是先前获取了的
        //BattleData.room = Global.room;
        //场景名称计算，双方随机数之和乘以总场景个数，加1
        BattleData.sceneName = "Scene_1";
        //循环，判断玩家现在使用的卡组
        //for(var i in Global.userDeckCardData){
        //    if(Global.userDeckCardData[i][0].deck_id === Global.deckUsage){
        //        //通过splice复制玩家的卡组
        //        BattleData.playerDeck = Global.userDeckCardData[i].splice(0);
        //        break;
        //    }
        //}
        //注入双方的的数据
        var playerData = {
            "team":Global.nowTeam,
            "name":Global.playerName,
            "level":Global.playerLevel,
            "heroId":Global.heroNum
        };
        BattleData.playerData.push(playerData);
        var enemyData = {
            "team":- Global.nowTeam,
            "name":Global.playerName,
            "level":Global.playerLevel,
            "heroId":Global.heroNum
        };
        BattleData.playerData.push(enemyData);
    },

    initCardData:function(){
        var self = this;
        /**
         * @主要功能 直接利用CardData的文档来进行初始化
         */
        var results = CardData;
        for(var i = 0;i < results.cardData.length;i++) {
            if(results.cardData[i].card_type === 0){
                var newNode = cc.instantiate(self.originMagicCardPrefab);
                var cardDetailScript = newNode.getComponent("MagicCard");

                cardDetailScript.magicType = results.cardData[i].releaseType;
                cardDetailScript.cardId = results.cardData[i].id;
                cardDetailScript.isBranch = (results.cardData[i].branch === 1);
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
    },
    //start () {
    //
    //},

    // update (dt) {},
});
