
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

        //url:"http://39.106.67.112:3000",
        //socket:null,
        //token:1,
        //userName:"kenan",
        //password:"123456",

        //registerNode:cc.Node,
        //loginNode:cc.Node
    },

    // use this for initialization
    onLoad: function () {
        var self = this;

        this.userNameEnable = false;
        this.passwordEnable = false;
        this.passwordLengthEnable = false;
        this.verifyCodeEnable = false;
        this.nameReCheckFlag = false;

        this.logSuccessFlag = null;
        //验证码用的回答
        this.answer = -1;

        var userLoginData = JSON.parse(cc.sys.localStorage.getItem('userLoginData'));
        if(userLoginData !== null && userLoginData !== undefined && userLoginData.usable === true){
            self.userNameBox.string = userLoginData.userName;
            self.password1.string = userLoginData.password;
            this.login();
        }
    },

    userNameInput:function(){
        var self = this;
        self.userNameEnable = checkUsername();

        function checkUsername() {
            var username = self.userNameBox.string;
            if( username == "" || username == null ){
                changeUsernamePrompt( "请先填写用户名" );
                return false;
            }
            if(! /^[\u4E00-\u9FA5a-zA-Z0-9_]*$/.test( username ) ){
                changeUsernamePrompt( "*用户名含有非法字符，只能包含_,英文字母，数字，中文" );
                return false;
            }
            self.nameReCheck(username);
            return true;
        }
        function changeUsernamePrompt(cnt){
            self.wrong1.string = cnt;
        }

        if(self.userNameEnable === true){
            self.wrong1.string = "";
        }
    },
    enterPassword:function(){
        this.wrong2.string = "";
        this.passwordLengthEnable = true;

        var password = this.password1.string;
        if(! /^[a-zA-Z0-9!@#$%^&*()_?<>{}]*$/.test( password )){
            this.wrong2.string = "密码格式错误，密码混进了奇怪的东西";
            this.passwordLengthEnable = false;
        }
        if(this.password1.string === "" || this.password1.string === null){
            this.wrong2.string = "请先输入密码";
            this.passwordLengthEnable = false;
        }
    },

    loginSubmit:function(){
        if(this.userNameEnable === true &&
            this.verifyCodeEnable === true &&
            this.nameReCheckFlag === false){

            this.login();
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
                        //不重复
                        self.nameReCheckFlag = true;
                        self.wrong1.string = "用户名不存在";
                    }else{
                        //重复
                        self.nameReCheckFlag = false;
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
    login:function(){
        var self = this;
        self.sendMessage("登录中...",false);
        setTimeout(function(){
            if(self.logSuccessFlag === null) {
                var userLoginData = {
                    userName: "",
                    password: "",
                    usable: false
                };
                cc.sys.localStorage.setItem('userLoginData', JSON.stringify(userData));
                self.sendMessage("登录超时",true);
            }
            self.logSuccessFlag = null;
        },2000);
        $.ajax({
            url: "/login",
            type: "GET",
            dataType: "json",
            data: {"userName":self.userNameBox.string,"password":self.password1.string},
            success: function(rs){
                if(rs !== null) {
                    cc.log("登录成功");
                    Global.userName = self.userNameBox.string;
                    Global.password = self.password1.string;
                    self.wrong2.string = "";
                    self.logSuccessFlag = true;
                    self.logSuccess();
                }else{
                    cc.log("登录失败");
                    self.wrong2.string = "请检查用户名与密码是否正确";
                    self.logSuccessFlag = false;
                    self.sendMessage("登录失败",true);
                }
            },
            error: function(){
                cc.log("登录错误");
                self.sendMessage("登录错误",true);
                self.logSuccessFlag = false;
                self.wrong2.string = "请检查用户名与密码是否正确";
            }
        });
    },

    sendMessage:function(message,dispear){
        var eventsend = new cc.Event.EventCustom('message',true);
        eventsend.setUserData({message:message,dispear:dispear});
        this.node.dispatchEvent(eventsend);
    },
    logSuccess:function(){

        var eventsend = new cc.Event.EventCustom('logSuccess',true);
        eventsend.setUserData({});
        this.node.dispatchEvent(eventsend);

        var userData = {
            userName: Global.userName,
            password: Global.password,
            usable: true
        };
        cc.sys.localStorage.setItem('userLoginData', JSON.stringify(userData));
    }
});

