/**
 * @��Ҫ���� ����ʵ������ƶ���ȥ����ʾ����ʹ����Ч��ʾ������ʧ
 * @author C14
 * @Date 2018/7/26
 */
cc.Class({
    extends: cc.Component,
    properties: {
        controlNode:cc.Node,
        mouseInOpacity:255,
        mouseOutOpacity:0,
        time1:0,
        time2:0
    },

    onLoad:function(){
        var self = this;
        this.node.on(cc.Node.EventType.MOUSE_ENTER,function(){
            this.controlNode.stopAllActions();
            this.controlNode.runAction(cc.fadeTo(this.time1, this.mouseInOpacity).easing(cc.easeCubicActionOut()));
        }.bind(this), this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE,function(){
            this.controlNode.stopAllActions();
            this.controlNode.runAction(cc.fadeTo(this.time2, this.mouseOutOpacity).easing(cc.easeCubicActionOut()));
        }.bind(this), this);
    },

    // update (dt) {},
});
