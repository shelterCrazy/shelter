cc.Class({
    extends: cc.Component,

    properties: {
        //�ζ��ķ�ΧX
        rangeX:0,
        //�ζ��ķ�ΧY
        rangeY:0,
        //��ʱ
        time:0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad:function(){
        this.node.runAction(
            cc.repeatForever(
            cc.sequence(
                cc.moveBy(this.time, this.rangeX, this.rangeY).easing(cc.easeSineInOut()),
                cc.moveBy(this.time, - this.rangeX, - this.rangeY).easing(cc.easeSineInOut())
            ))
        );
    },


    // update (dt) {},
});
