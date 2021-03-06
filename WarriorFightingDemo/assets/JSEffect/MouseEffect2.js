/**
 * @主要功能 用于实现鼠标移动上去就放大节点尺寸的效果
 * @author C14
 * @Date 2018/7/26
 */
cc.Class({
    extends: cc.Component,
    properties: {
        nowScale:1,
        scale:1,
        time1:0,
        time2:0
    },

    onLoad:function(){
        var self = this;
        this.node.on(cc.Node.EventType.MOUSE_ENTER,function(){
            var action = cc.scaleTo(
                this.time1,
                this.nowScale + this.scale
            ).easing(cc.easeSineInOut());
            this.node.stopAction(action);
            this.node.runAction(action);
        }.bind(this), this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE,function(){
            var action = cc.scaleTo(
                this.time2,
                this.nowScale
            ).easing(cc.easeSineInOut());
            this.node.stopAction(action);
            this.node.runAction(action);
        }.bind(this), this);
    },

    // update (dt) {},
});
