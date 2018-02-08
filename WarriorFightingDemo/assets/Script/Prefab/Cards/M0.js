var globalConstant = require("Constant");
cc.Class({
    extends: cc.Component,

    properties: {

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
                var eventsend = new cc.Event.EventCustom('magicCreate',true);
                eventsend.setUserData({
                    name:this.cardScript.cName,
                    round:3,
                    y:null,
                    position:position,
                    area:area,
                    team:this.cardScript.team,
                    id:this.cardScript.cardId
                });
                this.node.dispatchEvent(eventsend);
                this.cardScript.drawCardScript.deleteCard(this.node);
            }
        }else if(this.magicCardScript.magicType === type.DirectionTarget){
            this.useCard = function(id,angel,speed,area,x,y){

            }
        }else{
            this.useCard = function(){

            }
        }
    },
 
    getUseState: function(){
        return true;
    },    
    
    //useCard: function(position,area){
    //
    //    var eventsend = new cc.Event.EventCustom('magicCreate',true);
    //    eventsend.setUserData({
    //        name:this.cardScript.cName,
    //        round:3,
    //        y:null,
    //        position:position,
    //        area:area,
    //        team:this.cardScript.team,
    //        id:this.cardScript.cardId
    //    });
    //    this.node.dispatchEvent(eventsend);
    //    this.cardScript.drawCardScript.deleteCard(this.node);
    //},
    useCard: function(){

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});