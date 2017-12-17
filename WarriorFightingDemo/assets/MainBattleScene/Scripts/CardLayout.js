cc.Class({
    extends: cc.Component,

    properties: {

        creatureCard:true,
        //卡牌数值放置节点（布局），准备一下坐标
        cardNumNode:cc.Node,
        //卡牌名称节点
        cardNameNode:cc.Node,
        //卡牌细节（描述节点）
        cardDetailNode:cc.Node,
        //卡牌细节（描述节点）
        cardDetailLabel:cc.Label,
        //卡牌尺寸节点
        cardSizeNode:cc.Node,
        //卡牌的图片遮罩尺寸
        cardMaskNode:cc.Node,
        //卡牌的法力消耗节点
        cardManaNode:cc.Node,
        //卡牌的法力消耗节点
        cardManaLabel:cc.Label,

        //具体卡牌攻击力生命值等等的标签，主要用于改字体大小
        cardDatLabel:[cc.Label],
        //具体卡牌攻击力生命值等等的节点
        cardDatNode:[cc.Node],
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        //初始化卡牌的布局，实现只要修改脚本就可以完成的操作

        //卡牌名字的节点位置
        this.cardNameNode.x = 0;
        this.cardNameNode.y = 75;
        //卡牌细节（描述）的节点位置
        this.cardDetailNode.x = -43;
        this.cardDetailNode.y = -52;
        //卡牌细节（描述）的节点位置
        this.cardSizeNode.width = 92;
        this.cardSizeNode.height = 177;
        //卡牌消耗的节点位置
        this.cardManaNode.x = -47;
        this.cardManaNode.y = 87;
        this.cardManaNode.width = 20;
        this.cardManaNode.height = 20;
        //卡牌遮罩的宽度高度，以及节点的Y坐标
        this.cardMaskNode.y = 8;
        this.cardMaskNode.width = 86;
        this.cardMaskNode.height = 109;

        this.cardManaLabel.fontSize = 20;

        this.cardDetailLabel.fontSize = 12;
        this.cardDetailLabel.lineHeight = 12;
        this.cardDetailLabel.node.width = 74;

        if(this.creatureCard === true) {
            //卡牌数据节点（布局）的位置坐标
            this.cardNumNode.x = 42;
            this.cardNumNode.y = 10;
            //攻击力节点宽度高度
            this.cardDatNode[0].width = 28;
            this.cardDatNode[0].height = 50;
            //生命值节点宽度高度
            this.cardDatNode[1].width = 28;
            this.cardDatNode[1].height = 32;
            //速度节点宽度高度
            this.cardDatNode[2].width = 28;
            this.cardDatNode[2].height = 32;

            for (var i = 0; i < 3; i++)
                this.cardDatLabel[i].fontSize = 20;

        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
