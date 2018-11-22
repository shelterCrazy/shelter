cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad:function() {

    },

    exit:function(){
        this.node.stopAllActions();
        this.node.runAction(cc.moveTo(1,-1386,-96).easing(cc.easeCubicActionOut()));
    },

    come:function(){
        this.node.stopAllActions();
        this.node.runAction(cc.moveTo(1,-785,-96).easing(cc.easeCubicActionOut()));
    }


    // update (dt) {},
});
