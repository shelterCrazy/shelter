cc.Class({
    extends: cc.Component,

    properties: {
        panelNode:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        
    },
    
    close:function(){
        this.panelNode.active = false;
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
