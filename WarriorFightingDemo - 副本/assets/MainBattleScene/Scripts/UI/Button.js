/**
 * @主要功能:   创建npc类
 * @type {Function}
 */
var buttonClass = cc.Class({
    extends: cc.Component,

    properties: {
        button: cc.Button,
        enemy: cc.Node,
        team: 0,
        
        delay:0,
    },


    onLoad: function(){
        this.delay = 50;
    },


    /**
     * @主要功能:  点击事件  npc创建事件     需要说明的是npc属性以后需要专门的buff属性管理器js管理  并提供回调函数，并且最好交由创建类去调用处理。
     * @param event
     * @param customEventData
     */
    onButtonTouchEvent: function (event,customEventData) {
        var eventsend = new cc.Event.EventCustom('creatureCreate',true);
        if(this.team === -1){
            eventsend.setUserData({X:(512 + this.team*200),Y:-95,attack:2,health:20,team:this.team,speed:2,id:0});
        }else{
            eventsend.setUserData({X:(512 + this.team*200),Y:-95,attack:2,health:10,team:this.team,speed:3,id:1});
        }
        //cc.eventManager.dispatchEvent(event);  
        this.node.dispatchEvent(eventsend);

        // cc.log("onButtonTouchEvent事件发射后")
    },

    
});
