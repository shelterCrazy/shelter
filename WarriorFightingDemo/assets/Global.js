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
    //���������
    type: {
        type: cc.Enum({
            //��ѧ
            Science: 0,
            //����
            Fantasy: 1,
            //����
            Chaos: 2,
        }),
        default: 0,
    },

    totalDeckData:[],
    //{
    //    default:[],
    //    type: deckData,
    //},
    //��սѡ��Ŀ�����
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