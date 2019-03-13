cc.Class({
    extends: cc.Component,

    properties: {
        //��ת�ķ�Χ
        rangeX:0,
        //��ʱ
        time:0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad:function(){
        this.node.runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.rotateBy(this.time, this.rangeX).easing(cc.easeSineOut()),
                    cc.rotateBy(this.time * 2, - this.rangeX * 2).easing(cc.easeSineInOut()),
                    cc.rotateBy(this.time, this.rangeX).easing(cc.easeSineIn())
                ))
        );
    },


    // update (dt) {},
});
