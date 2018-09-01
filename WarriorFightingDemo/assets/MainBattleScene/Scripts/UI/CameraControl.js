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
            type: [cc.Node]
        },
        //相机移动范围限制
        areaLeft:0,
        areaRight:0,

        mainScene:false,
        //y坐标跟随
        yFollow:false,
        //Y坐标偏移量
        offsetY:0,
        //鼠标滚动的调整
        _mouseWheel:0,

        mouseWheelMax:{
            type:cc.Integer,
            default:8
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
    /**
     * @主要功能 将目前的target缓慢移动到另外一个target上，最后切换target
     * @author C14
     * @Date 2018/2/11
     * @parameters targetNum time
     * @returns
     */
    moveTarget:function(targetNum,customEventData,time){
        var self = this;

        Number(customEventData);
        self.targets[0].position = this.target.position;
        self.target = self.targets[0];

        if(time === undefined || time === null)time = 2;
        self.target.runAction(cc.sequence(
            cc.moveTo(time,self.targets[customEventData].position).easing(cc.easeQuadraticActionInOut()),
            cc.callFunc(function(){
                //self.target = self.targets[customEventData];
            }.bind(this),this)
        ));
    },
    followTarget:function(targetNum,customEventData){
        var self = this;

        Number(customEventData);
        cc.log(customEventData);
        self.targets[0].position = this.target.position;
        self.target = self.targets[0];

        this.callback = function() {
            // 这里的 this 指向 component
            this.target.x += (self.targets[customEventData].position.x - self.target.position.x) / 36;
            this.target.y += (self.targets[customEventData].position.y - self.target.position.y) / 36;
            //if((this.targets[customEventData].position - this.target.position) <= cc.v2(2,2) &&
            //    cc.v2(2,2) <= (this.targets[customEventData].position - this.target.position)){
            //    self.target = self.targets[customEventData];
            //    this.unschedule(this.callback);
            //}
        };
        this.schedule(this.callback, 0.01);
    },

    mouseWheel:function(dat){
        if(this._mouseWheel + dat >= 0 && this._mouseWheel + dat <= this.mouseWheelMax) {
            this._mouseWheel += dat;
        }
        return this._mouseWheel;
    },

    // use this for initialization
    onLoad: function () {
        var self = this;

        this.camera = this.node.getComponent(cc.Camera);

        if(this.mainScene === false) {
            //开启鼠标滚动监听
            cc.find("Canvas").on(cc.Node.EventType.MOUSE_WHEEL, function (event) {
                console.log('Mouse wheel:' + self.mouseWheel(event.getScrollY()));
            }, this);
        }

        //绘制碰撞框
        //if(globalConstant.collisionDebugDraw)
        //cc.director.getCollisionManager().enabledDebugDraw = true;
        //
        //cc.director.getPhysicsManager().attachDebugDrawToCamera(this.camera);
        //cc.director.getCollisionManager().attachDebugDrawToCamera(this.camera);

        if(this.mainScene === false){
            this.areaRight = globalConstant.sceneWidth;
        }
    },

    // called every frame, uncomment this function to activate update callback
    lateUpdate: function (dt) {
        var targetPos = this.target.convertToWorldSpaceAR(cc.Vec2.ZERO);
        var position = this.node.parent.convertToNodeSpaceAR(targetPos);
        if (this.camera !== undefined) {
            if (position.x > cc.director.getWinSize().width * (this.areaRight - globalConstant.sceneEdge)) {
                this.node.x = cc.director.getWinSize().width * (this.areaRight - globalConstant.sceneEdge);
            } else if (position.x < cc.director.getWinSize().width * globalConstant.sceneEdge) {
                this.node.x = cc.director.getWinSize().width * globalConstant.sceneEdge;
            } else {
                this.node.x = position.x;
            }

            this.node.y = position.y + this.offsetY;
            var ratio = targetPos.y / cc.winSize.height;
            if (!this.yFollow)// + (0.5 - ratio) * 0.5
                globalConstant.cameraRatio = this.camera.zoomRatio = 1 - this._mouseWheel/this.mouseWheelMax/3;
            else {
                globalConstant.cameraRatio = this.camera.zoomRatio = 1 + (0.5 - ratio) * 0.1 -
                    this._mouseWheel / this.mouseWheelMax / 2;
            }
        }
    }
});
