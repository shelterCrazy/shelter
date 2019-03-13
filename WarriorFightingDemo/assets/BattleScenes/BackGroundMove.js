var globalConstant = require("Constant");

cc.Class({
    extends: cc.Component,

    properties: {
        cameraNode:cc.Node,
        //Î»ÒÆ±ÈÀý
        moveRate:1,
        //³õÊ¼Æ«ÒÆ
        offset:0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad:function ()
    {
        this.cameraControlScript = this.cameraNode.getComponent("CameraControl");
        this.cameraTarget = this.cameraNode;
    },


     update:function ()
     {
         if(this.cameraTarget !== null){
             var position = this.cameraTarget.x;
             var width = cc.director.getWinSize().width / this.cameraControlScript.camera.zoomRatio;
             var height = cc.director.getWinSize().height / this.cameraControlScript.camera.zoomRatio;
             if(this.cameraTarget.x <= width / 2)
             {
                 position = width / 2;
             }else if(this.cameraTarget.x >= cc.director.getWinSize().width * (globalConstant.sceneWidth) - width / 2){
                 position = cc.director.getWinSize().width * (globalConstant.sceneWidth) - width / 2;
             }
             //this.node.runAction(cc.moveTo(1,position * this.moveRate + this.offset),this.node.y);
             this.node.x = position * this.moveRate + this.offset;
             //cc.log(this.node.x);
         }
     },
});
