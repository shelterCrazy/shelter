cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    activeEnable:function(){
        this.node.active = true;
    },
    activeDisable:function(){
        this.node.active = false;
    },
    changeActive:function(){
        this.node.active = !this.node.active;
    }


    // update (dt) {},
});
