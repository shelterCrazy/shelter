cc.Class({
    extends: cc.Component,

    properties: {
        //鼠标触碰时的图片效果
        selectPic:cc.Node,
        //鼠标触碰时的文本标签
        textNode:cc.Node,

        textLabel:cc.Label,

        storyName:"",

        num:0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad :function() {
        this.textLabel.string = this.storyName;
        this.node.on(cc.Node.EventType.MOUSE_ENTER,function(){
            var action = cc.scaleTo(0.8, 1).easing(cc.easeCubicActionOut());
            this.selectPic.stopAction(action);
            this.selectPic.runAction(action);
            var action2 = cc.fadeIn(0.8).easing(cc.easeCubicActionOut());
            this.textNode.stopAction(action2);
            this.textNode.runAction(action2);

            var eventsend = new cc.Event.EventCustom('selectStage',true);
            eventsend.setUserData({"num":this.num});
            this.node.dispatchEvent(eventsend);
        }.bind(this), this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE,function(){
            var action = cc.scaleTo(0.8, 0).easing(cc.easeCubicActionOut());
            this.selectPic.stopAction(action);
            this.selectPic.runAction(action);

            var action2 = cc.fadeOut(0.8).easing(cc.easeCubicActionOut());
            this.textNode.stopAction(action2);
            this.textNode.runAction(action2);

            var eventsend = new cc.Event.EventCustom('unSelectStage',true);
            eventsend.setUserData({"num":this.num});
            this.node.dispatchEvent(eventsend);
        }.bind(this), this);
        this.node.on(cc.Node.EventType.MOUSE_DOWN,function(){
            var action = cc.scaleTo(0.8, 0).easing(cc.easeCubicActionOut());
            this.selectPic.stopAction(action);
            this.selectPic.runAction(action);

            var action2 = cc.fadeOut(0.8).easing(cc.easeCubicActionOut());
            this.textNode.stopAction(action2);
            this.textNode.runAction(action2);

            var eventsend = new cc.Event.EventCustom('mouseDownSelectStage',true);
            eventsend.setUserData({"num":this.num});
            this.node.dispatchEvent(eventsend);
        }.bind(this), this);
    },


    // update (dt) {},
});
