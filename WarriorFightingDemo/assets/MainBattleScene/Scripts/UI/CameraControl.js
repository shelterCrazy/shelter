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
        },

        _deltaWheel:0,
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
        //self.targets[0].position = this.target.position;
        //self.target = self.targets[0];
        this.followTargetNum = customEventData;
        var targetPosition = self.targets[customEventData].position;
        //targetPosition.x += this.offsetY;
        targetPosition.y += this.offsetY;
        if(time === undefined || time === null)time = 2;
        self.node.runAction(cc.sequence(
            cc.moveTo(time,targetPosition).easing(cc.easeQuadraticActionInOut()),
            cc.callFunc(function(){
                //self.target = self.targets[customEventData];
            }.bind(this),this)
        ));

            //(1 - this.camera.zoomRatio) * cc.director.getWinSize().height / 2;
    },
    /**
     * @主要功能 将目前的target缓慢移动到另外一个target上，最后切换target
     * @author C14
     * @Date 2018/2/11
     * @parameters targetNum time
     * @returns
     */
    moveTargetWithTime:function(targetNum,customEventData){
        var self = this;

        Number(customEventData);
        this.followFlag = false;
        //self.targets[0].position = this.target.position;
        //self.target = self.targets[0];
        this.followTargetNum = customEventData % 100;
        var time = customEventData / 100;
        var targetPosition = self.targets[customEventData % 100].position;
        targetPosition.y += this.offsetY;
        self.node.runAction(cc.sequence(
            cc.moveTo(time,targetPosition).easing(cc.easeQuadraticActionOut()),
            cc.callFunc(function(){
                self.followTarget(null,customEventData % 100);
            }.bind(this),this)
        ));

            //(1 - this.camera.zoomRatio) * cc.director.getWinSize().height / 2;
    },

    followTarget:function(targetNum,customEventData){
        var self = this;

        Number(customEventData);
        cc.log(customEventData);
        //self.targets[0].position = this.target.position;
        //self.target = self.targets[0];
        this.followFlag = true;
        this.followTargetNum = customEventData;
    },
    /**
     * @主要功能 指定一个确定的跟随目标
     * @author C14
     * @Date 2019/3/3
     * @parameters
     * @returns
     */
    takeFollowTarget:function(target)
    {
        this.targets[1].position = this.target.position;
        this.target = this.targets[1];
        //跟随一个已有的目标
        for(var i = 0;i < this.targets.length;i++){
            if(this.targets[i] !== null && target === this.targets[i]){
                break;
            }
        }
        if(i === this.targets.length){
            this.targets.push(target);
        }
        cc.log(i);
        this.followFlag = true;
        this.followTargetNum = i;
    },

    followTargetThenScale:function(targetNum,customEventData){
        var self = this;

        setTimeout(function(){
            this.cameraRatioTo = 2;
        }.bind(this),0);
    },

    mouseWheel:function(dat){
        if(this._mouseWheel + dat >= 0 && this._mouseWheel + dat <= this.mouseWheelMax) {
            this._mouseWheel += dat;
            this.cameraRatioTo = 1 - this._mouseWheel / this.mouseWheelMax / 3;
            //this._mouseWheel += dat;
        }
        return this._mouseWheel + dat;
    },

    // use this for initialization
    onLoad: function () {




        //if(this.mainScene === false){
        //    this.areaRight = globalConstant.sceneWidth;
        //}
    },
    teleport:function(targetNum,customEventData){
        this.followFlag = false;
        Number(customEventData);
        cc.log(customEventData);
        this.followTargetNum = customEventData;
        var width = cc.director.getWinSize().width / this.camera.zoomRatio;
        var height = cc.director.getWinSize().height / this.camera.zoomRatio;

        var targetPos = this.targets[this.followTargetNum].convertToWorldSpaceAR(cc.Vec2.ZERO);
        var position = this.node.parent.convertToNodeSpaceAR(targetPos);

        position.y += this.offsetY +
            (1 - this.camera.zoomRatio) * cc.director.getWinSize().height / 2;

        if (position.x > cc.director.getWinSize().width * (globalConstant.sceneWidth) - width / 2) {
            this.node.x = cc.director.getWinSize().width * (globalConstant.sceneWidth) - width / 2;
        } else if (position.x < width / 2) {
            this.node.x = width / 2;//cc.director.getWinSize().width * globalConstant.sceneEdge;
        } else {
            this.node.x = position.x;
        }
        this.node.y = position.y;
        globalConstant.cameraPosition  = cc.v2(this.node.x, this.node.y);
    },

    init:function()
    {
        var self = this;
        this.camera = this.node.getComponent(cc.Camera);
        //this.followFlag = false;
        this.followTargetNum = 0;
        //放大的目标系数
        this.cameraRatioTo = 1;

        this.deltaTimer = 0;

        this.followFlag = false;
        this.teleportFlag = false;

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
        cc.director.getPhysicsManager().attachDebugDrawToCamera(this.camera);
        cc.director.getCollisionManager().attachDebugDrawToCamera(this.camera);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var targetPos = this.targets[this.followTargetNum].convertToWorldSpaceAR(cc.Vec2.ZERO);
        var position = this.node.parent.convertToNodeSpaceAR(targetPos);
        var p = cc.v2(this.node.x, this.node.y);
        var width = cc.director.getWinSize().width / this.camera.zoomRatio;
        //var height = cc.director.getWinSize().height / this.camera.zoomRatio;

        position.y += this.offsetY +
            (1 - this.camera.zoomRatio) * cc.director.getWinSize().height / 2;

        //如果方位超出范围，则移动回范围内
        if (position.x > cc.director.getWinSize().width * (globalConstant.sceneWidth) - width / 2) {
            position.x = cc.director.getWinSize().width * (globalConstant.sceneWidth) - width / 2;
        } else if (position.x < width / 2) {
            position.x = width / 2;
        }
        //双缓冲，先用position确定当前的位置
        //之后再做各种变换
        if (this.camera !== undefined) {
            //cc.log(position.x+"  "+this.areaRight);

            //如果允许跟随的话
            if(this.followFlag){
                var deltaX = (position.x - p.x);
                var deltaY = (position.y - p.y);
                var r = Math.sqrt(Math.pow(deltaX,2) +　Math.pow(deltaY,2));
                //cc.log(deltaX);
                var speed = cc.v2(
                    deltaX / (Math.sqrt(r)) * 0.9,
                    deltaY / (Math.sqrt(r)) * 0.9
                );
                //cc.log(deltaY);
                if(Math.abs(deltaX) >= 0.03)
                    p.x += speed.x;
                if(Math.abs(deltaY) >= 0.03)
                    p.y += speed.y;
            }
            //cc.log(position.x);
            if (p.x > cc.director.getWinSize().width * (globalConstant.sceneWidth) - width / 2) {
                this.node.x = cc.director.getWinSize().width * (globalConstant.sceneWidth) - width / 2;
            } else if (p.x < width / 2) {
                this.node.x = width / 2;//cc.director.getWinSize().width * globalConstant.sceneEdge;
            } else {
                this.node.x = p.x;
            }


            if(this._deltaWheel !== 0){
                this._mouseWheel += this._deltaWheel / 6;
                this._deltaWheel /= 2;
                this.deltaTimer ++;
                if(this.deltaTimer >= 200){
                    this.deltaTimer = 0;
                    this._deltaWheel = 0;
                }
            }

            if(Math.abs(this.cameraRatioTo - this.camera.zoomRatio) >= 0.01){
                globalConstant.cameraRatio = this.camera.zoomRatio = this.camera.zoomRatio +
                    (this.cameraRatioTo - this.camera.zoomRatio) / 20;
            }


            //var ratio = 1;//targetPos.y / cc.winSize.height;
            //如果是Y坐标跟随的话
            if (this.yFollow == true) {// + (0.5 - ratio) * 0.5
                //this.node.y = position.y + this.offsetY
            }else {

            }
            //globalConstant.cameraRatio = this.camera.zoomRatio = 1 -
            //    this._mouseWheel / this.mouseWheelMax / 3;
            if(this.followFlag) {
                this.node.y = p.y;
            }else{
                //this.node.y = position.y + this.offsetY +
                //    (1 - this.camera.zoomRatio) * cc.director.getWinSize().height / 2;
            }
            globalConstant.cameraPosition  = cc.v2(this.node.x, this.node.y);
        }
    }
});
