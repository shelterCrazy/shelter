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
            self.node.stopAllActions();
            self.node.runAction(cc.moveTo(
                self.time1,
                cc.v2(
                    self.nowPosition.x + self.moveX,
                    self.nowPosition.y + self.moveY
                )
            ).easing(cc.easeSineInOut()));
        }, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE,function(){
            self.node.stopAllActions();
            self.node.runAction(cc.moveTo(
                self.time2,
                cc.v2(
                    self.nowPosition.x,
                    self.nowPosition.y
                )
            ).easing(cc.easeSineInOut()));
        }, this);
    },

    // update (dt) {},
});
