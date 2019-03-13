cc.Class({
    extends: cc.Component,

    properties: {
        //改变时的透明度1
        opacity1:0,
        //改变时的透明度2
        opacity2:0,
        //耗时
        time:0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad:function(){
        this.node.runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.fadeTo(this.time,this.opacity1).easing(cc.easeSineInOut()),
                    cc.fadeTo(this.time,this.opacity2).easing(cc.easeSineInOut())
                ))
        );
    },


    // update (dt) {},
});
