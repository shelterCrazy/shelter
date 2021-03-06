﻿// Global.js, now the filename matters

module.exports = {

    userName:"kenan",
    password:"123456",
    token:18,
    //登录游戏成功的标志
    loginFlag:false,

    playerName:"",
    playerLevel:0,

    firstLogin:true,
    //离线游戏的标志
    offlinePlayFlag:false,
    room:"",
    //第一次进入游戏
    firstEnterGame:false,

    //角色选择界面//
    heroNum: -1,
    maxHeroNum: 3,
    //当前的游戏模式选择
    nowGameMode:-1,
    //当前选择的卡组序号
    nowDeckNum:-1,

    //玩家在主界面的坐标
    playerPosition:cc.Vec2,
    //玩家持有的金币
    money:10000,
    //灵魂碎片
    soul:12,
    //卡包的数量
    bagNum: {
        type:[cc.Integer],
        default:[0, 0, 0, 0]
    },
    //故事模式解锁情况
    storyEnable: {
        type:[cc.Boolean],
        default:[false, false, false, false]
    },
    //现在正在浏览的卡组
    deckView:0,
    //本次作战的队伍是
    nowTeam: - 1,

    online:false,

    //普通魔法卡生物牌的预制
    magicCardPrefab:[cc.Prefab],
    creatureCardPrefab:[cc.Prefab],
    cardPrefab:[cc.Prefab],

    miniCardNode:[cc.Node],

    showCardNode:[cc.Node],
    //用户持有的卡片 键值 + 数量
    userCard:[],
    //卡片的图片
    cardSpriteFrames:[],
    //是否联网获取用户卡牌数据
    initUserData:false,
    //网络需要发送的数据集
    //networkSendData:null,
    networkSendData2:[],
    //卡组的类型
    type: {
        type: cc.Enum({
            //科学
            Science: 0,
            //幻想
            Fantasy: 1,
            //混沌
            Chaos: 2
        }),
        default: 0
    },

    //所有的卡组数据在此
    userDeckData:[],
    //所有的卡组内部的卡牌数据在此
    userDeckCardData:[],

    userPackageData:[],
    //测试用卡组数据
    totalDeckData:[],

    //出战选择的卡组编号
    deckUsage: 0,
    //是否是从主界面触发的进入游戏
    mainStart:false,

    //以下是用户设置部分
    //主音量
    mainVolume:0.2,
    //以下是用户设置的主音量
    mainEffectVolume:0,
    //以下是用户设置部分
    mainMusicVolume:1,
    cameraPosition:cc.Vec2,

    j:0,
};
//{
//deckData:{
//    name:"我的卡组",
//    num:0,
//    magicDeck:{
//        default: [],
//        type: cc.Integer
//    },
//    creatureDeck:{
//        default:[],
//        type: cc.Integer
//    },
//    //卡组的类型
//    type: {
//        type: cc.Enum({
//            //幻想
//            //科学
//            Science: 0,
//            Fantasy: 1,
//            //混沌
//            Chaos: 2,
//        }),
//        default: 0,
//    },
//    usable:true,
//},