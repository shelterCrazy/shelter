
var Global = require('Global');
cc.Class({
    extends: cc.Component,

    properties: {
        //用户名的输入框
        userNameBox:cc.EditBox,
        //密码的输入框
        password1:cc.EditBox,
        //重复密码的输入框
        password2:cc.EditBox,
        //输入验证码的输入框
        codeBox:cc.EditBox,

        wrong1:cc.Label,

        wrong2:cc.Label,

        wrong3:cc.Label,

        wrong4:cc.Label,

        codeLabel:cc.Label,

        cameraComponent:cc.Component,

        registerNode:cc.Node,
        loginNode:cc.Node
    },

    // use this for initialization
    onLoad: function () {
        this.loginScript = this.loginNode.getComponent("LoginManager");

        this.userNameEnable = false;
        this.passwordEnable = false;
        this.passwordLengthEnable = false;
        this.verifyCodeEnable = false;
        this.nameReCheckFlag = false;
        this.answer = -1;
    },

    userNameInput:function(){
    var self = this;
        self.userNameEnable = checkUsername();

        function checkUsername() {
            var username = self.userNameBox.string;
            cc.log(self.userNameBox.string);
            if( username == "" || username == null ){
                changeUsernamePrompt( "请先填写用户名" );
                return false;
            }
            switch( isUsername( username ) ){
                case 0: break;
                case 1: {
                    //changeUsernamePrompt( "您选择的用户名‘"+username+"’格式不正确，用户名不能以数字开头" );
                    changeUsernamePrompt( "*格式不正确，用户名不能以数字开头" );
                    return false;
                }
                case 2: {
                    changeUsernamePrompt( "*字符长度有误，合法长度为2-20个字符" );
                    return false;
                }
                case 3: {
                    changeUsernamePrompt( "*含有非法字符，用户名只能包含_,英文字母，数字，中文" );
                    return false;
                }
                case 4: {
                    changeUsernamePrompt( "您选择的用户名‘"+username+"’格式不正确，用户名只能包含_,英文字母，数字" );
                    return true;
                }
            }
            self.nameReCheck(username);
            return true;
        }
        function changeUsernamePrompt(cnt){
            self.wrong1.string = cnt;
        }
        function isUsername( username ){
            if( /^\d.*$/.test( username ) ){
                return 1;
            }
            if(! /^.{2,20}$/.test( username ) ){
                return 2;
            }
            if(! /^[\u4E00-\u9FA5a-zA-Z0-9_]*$/.test( username ) ){
                return 3;
            }
            if(! /^([a-z]|[A-Z])[\w_]{5,19}$/.test( username ) ){
                return 4;
            }
            return 0;
        }

        if(self.userNameEnable === true){
            self.wrong1.string = "";
        }
    },

    /**
     * @主要功能 获取验证码
     * @author C14
     * @Date 2018/2/10
     * @parameters
     * @returns
     */
    getVerifyCode:function(){
        this.captcha();
    },

    inputVerifyCode:function(){
        if(parseInt(this.codeBox.string) === this.answer){
            this.verifyCodeEnable = true;
            this.wrong4.string = "";
        }else{
            this.verifyCodeEnable = false;
            this.wrong4.string = "验证码错误";
        }
    },

    judgePasswordLength:function(){

        this.wrong2.string = "";
        this.passwordLengthEnable = true;
        if(! /^[a-zA-Z0-9!@#$%^&*()_?<>{}]*$/.test( this.password1.string )){
            this.wrong2.string = "密码格式错误，密码混进了奇怪的东西";
            this.passwordLengthEnable = false;
        }
        if(! /^.{6,20}$/.test(this.password1.string) ){
            this.wrong2.string = "*密码长度有误，合法长度为6-20个字符";
            this.passwordLengthEnable = false;
        }
    },
    passwordInput:function(){
        var self = this;
        var password = this.password1.string;
        if(password !== null && password !== ""){
            if(this.password2.string !== password){
                self.wrong3.string = "密码不对吧";
                self.passwordEnable = false;
            }else{
                self.passwordEnable = true;
            }
        }
        if(! /^[a-zA-Z0-9!@#$%^&*()_?<>{}]*$/.test( this.password2.string )){
            self.wrong3.string = "密码格式错误，密码混进了奇怪的东西";
            self.passwordEnable = false;
        }
        if(self.passwordEnable === true){
            self.wrong3.string = "";
        }
    },



    registerSubmit:function(){
        if(this.userNameEnable === true &&
            this.passwordEnable === true &&
            this.passwordLengthEnable === true &&
            this.verifyCodeEnable === true &&
            this.nameReCheckFlag === true){

            this.sendMessage("注册中...",false);
            this.register();
        }
    },


    captcha:function(){
        var self = this;
        $.ajax({
            url: "/login/captcha",
            type: "GET",
            dataType: "json",
            data:null,
            success: function(rs){
                self.codeLabel.string = rs.x + " + " + rs.y + " = ?";
                self.answer = rs.x + rs.y;
                if(parseInt(self.codeBox.string) === self.answer){
                    self.verifyCodeEnable = true;
                    self.wrong4.string = "";
                }else{
                    self.verifyCodeEnable = false;
                    self.wrong4.string = "验证码错误";
                }
            },
            error: function(){
                cc.log("验证码获取失败");
            }
        });
    },

    nameReCheck:function(name) {
        var self = this;
        $.ajax({
            url: "/login/nameReCheck",
            type: "GET",
            dataType: "json",
            data: {"userName": name},
            success: function (rs) {
                if(rs.status == 200) {
                    if (rs.flag) {
                        self.nameReCheckFlag = true;
                    }else{
                        self.nameReCheckFlag = false;
                        self.wrong1.string = "用户名重复了";
                    }
                }else{
                    cc.log("校验失败");
                    dat = false;
                }
            },
            error: function () {

            }
        });
    },

    //提交
    register:function(){
    var self = this;
        $.ajax({
            url: "/login/register",
            type: "POST",
            dataType: "json",
            data: {"userName":self.userNameBox.string,"password":self.password1.string},
            success: function(rs){
                if(rs.status == 200){
                    cc.log("注册成功");
                    Global.userName = self.userNameBox.string;
                    Global.password = self.password1.string;
                    self.sendMessage("注册成功",true);
                    self.login();
                }else{
                    cc.log("注册失败");
                    self.sendMessage("注册失败",true);
                }
            },
            error: function(){
                cc.log("注册错误");
                self.sendMessage("注册错误",true);
            }
        });
    },
    login:function(){
        var self = this;
        self.sendMessage("登录中...",false);
        $.ajax({
            url: "/login",
            type: "GET",
            dataType: "json",
            data: {"userName":Global.userName,"password":Global.password},
            success: function(rs){
                if(rs !== null) {
                    cc.log("登录成功");
                    Global.userName = self.userNameBox.string;
                    Global.password = self.password1.string;
                    Global.loginFlag = true;
                    self.wrong2.string = "";
                    self.logSuccess();
                }else{
                    cc.log("登录失败");
                    self.sendMessage("登录失败",true);
                }
            },
            error: function(){
                cc.log("登录错误");
                self.sendMessage("登录错误",true);
            }
        });
    },
    sendMessage:function(message,dispear){
        var eventsend = new cc.Event.EventCustom('message',true);
        eventsend.setUserData({message:message,dispear:dispear});
        this.node.dispatchEvent(eventsend);
    },
    logSuccess:function(){
        //cc.log("发送");
        var eventsend = new cc.Event.EventCustom('logSuccess',true);
        eventsend.setUserData({});
        this.node.dispatchEvent(eventsend);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

