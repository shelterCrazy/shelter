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
        //y坐标跟随
        yFollow:false
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
    /**
     * @主要功能 将目前的target缓慢移动到另外一个target上，最后切换target
     * @author C14
     * @Date 2018/2/11
     * @parameters targetNum time
     * @returns
     */
    moveTarget:function(targetNum,time){
        var self = this;
        self.targets[1].position = this.target.position;
        self.target = self.targets[1];
        self.target.runAction(cc.sequence(
            cc.moveTo(time,self.targets[targetNum].position).easing(cc.easeQuadraticActionInOut()),
            cc.callFunc(function(){
                self.target = self.targets[targetNum];
            },this)
        ));
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
        if(this.mainScene) this.node.y = position.y + cc.winSize.height * 0.4;
        var ratio = targetPos.y / cc.winSize.height;
        if(!this.yFollow)
            this.camera.zoomRatio = 1 + (0.5 - ratio) * 0.5;
        else{
            this.camera.zoomRatio = 1 + (0.5 - ratio) * 0.1;
        }
    }
});
