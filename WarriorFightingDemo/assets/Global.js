// Global.js, now the filename matters

module.exports = {
    name:"",
    deckView:0,
    magicDeck:{
        default:[],
        type: cc.Integer,
    },
    creatureDeck:{
        default:[],
        type: cc.Integer,
    },
    //卡组的类型
    type: {
        type: cc.Enum({
            //科学
            Science: 0,
            //幻想
            Fantasy: 1,
            //混沌
            Chaos: 2,
        }),
        default: 0,
    },

    totalDeckData:[],
    //{
    //    default:[],
    //    type: deckData,
    //},
    //出战选择的卡组编号
    deckUsage: 0,
};
//{
//    magicDeck:
//    {
//    default: [],
//        type: cc.Integer,
//    },
//    creatureDeck:
//    {
//    default:[],
//        type: cc.Integer,
//    },
//}