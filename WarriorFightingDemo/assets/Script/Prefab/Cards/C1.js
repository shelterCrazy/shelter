var globalConstant = require("Constant");

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        self.creepScript = this.node.getComponent('CreepCard');
        self.cardScript = self.node.getComponent('Card');
        self.mainGameManagerScript = self.cardScript.mainGameManager.getComponent("MainGameManager");
    },

    
    getUseState: function(){
        var state;
        var self = this;
        if(self.cardScript.team < 0) {

            return this.getMaxX() >
                this.node.x + globalConstant.cameraOffset +
                cc.director.getWinSize().width * globalConstant.sceneEdge;

        }else if(self.cardScript.team > 0){
            return this.getMaxX() <
                this.node.x + globalConstant.cameraOffset +
                cc.director.getWinSize().width * globalConstant.sceneEdge;

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
                script = creature[i].getComponent("Creature");
                if (max < creature[i].x && script.team === self.cardScript.team) {
                    max = creature[i].x;
                }
            }
            if(max < self.mainGameManagerScript.heros[0].x){
                max = self.mainGameManagerScript.heros[0].x;
            }

        }else if(self.cardScript.team > 0) {
            max = 10000;
            for (; i < creature.length; i++) {
                script = creature[i].getComponent("Creature");
                if (max > creature[i].x && script.team === self.cardScript.team) {
                    max = creature[i].x;
                }
            }
            if(max > self.mainGameManagerScript.heros[0].x){
                max = self.mainGameManagerScript.heros[0].x;
            }
        }
        return max;
    },
    
    useCard: function(){
        var eventsend = new cc.Event.EventCustom('creatureCreate',true);
        var position = this.node.x + globalConstant.cameraOffset + cc.director.getWinSize().width * globalConstant.sceneEdge;
            eventsend.setUserData({
                X:position,
                Y:null,
                attack:this.creepScript.attack,
                health:this.creepScript.health,
                team:this.cardScript.team,
                id:this.cardScript.cardID,
                velocity:this.creepScript.velocity
            });
        this.node.dispatchEvent(eventsend);

        this.cardScript.drawCardScript.deleteCard(this.node);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});