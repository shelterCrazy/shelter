var globalConstant = require("Constant");
cc.Class({
    extends: cc.Component,

    properties: {
        topSwitch:false,
        bottomSwitch:false,
        leftSwitch:false,
        rightSwitch:false,
        top:0,
        bottom:0,
        left:0,
        right:0
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},


    update:function(dt) {
        if(this.leftSwitch){
            this.node.x = - globalConstant.designResolution.width / 2 + this.left;
        }
        if(this.rightSwitch){
            this.node.x = cc.director.getWinSize().width - globalConstant.designResolution.width / 2
                - this.right;
        }
        if(this.topSwitch){
            this.node.y = cc.director.getWinSize().height - globalConstant.designResolution.height / 2
                - this.top;
        }
        if(this.bottomSwitch){
            this.node.y = - globalConstant.designResolution.height / 2 + this.bottom;
        }
    },
});
