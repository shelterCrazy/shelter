cc.Class({
    extends: cc.Component,

    properties: {

    },


    changeLabel:function(event, customEventData){
        this.node.getComponent(cc.Label).string = customEventData;
    }


    // update (dt) {},
});
