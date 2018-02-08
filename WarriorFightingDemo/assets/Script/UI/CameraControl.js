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
        },
        //相机移动范围限制
        areaLeft:0,
        areaRight:0,

        mainScene:false,
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
        this.camera = this.node.getComponent(cc.Camera);

        //绘制碰撞框
        if(globalConstant.collisionDebugDraw)
        cc.director.getCollisionManager().enabledDebugDraw = true;

        cc.director.getPhysicsManager().attachDebugDrawToCamera(this.camera);
        cc.director.getCollisionManager().attachDebugDrawToCamera(this.camera);

        if(this.mainScene === false){
            this.areaRight = globalConstant.sceneWidth;
        }
    },

    // called every frame, uncomment this function to activate update callback
    lateUpdate: function (dt) {
        var targetPos = this.target.convertToWorldSpaceAR(cc.Vec2.ZERO);
        var position = this.node.parent.convertToNodeSpaceAR(targetPos);

        if(position.x > cc.director.getWinSize().width * (this.areaRight - globalConstant.sceneEdge)){
            this.node.x = cc.director.getWinSize().width * (this.areaRight - globalConstant.sceneEdge);
        }else if(position.x < cc.director.getWinSize().width * globalConstant.sceneEdge){
            this.node.x = cc.director.getWinSize().width * globalConstant.sceneEdge;
        }else {
            this.node.x = position.x;
        }

        var ratio = targetPos.y / cc.winSize.height;
        this.camera.zoomRatio = 1 + (0.5 - ratio) * 0.5;
    }
});
