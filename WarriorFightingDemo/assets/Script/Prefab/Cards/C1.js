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
    },

    
    getUseState: function(){
        var state;
        var self = this;
        if(self.cardScript.hero.x - 200 < this.node.x + this.node.parent.x - this.roll.x &&
           self.cardScript.hero.x + 200 > this.node.x + this.node.parent.x - this.roll.x ){
               state = true;
           }else{
               state = false;
           }
        return state;
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