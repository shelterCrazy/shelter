
var Global = require('Global');
cc.Class({
    extends: cc.Component,

    properties: {

        labelNode:cc.Node,

        cameraComponent:cc.Component,

        registerNode:cc.Node,

        loginNode:cc.Node,

        label:cc.Label,

        body:cc.Node,

        messageTime:1
    },

    // use this for initialization
    onLoad: function () {
        //this.cameraComponent = this.cameraComponent.getComponent("CameraControl");
        if(Global.loginFlag === true){
            this.cameraComponent.moveTarget(0, 1, 0);
            this.cameraComponent.followTarget(0, 1);
            this.node.active = false;
        }
        //登录报告事件
        this.node.on('message',this.message,this);
        //登录成功
        this.node.on('logSuccess',this.logSuccess,this);
    },

    logout:function(){
        var self = this;
        this.loginNode.getComponent("LoginManager").userNameBox.string = "";
        this.loginNode.getComponent("LoginManager").password1.string = "";
        Global.loginFlag = false;
        this.loginNode.getComponent("LoginManager").logSuccessFlag = false;
        //this.labelNode.removeAction();
        self.node.opacity = 0;
        this.body.active = true;
        self.node.active = true;
        self.labelNode.active = false;
        this.node.runAction(
            //cc.sequence(
                cc.fadeIn(self.messageTime).easing(cc.easeCubicActionOut())
            //)
        )
        //$.ajax({
        //    url: "/logout",
        //    type: "GET",
        //    dataType: "json",
        //    data: {"token":200},
        //    success: function(rs){
        //
        //    }
        //});
    },
    logSuccess:function(){
        var self = this;
        this.labelNode.active = true;
        this.label.string = "登录成功";
        self.node.runAction(
            cc.sequence(
                cc.fadeOut(self.messageTime).easing(cc.easeCubicActionIn()),
                cc.callFunc(function(){
                    self.node.active = false;
                },this)
            )
        )
        //this.labelNode.removeAction();
        this.labelNode.runAction(
            cc.sequence(
                cc.fadeOut(self.messageTime).easing(cc.easeCubicActionIn()),
                cc.callFunc(function(){
                    self.labelNode.active = false;
                    self.moveCamera();
                },this)
            )
        )
    },
    moveCamera:function() {
        this.body.active = false;
        this.cameraComponent.moveTarget(0, 1, 4);
        setTimeout(function(){
            this.cameraComponent.followTarget(0, 1);
        }.bind(this),4000);
    },
    message:function(e){
        var self = this;
        this.labelNode.active = true;
        this.label.string = e.detail.message;
        if(e.detail.dispear === true){
            //this.labelNode.removeAction();
            this.labelNode.runAction(
                cc.sequence(
                    cc.fadeIn(self.messageTime).easing(cc.easeCubicActionOut()),
                    cc.fadeOut(self.messageTime).easing(cc.easeCubicActionIn()),
                    cc.callFunc(function(){
                        this.labelNode.active = false;
                    },this)
                )
            )
        }else{
            this.labelNode.runAction(
                cc.fadeIn(self.messageTime).easing(cc.easeCubicActionOut())
            )
        }
    },
    openRegisterPanel:function(){
        this.registerNode.active = true;
        this.loginNode.active = false;
    },
    openLoginPanel:function(){
        this.registerNode.active = false;
        this.loginNode.active = true;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});


