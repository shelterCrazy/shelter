/**
 * @主要功能 用于实现鼠标移动上去就移动节点的效果
 * @author C14
 * @Date 2018/7/26
 */
cc.Class({
    extends: cc.Component,
    properties: {
        nowPosition:cc.Vec2,
        moveX:0,
        moveY:0,
        time1:0,
        time2:0,
    },

    onLoad:function(){
        var self = this;
        this.node.on(cc.Node.EventType.MOUSE_ENTER,function(){
            this.node.stopAllActions();
            this.node.runAction(cc.moveTo(
                this.time1,
                cc.v2(
                    this.nowPosition.x + this.moveX,
                    this.nowPosition.y + this.moveY
                )
            ).easing(cc.easeSineInOut()));
        }.bind(this), this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE,function(){
            this.node.stopAllActions();
            this.node.runAction(cc.moveTo(
                this.time2,
                cc.v2(
                    this.nowPosition.x,
                    this.nowPosition.y
                )
            ).easing(cc.easeSineInOut()));
        }.bind(this), this);
    },

    // update (dt) {},
});
