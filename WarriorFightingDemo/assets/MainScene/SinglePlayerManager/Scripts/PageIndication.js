cc.Class({
    extends: cc.Component,

    properties: {
        num:0,
        selectNode:cc.Node,
        unselectNode:cc.Node
    },

    switchState:function(select,delay){
        this.selectNode.runAction(
            cc.sequence(
                cc.delayTime(delay),
                cc.scaleTo(0.3, select === true ? 1 : 0).easing(cc.easeCubicActionOut())
            )
        );
        this.unselectNode.runAction(
            cc.sequence(
                cc.delayTime(delay),
                cc.scaleTo(0.3,  select === false ? 1 : 0).easing(cc.easeCubicActionOut())
            )
        );
    },

    select:function(customEvent,select){
        this.selectNode.active = select;
        this.unselectNode.active = !select;
    },

    init:function(select){

    }


    // update (dt) {},
});
