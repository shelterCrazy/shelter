
var globalConstant = require("Constant");
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
        self.cardScript = self.node.parent.getComponent("Card");
        self.mainGameManagerScript = self.cardScript.mainGameManager.getComponent("MainGameManager");
    },



    getUseState: function(){
        var state;
        var self = this;
        if(self.cardScript.team < 0) {

            return (this.getMaxX() >
                this.node.parent.x + globalConstant.cameraOffset +
                cc.director.getWinSize().width * globalConstant.sceneEdge||
                cc.director.getWinSize().width * globalConstant.sceneEdge >
                this.node.parent.x + globalConstant.cameraOffset +
                cc.director.getWinSize().width * globalConstant.sceneEdge);

        }else if(self.cardScript.team > 0){
            return (this.getMaxX() <
                this.node.parent.x + globalConstant.cameraOffset +
                cc.director.getWinSize().width * globalConstant.sceneEdge ||
            cc.director.getWinSize().width * (globalConstant.sceneWidth - globalConstant.sceneEdge) <
            this.node.parent.x + globalConstant.cameraOffset +
            cc.director.getWinSize().width * globalConstant.sceneEdge);

        }
    },

    getMaxX:function()
    {
        var self = this;
        var max = 0;
        var i = 0;
        var script;
        var creature = self.mainGameManagerScript.creatureLayer.getChildren();
        if(self.cardScript.team < 0) {
            max = 0;
            for (; i < creature.length; i++) {
                script = creature[i].getComponent("Unit");
                if (max < creature[i].x && script.team === self.cardScript.team) {
                    max = creature[i].x;
                }
            }
            script = self.mainGameManagerScript.heros[0].getComponent("Unit");
            if(script.death === false && max < self.mainGameManagerScript.heros[0].x){
                max = self.mainGameManagerScript.heros[0].x;
            }

        }else if(self.cardScript.team > 0) {
            max = 10000;
            for (; i < creature.length; i++) {
                script = creature[i].getComponent("Unit");
                if (max > creature[i].x && script.team === self.cardScript.team) {
                    max = creature[i].x;
                }
            }
            script = self.mainGameManagerScript.heros[0].getComponent("Unit");
            if(script.death === false && max > self.mainGameManagerScript.heros[0].x){
                max = self.mainGameManagerScript.heros[0].x;
            }
        }
        return max;
    },

    // update (dt) {},
});
