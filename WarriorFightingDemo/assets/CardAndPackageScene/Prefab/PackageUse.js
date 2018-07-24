cc.Class({
    extends: cc.Component,

    properties: {

        //卡包类型
        packageType: 0,
        //卡包名称
        packageName: ""
    },

    // use this for initialization
    onLoad: function () {
        cc.log("试一下");

    },

    useCard: function(){
        // var self = this;
        // var script = null;
        // if(self.cardType === 0){
        //     script = self.node.getComponent('M' + self.cardId);
        // }else{
        //     script = self.node.getComponent('C' + self.cardId);
        // }
        // script.useCard();
        if (this.getUseState()) {
            //卡牌层面的操作
            //下一层的操作
        }

    },

    enterMouseEvent: function (event) {
        var cardObject = this.node;

        cardObject.on(cc.Node.EventType.TOUCH_MOVE,this.moveMouseEvent,this);

        event.stopPropagation();
    },

    downMouseEvent: function (event) {
        var self = this;

        var cardObject = this.node;
        var x = event.getLocationX();
        var y = event.getLocationY();
        var sender = new cc.Event.EventCustom('packageSelect', true);
        sender.setUserData({packageType: self.packageType,x:x,y:y});
        this.node.dispatchEvent(sender);

        //this.node.x = event.getLocationX();
        //this.node.y = event.getLocationY();

        // 开启移动监听
        //cardObject.on(cc.Node.EventType.TOUCH_MOVE, this.moveMouseEvent, this);
        //cardObject.on(cc.Node.EventType.TOUCH_END, this.upMouseEvent, this);

        event.stopPropagation();
    },

    upMouseEvent: function (event) {
        //关闭监听鼠标移动事件
        var cardObject = this.node;

        //var sender = new cc.Event.EventCustom('cardExit',true);
        //sender.setUserData({card: this.node});
        //this.node.dispatchEvent(sender);
        //
        //console.log("upMouse");

        // 关闭一系列监听
        cardObject.off(cc.Node.EventType.TOUCH_MOVE,this.moveMouseEvent,this);
        cardObject.off(cc.Node.EventType.TOUCH_START,this.downMouseEvent,this);
        cardObject.off(cc.Node.EventType.TOUCH_END,this.upMouseEvent,this);

        // this.drawCardScript.deleteCard(this.cardIndex);

        event.stopPropagation();
    },

    moveMouseEvent: function (event) {
        //鼠标移动监听
        var cardObject = this.node;
        cardObject.x += event.getDeltaX();
        cardObject.y += event.getDeltaY();

        event.stopPropagation();
    },

    //mouseLeaveEvent: function(){
    //    var sender = new cc.Event.EventCustom('cardOut', true);
    //    sender.setUserData({card:this.node});
    //    this.node.dispatchEvent(sender);
    //    event.stopPropagation();
    //}

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});