var globalConstant = require("Constant");

cc.Class({
    extends: cc.Component,

    properties: {
        positionType: {
            type: cc.Enum({
                ZeroPoint: 0,
                AnyPoint: 1
            }),
            default: 0
        }
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        self.creepScript = this.node.getComponent('CreepCard');
        self.cardScript = self.node.getComponent('Card');
    },


    getUseState: function () {
        var self = this;
        if (self.positionType) {
            return self.cardScript.hero.x - 200 < this.node.x + this.node.parent.x - this.roll.x &&
                self.cardScript.hero.x + 200 > this.node.x + this.node.parent.x - this.roll.x
        } else {
            return true
        }
    },

    useCard: function () {
        var self = this;
        var eventsend = new cc.Event.EventCustom('creatureCreate', true);
        var position = this.node.x + globalConstant.cameraOffset + cc.director.getWinSize().width * globalConstant.sceneEdge;
        console.log(position * self.positionType);
        eventsend.setUserData({
            X: position * self.positionType,
            Y: null,
            attack: this.creepScript.attack,
            health: this.creepScript.health,
            team: this.cardScript.team,
            id: this.cardScript.cardID,
            velocity: this.creepScript.velocity
        });
        this.node.dispatchEvent(eventsend);

        this.cardScript.drawCardScript.deleteCard(this.node);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});