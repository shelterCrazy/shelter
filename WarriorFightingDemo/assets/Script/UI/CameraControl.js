var globalConstant = require("Constant");

cc.Class({
    extends: cc.Component,

    properties: {
        target: {
            default: null,
            type: cc.Node
        },

        targets: {
            default: [],
            type: [cc.Node],
        }
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        this.camera = this.getComponent(cc.Camera);
    },

    // called every frame, uncomment this function to activate update callback
    lateUpdate: function (dt) {
        var targetPos = this.target.convertToWorldSpaceAR(cc.Vec2.ZERO);
        var position = this.node.parent.convertToNodeSpaceAR(targetPos);

        if(position.x > cc.director.getWinSize().width * (globalConstant.sceneWidth - globalConstant.sceneEdge)){
            this.node.x = cc.director.getWinSize().width * (globalConstant.sceneWidth - globalConstant.sceneEdge);
        }else if(position.x < cc.director.getWinSize().width * globalConstant.sceneEdge){
            this.node.x = cc.director.getWinSize().width * globalConstant.sceneEdge;
        }else {
            this.node.x = position.x;
        }

        var ratio = targetPos.y / cc.winSize.height;
        this.camera.zoomRatio = 0.9 + (0.5 - ratio) * 0.5;
    },
});
