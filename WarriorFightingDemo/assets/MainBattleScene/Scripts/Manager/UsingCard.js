cc.Class({
    extends: cc.Component,

    properties: {
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
        // 使用中节点
        cardUsing: cc.Node,
        // 手牌节点
        cardHand: cc.Node,
        // 警告提示节点
        labelTips: cc.Label,
        nodeTips: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        // 当前使用卡牌
        this.cardObject = null;

        // 卡牌选择与退出的监听
        this.node.on("cardSelect", this.cardSelectEvent, this);
        this.node.on("cardExit", this.cardExitEvent, this);

        //监听错误提示，无法使用牌的情况
        this.node.on("errorTips", this.catchTips, this);

    },

    cardSelectEvent: function (event) {
        var self = this;

        console.log("select a card");
        self.cardObject = event.detail.card;
        self.cardObject.parent = self.cardUsing;
        // this.cardObject.x = event.detail.posX;
        // this.cardObject.y = event.detail.posY;
        event.stopPropagation();
    },
    cardExitEvent: function (event) {
        console.log("exit a card");
        // this.cardObject.parent = this.cardHand;
        this.cardObject.parent = null;
        this.cardHand.addChild(this.cardObject, this.cardObject.getComponent("Card").cardIndex);
        this.cardObject = null;
        event.stopPropagation();
    },

    catchTips: function (event) {
        var self = this;
        if (event.detail.text !== null) {
            var fadeIn = cc.fadeIn(1.0);
            var fadeOut = cc.fadeOut(1.0);
            // console.log(self.warningTips.str);
            self.labelTips.string = event.detail.text;
            // console.log(self.warningTips.string);

            self.labelTips.node.runAction(cc.sequence(fadeIn, fadeOut));
        }

        event.stopPropagation();
    },



    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});