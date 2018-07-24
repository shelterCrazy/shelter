cc.Class({
    extends: cc.Component,

    properties: {
        //晃动的范围X
        rangeX:0,
        //晃动的范围Y
        rangeY:0,
        //耗时
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
