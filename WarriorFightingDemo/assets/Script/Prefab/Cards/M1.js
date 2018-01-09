var globalConstant = require("Constant");
cc.Class({
    extends: cc.Component,

    properties: {
        magicType: {
            type: cc.Enum({
                NoTarget: 0,
                AreaTarget: 1,
                DirectionTarget: 2,
            }),
            default: 0
        },

    },

    // use this for initialization
    onLoad: function () {
        this.cardScript = this.node.getComponent('Card');
        this.magicCardScript = this.node.getComponent('MagicCard');
        var type = cc.Enum({
            NoTarget: 0,
            AreaTarget: 1,
            DirectionTarget: 2,
        });
//        var self = this;
        if(this.magicCardScript.magicType === type.AreaTarget){
            this.useCard = function(position,area){

            }
        }else if(this.magicCardScript.magicType === type.DirectionTarget){
            this.useCard = function(id,angel,speed,area,x,y){
                var eventsend = new cc.Event.EventCustom('chantCreate',true);
                eventsend.setUserData({
                    name:this.cardScript.cName,
                    round:1,
                    position:x,
                    y:y,
                    angel:angel,
                    speed:speed,
                    area:area,
                    team:this.cardScript.team,
                    id:this.cardScript.cardID
                });
                this.node.dispatchEvent(eventsend);
                for(var i = 0;i < (360/10);i++) {
                            var eventsend = new cc.Event.EventCustom('chantCreate', true);
                            eventsend.setUserData({
                                name:this.cardScript.cName,
                                round:15,
                                position: x,
                                y: y,
                                angel: angel + 10*i,
                                id: this.cardScript.cardID,
                                speed: speed,
                                team: this.cardScript.team
                            });
                            this.node.dispatchEvent(eventsend);
                }
                this.cardScript.heroScirpt.drawCard(1);
                this.cardScript.drawCardScript.deleteCard(this.node);
            }
        }else{
            this.useCard = function(){

            }
        }
    },

    getUseState: function(){
        return true;
    },
    useCard: function(){

    }
    //useCard: function(id,angel,speed,x,y){
    //
    //    var eventsend = new cc.Event.EventCustom('magicCreate',true);
    //    eventsend.setUserData({
    //        name:this.cardScript.cName,
    //        round:1,
    //        position:x,
    //        y:y,
    //        angel:angel,
    //        speed:speed,
    //        team:this.cardScript.team,
    //        id:this.cardScript.cardID
    //    });
    //    this.node.dispatchEvent(eventsend);
    //    this.cardScript.heroScirpt.drawCard(2);
    //    //for(var i = 0;i < (360/3);i++) {
    //    //    var eventsend = new cc.Event.EventCustom('chantCreate', true);
    //    //    eventsend.setUserData({
    //    //        name:this.cardScript.cName,
    //    //        round:15,
    //    //        position: x,
    //    //        y: y,
    //    //        angel: angel + 3*i,
    //    //        id: this.cardScript.cardID,
    //    //        speed: speed,
    //    //        team: this.cardScript.team
    //    //    });
    //    //    this.node.dispatchEvent(eventsend);
    //    //}
    //
    //    this.cardScript.drawCardScript.deleteCard(this.node);
    //}
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
