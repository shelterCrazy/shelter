//�¹�� 1������ 1��-7Ѫ��id 0000���
//��Ч����
var globalConstant = require("Constant");

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        this.creepScript = this.node.getComponent('CreepCard');
        this.cardScript = this.node.getComponent('Card');
    },



    getUseState: function(){
        return true;
    },

    useCard: function(){
        var eventsend = new cc.Event.EventCustom('creatureCreate',true);
        var position = this.node.x + globalConstant.cameraOffset + cc.director.getWinSize().width * globalConstant.sceneEdge;
        eventsend.setUserData({
            X:0,
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