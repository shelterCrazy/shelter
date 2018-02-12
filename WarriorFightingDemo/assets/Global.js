// Global.js, now the filename matters

module.exports = {

    userName:"kenan",
    password:"123456",

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
    nowTeam:-1,

    //普通魔法卡生物牌的预制
    magicCardPrefab:[cc.Prefab],
    creatureCardPrefab:[cc.Prefab],

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
    totalDeckData:[],

    //出战选择的卡组编号
    deckUsage: 0,
    //是否是从主界面触发的进入游戏
    mainStart:false,

    //以下是用户设置部分
    //主音量
    mainVolume:1,
    //以下是用户设置的主音量
    mainEffectVolume:1,
    //以下是用户设置部分
    mainMusicVolume:1,
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