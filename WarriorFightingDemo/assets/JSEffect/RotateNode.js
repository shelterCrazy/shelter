cc.Class({
    extends: cc.Component,

    properties: {
        //��ת����
        position:1,
        //��ʱ
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
