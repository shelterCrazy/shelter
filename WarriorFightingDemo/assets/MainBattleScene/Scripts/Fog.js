var globalConstant = require("Constant");
var Global = require("Global");
cc.Class({
    extends: cc.Component,

    properties: {
        disappear:false,
        //进入雾的单位
        target:[]
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

    onLoad: function() {
        this.initFogSize();
    },
    initFogSize:function(){
        var box = this.node.getComponent(cc.BoxCollider);
        box.size.width = globalConstant.fogColliderWidth;
    },
    onCollisionEnter: function (other, self) {
        var script = null;
        //if (this.disappear === false) {
            cc.log("碰到了");
            //判断如果接触了生物
            if (other.node.group === "Creature" || other.node.group === "Hero") {
                script = other.node.getComponent('Creature');
                if(script === null)script = other.node.getComponent('Player');

                if(script.team / Math.abs(script.team) === Global.nowTeam / Math.abs(Global.nowTeam)) {
                    this.clearFog();
                    this.target.push(other.node);
                }
            }
        //}
    },

    onCollisionExit: function (other, self) {
        var i = 0;
        var script = null;
        //判断
        cc.log("离开了");
        if (other.node.group === "Creature" || other.node.group === "Hero") {
            script = other.node.getComponent('Creature');
            if(script === null)script = other.node.getComponent('Player');

            if(script.team / Math.abs(script.team) === Global.nowTeam / Math.abs( Global.nowTeam)) {
                for (i; i < this.target.length; i++) {
                    if (other.node === this.target[i]) {
                        this.target.splice(i, 1);
                    }
                }
                if (this.target.length === 0) {
                    this.restoreFog();
                }
            }
        }
    },

    clearFog: function () {
        var self = this;
        this.node.runAction(
            cc.sequence(
                cc.fadeOut(globalConstant.fogClearTime),
                cc.callFunc(function(){
                    self.disappear = true;
                },this)
            )
        );
    },
    restoreFog: function () {
        var self = this;
        setTimeout(function() {
            if (self.target.length === 0) {
                self.node.runAction(
                    cc.sequence(
                        cc.fadeIn(globalConstant.fogRestoreTime),
                        cc.callFunc(function () {
                            self.disappear = false;
                        }, self)
                    )
                );
            }
        },6 * 1000);
    }
    // update (dt) {},
});
