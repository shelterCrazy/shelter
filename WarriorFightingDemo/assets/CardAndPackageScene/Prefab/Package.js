cc.Class({
    extends: cc.Component,

    properties: {

        //卡包类型
        packageType: 0,
        //卡包数量
        packageNum: 0,

        //卡包名称
        packageName: "",

        enterArea:false,
    },

    // use this for initialization
    onLoad: function () {

        var cardObject = this.node;
        //cardObject.on(cc.Node.EventType.MOUSE_ENTER, this.enterMouseEvent, this);
        //cardObject.on(cc.Node.EventType.MOUSE_LEAVE, this.leaveMouseEvent, this);
        cardObject.on(cc.Node.EventType.TOUCH_START,this.downMouseEvent,this);

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

        event.stopPropagation();
    },

    downMouseEvent: function (event) {
        var self = this;

        var cardObject = this.node;
        var x = event.getLocationX();
        var y = event.getLocationY();

        var sender = new cc.Event.EventCustom('packageSelect', true);
        sender.setUserData({packageType: self.packageType,package:self.node});
        this.node.dispatchEvent(sender);

        var target = event.getCurrentTarget(event);
        var posInParent = target.parent.convertToNodeSpace(event.getLocation());

        this.node.x = posInParent.x - target.width / 2 + 1920;
        this.node.y = posInParent.y - target.height / 2;

        // 开启移动监听
        cardObject.on(cc.Node.EventType.TOUCH_MOVE, this.moveMouseEvent, this);
        cardObject.on(cc.Node.EventType.TOUCH_END, this.upMouseEvent, this);

        event.stopPropagation();
    },

    upMouseEvent: function (event) {
        //关闭监听鼠标移动事件
        var cardObject = this.node;
        var sender;
        var target = event.getCurrentTarget(event);
        var posInWorld = target.convertToWorldSpaceAR(cc.Vec2.ZERO);
        console.log("upMouse");

        var rect = cc.rect(1920 + 600,200,400,400);
        event.stopPropagation();
        if(cc.rectContainsPoint(rect,posInWorld)){
            sender = new cc.Event.EventCustom('usePackage',true);
            sender.setUserData({packageType: this.packageType});
            this.node.dispatchEvent(sender);
            sender = new cc.Event.EventCustom('leaveArea',true);
            //sender.setUserData({packageType: this.packageType});
            this.node.dispatchEvent(sender);
            this.enterArea = false;
            this.node.removeFromParent();
        }else{
            sender = new cc.Event.EventCustom('unusePackage',true);
            sender.setUserData({packageType: this.packageType});
            this.node.dispatchEvent(sender);
            this.node.runAction(cc.moveTo(0.4,0,0).easing(cc.easeSineOut()));
        }

        //关闭一系列监听
        cardObject.off(cc.Node.EventType.TOUCH_MOVE,this.moveMouseEvent,this);
        cardObject.off(cc.Node.EventType.TOUCH_END,this.upMouseEvent,this);

    },

    moveMouseEvent: function (event) {
        //鼠标移动监听
        var cardObject = this.node;
        cardObject.x += event.getDeltaX();
        cardObject.y += event.getDeltaY();
        var target = event.getCurrentTarget(event);
        var posInNode = target.convertToNodeSpace(event.getLocation());
        var posInWorld = target.convertToWorldSpaceAR(cc.Vec2.ZERO);
        //cc.log(posInWorld);
        var rect = cc.rect(1920+600,200,400,400);
        if(cc.rectContainsPoint(rect,posInWorld)){
            if(this.enterArea === false){
                var sender = new cc.Event.EventCustom('enterArea',true);
                //sender.setUserData({packageType: this.packageType});
                this.node.dispatchEvent(sender);
                this.enterArea = true;
            }
        }else{
            if(this.enterArea === true){
                sender = new cc.Event.EventCustom('leaveArea',true);
                //sender.setUserData({packageType: this.packageType});
                this.node.dispatchEvent(sender);
                this.enterArea = false;
            }
        }
        //cc.log(posInWorld.x + "  " + posInWorld.y);
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