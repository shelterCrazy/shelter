/**
cc.Class({
    extends: cc.Component,

    properties: {
        //用于去更随用的对象
        camera:cc.Node,
        //现在的镜头
        viewField:cc.Node,

        hero:cc.Node,

        viewObject:cc.Node,

        backRoll:cc.Node,
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
        var self = this;
        self.camera = self.hero;
        self.backRollScript = self.backRoll.getComponent("BackRoll");

        self.node.on(cc.Node.EventType.MOUSE_DOWN, self.startListen, self);

        self.node.on(cc.Node.EventType.MOUSE_UP, self.endListen, self);
    },

    startListen:function(event){
        var self = this;
        self.viewObject.x = ((event.getLocationX() - (self.node.parent.x + cc.director.getWinSize().width / 2))
        / 440
        * (cc.director.getWinSize().width * 3));

        if(self.viewObject.x > cc.director.getWinSize().width * 2.5){
            self.viewObject.x = cc.director.getWinSize().width * 2.5;
        }else if(self.viewObject.x < cc.director.getWinSize().width / 2){
            self.viewObject.x = cc.director.getWinSize().width / 2;
        }

        self.camera = self.viewObject;
        self.backRollScript.follow = self.backRollScript.camera;

        self.node.on(cc.Node.EventType.MOUSE_MOVE, self.moveListen, self);
    },
    moveListen:function(event){
        var self = this;
        self.viewObject.x = ((event.getLocationX() - (self.node.parent.x + cc.director.getWinSize().width / 2))
        / 440
        * (cc.director.getWinSize().width * 3));
        if(self.viewObject.x > cc.director.getWinSize().width * 2.5){
            self.viewObject.x = cc.director.getWinSize().width * 2.5;
        }else if(self.viewObject.x < cc.director.getWinSize().width / 2){
            self.viewObject.x = cc.director.getWinSize().width / 2;
        }
        self.camera = self.viewObject;
        self.backRollScript.follow = self.backRollScript.camera;
    },
    endListen:function(event){
        var self = this;
        self.node.off(cc.Node.EventType.MOUSE_MOVE, self.moveListen, self);
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
            this.camera = this.backRollScript.follow;
            if(this.camera.x > cc.director.getWinSize().width * 2.5){
                this.viewField.x = (cc.director.getWinSize().width * 2.5) / (cc.director.getWinSize().width * 3) * 440;
            }else if(this.camera.x < cc.director.getWinSize().width / 2){
                this.viewField.x = (cc.director.getWinSize().width / 2) / (cc.director.getWinSize().width * 3) * 440;
            }else {
                this.viewField.x = this.camera.x / (cc.director.getWinSize().width * 3) * 440;
            }
    },
});*/
var globalConstant = require("Constant");
cc.Class({
    extends: cc.Component,

    properties: {
        //用于去更随用的对象
        camera:cc.Node,

        //小地图上面显示的范围方框
        viewField:cc.Node,

        hero:cc.Node,
        //用于跟随的物体
        viewObject:cc.Node,

        cameraControl:cc.Node,

        targets:[cc.Node],
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
        var self = this;
        self.camera = self.hero;
        self.cameraControlScript = self.cameraControl.getComponent("CameraControl");

        self.node.on(cc.Node.EventType.MOUSE_DOWN, self.startListen, self);

        self.node.on(cc.Node.EventType.MOUSE_UP, self.endListen, self);

    },

    startListen:function(event){
        var self = this;
        //self.viewObject.x = ((event.getLocationX() - (self.node.parent.x + cc.director.getWinSize().width * globalConstant.sceneEdge))
        /// 440
        //* (cc.director.getWinSize().width * globalConstant.sceneWidth));
        self.viewObject.x = ((event.getLocationX() - (self.node.parent.x + cc.director.getWinSize().width * globalConstant.sceneEdge))
        / 440
        * (cc.director.getWinSize().width * globalConstant.sceneWidth));

        if(self.viewObject.x > cc.director.getWinSize().width * (globalConstant.sceneWidth - globalConstant.sceneEdge)){
            self.viewObject.x = cc.director.getWinSize().width * (globalConstant.sceneWidth - globalConstant.sceneEdge);
        }else if(self.viewObject.x < cc.director.getWinSize().width * globalConstant.sceneEdge){
            self.viewObject.x = cc.director.getWinSize().width * globalConstant.sceneEdge;
        }

        self.cameraControlScript.target = self.cameraControlScript.targets[1];

        self.node.on(cc.Node.EventType.MOUSE_MOVE, self.moveListen, self);
    },
    moveListen:function(event){
        var self = this;
        self.viewObject.x = ((event.getLocationX() - (self.node.parent.x + cc.director.getWinSize().width * globalConstant.sceneEdge))
        / 440
        * (cc.director.getWinSize().width * globalConstant.sceneWidth));

        if(self.viewObject.x > cc.director.getWinSize().width * (globalConstant.sceneWidth - globalConstant.sceneEdge)){
            self.viewObject.x = cc.director.getWinSize().width * (globalConstant.sceneWidth - globalConstant.sceneEdge);
        }else if(self.viewObject.x < cc.director.getWinSize().width * globalConstant.sceneEdge){
            self.viewObject.x = cc.director.getWinSize().width * globalConstant.sceneEdge;
        }

        self.cameraControlScript.target = self.cameraControlScript.targets[1];
    },
    endListen:function(event){
        var self = this;
        self.node.off(cc.Node.EventType.MOUSE_MOVE, self.moveListen, self);
    },
    // called every frame, uncomment this function to activate update callback
    lateUpdate: function (dt) {
        //this.viewObject.x = this.backRollScript.follow;


        if(this.cameraControl.x >= cc.director.getWinSize().width * (globalConstant.sceneWidth - globalConstant.sceneEdge)){
            //this.viewField.x = (cc.director.getWinSize().width * (globalConstant.sceneWidth - globalConstant.sceneEdge))
            //    / (cc.director.getWinSize().width * globalConstant.sceneWidth) * 440;
            globalConstant.cameraOffset = cc.director.getWinSize().width * (globalConstant.sceneWidth - 1);
        }else if(this.cameraControl.x <= cc.director.getWinSize().width * globalConstant.sceneEdge){
            //this.viewField.x = (cc.director.getWinSize().width * globalConstant.sceneEdge)
            //    / (cc.director.getWinSize().width * globalConstant.sceneWidth) * 440;
            globalConstant.cameraOffset = 0;
        }else {
            //this.viewField.x = this.cameraControlScript.target.x / (cc.director.getWinSize().width * globalConstant.sceneWidth) * 440;
            globalConstant.cameraOffset = this.cameraControlScript.target.x - cc.director.getWinSize().width / 2;
        }
        this.viewField.x = this.cameraControl.x / (cc.director.getWinSize().width * globalConstant.sceneWidth) * 440;
    },
});
