cc.Class({
    extends: cc.Component,

    properties: {
        //旋转方向
        position:1,
        //耗时
        time:0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad:function(){
        this.node.runAction(
            cc.repeatForever(
                cc.rotateBy(this.time, 360 * this.position)
            )
        );
    },


    // update (dt) {},
});
