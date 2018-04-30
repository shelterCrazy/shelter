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
        var self = this;
        self.skelen = self.node.getComponent(sp.Skeleton);
        setTimeout(function(){
            self.skelen.animation = "jump";
        },5000);
        setTimeout(function(){
            self.skelen.animation = "walk";
        },10000);
    },


    // update (dt) {},
});
