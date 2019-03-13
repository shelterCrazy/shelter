cc.Class({
    extends: cc.Component,

    properties: {
        //Ðý×ªµÄ·¶Î§
        rangeX:0,
        //ºÄÊ±
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
