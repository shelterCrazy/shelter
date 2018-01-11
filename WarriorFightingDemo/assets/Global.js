// Global.js, now the filename matters

module.exports = {

    //玩家持有的金币
    money:1000,
    //灵魂碎片
    soul:12,
    //卡包的数量
    bagNum:10,
    //现在正在浏览的卡组
    deckView:0,
    //本次作战的队伍是
    nowTeam:-1,

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