var NetworkModule = {
    token:1,
    //39.106.67.112
    url:"http://111.230.42.175:3000",
    socket:null,
    initFlag:false,
    loadManager: function (managerScript) {
        this.manager = managerScript;
    },
    getGlobal:function(global){
        this.Global = global;
    },
    init: function () {
        if(this.initFlag === false) {
            this.initFlag = true;
            //this.Global = require("Global");
            //this.edit = this.editBoxNode.getComponent(cc.EditBox);
            var self = this;
            var msgType = {
                login: 0,        //登陆操作
                joinRoom: 1,     //申请room操作
                leaveRoom: 2,    //离开房间
                match: 3     //匹配
            };
            this.socket = io.connect(this.url + "/index");
            this.start = function () {

                this.socket.on('loginResult', function (data) {
                    cc.log('loginResult:' + data.msg + " results:" + data.results);
                    //cc.log(data.results);
                    this.Global.token = data.results;
                    this.Global.loginFlag = true;
                    //this.roomMsg('roomChat','  do you like me?');
                }.bind(this));
                //错误
                this.socket.on('error', function (error) {
                    console.log('error:' + error);
                }.bind(this));
                //断开
                this.socket.on('disconnect', function () {
                    cc.log('disconnect');
                }.bind(this));
                //重新连接
                this.socket.on('reconnect', function () {
                    cc.log('reconnect');
                    //if (this.userName != null && this.userName.length > 0) {
                    //    this.start();
                    //    this.login();
                    //}
                }.bind(this));
                //重新连接错误
                this.socket.on('reconnect_error', function () {
                    cc.log('reconnect_error');
                });
                //接收到消息
                this.socket.on('msg', function (data) {
                    cc.log('msg:' + data.msg);
                });
                //操作类反馈消息监听
                this.socket.on('controlMsg', function (data) {
                    cc.log('controlMsg, type:' + data.type + ' msg:' + data.msg);
                    switch (data.type) {
                        //登陆
                        case msgType.login:
                            if (data.status == msgEnum.fail || data.status == msgEnum.error) { //登陆错误重新尝试
                                setTimeout(login(), 1000); //1秒间隔
                            }
                            break;
                        //room操作
                        case msgType.joinRoom:
                            if (data.status == msgEnum.fail || data.status == msgEnum.error) {
                                setTimeout(join(), 1000); //1秒间隔
                            } else {
                                //type: roomChat 普通聊天 roomHit 战斗房间
                                if (data.type == 'roomChat') {
                                    talkRoom = data.room;
                                } else if (data.type == 'roomHit') {
                                    fightRoom = data.room;
                                }
                            }
                            break;
                        default:
                            console.log("default  type:" + data.type);
                    }
                }.bind(this));
                this.socket.on('roomChat', function (data) {
                    cc.log(data.msg);
                    switch (data.msg.name) {
                        case "creatureCreate":
                            this.manager.creatureCreateNetwork(data.msg.detail);
                            break;
                        case "magicCreate":
                            this.manager.magicCreateNetwork(data.msg.detail);
                            break;
                        case "chantCreate":
                            this.manager.chantCreateNetwork(data.msg.detail);
                            break;
                        //case "heroDeath":this.manager.heroDeathDetail(data.msg.detail);break;
                        case "enemyMove":
                            this.manager.changeEnemyMove(data.msg.detail);
                            break;
                        case "enemyJump":
                            this.manager.changeEnemyJump(data.msg.detail);
                            break;
                        case "message":
                            this.messageLabel.string = data.msg.detail;
                            break;
                        case "enemyAttack":
                            this.manager.changeEnemyAttack(data.msg.detail);
                            break;
                        case "rand":
                            //比大小确定自己的队伍
                            if (this.randNum > data.msg.num) {
                                this.Global.nowTeam = -1;
                            } else {
                                this.Global.nowTeam = 1;
                            }
                            //进入战斗界面
                            this.Global.mainStart = true;
                            cc.director.loadScene('game');
                            break;
                    }
                }.bind(this));

                //匹配产生结果
                this.socket.on('matchMsg', function (data) {
                    if (data.status == 200) {
                        //this.messageLabel.string = data.room;
                        //获取房间号
                        this.Global.room = data.room;
                        cc.log(this.room);
                        //生成一个随机数，用于大小比较，以判别英雄的左右
                        this.randNum = Math.random();
                        //发送消息
                        setTimeout(function () {
                            this.roomMsg(data.room, 'roomChat', "init");
                        }.bind(this), 200);
                        //发送随机数过去
                        setTimeout(function () {
                            this.roomMsg(data.room, 'roomChat', {"name": "rand", num: this.randNum});
                        }.bind(this), 500);
                    } else {
                        cc.log("match失败 msg:" + data.msg);
                    }
                }.bind(this));
            };
            this.start();
            this.login();
        }
    },

    match:function(){
        cc.log("matching");
        setTimeout(function(){
            this.socket.emit('match', {'token':this.Global.token});
        }.bind(this),2000);
    },
    joinRoom:function(){
        this.joinMsg('roomChat', this.Global.room);
        cc.log("this.joinMsg('roomChat', data.room);  " + this.Global.room);
    },
    broadcastMsg:function(msg){
        this.socket.emit('broadcastMsg', {'msg': msg, 'token':this.Global.token});
    },
    //登录，账号密码登录socket
    login:function(){
        this.socket.emit('login', {'userName':this.Global.userName,'password':this.Global.password});
    },
    //room聊天  可以先用joinMsg 申请一个房间   然后再用roomMsg发送消息
    roomMsg:function(room, type, msg){
        this.socket.emit('room', {'type':type, 'room':room, 'msg':msg, 'token':this.Global.token});
    },
    //普通消息测试  私聊
    msg:function(msg,id){
        this.socket.emit('msg', {'msg': msg, 'id':id, 'token':this.Global.token});
    },
    //申请room聊天室聊天  type: roomChat普通聊天 roomHit战斗房间/战斗申请
    joinMsg:function(type, room){
        this.socket.emit('join',{'type':type, 'room':room, 'token':this.Global.token});
    },
    //退出room
    endRoom:function(room){
        this.socket.emit('leave', {'room':room, 'leaveFlag':true, 'token':this.Global.token});
    }
};
/*
cc.Class({
    extends: cc.Component,

    properties: {
        label:cc.Label,
        //CEO的url:"http://39.106.67.112:3000",
        //本地服务器：http://localhost:3000
        url:"http://39.106.67.112:3000",
        socket:null,
        token:1,
        userName:"kenan",
        password:"123456",
        //????????????????????
        sign:0,

        manager:cc.Script,

        editBoxNode:cc.Node,

        messageLabel:cc.Label,
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

        //this.edit = this.editBoxNode.getComponent(cc.EditBox);
        this.manager = this.node.getComponent("MainGameManager");
        var self = this;
        var msgType= {
            login:0,        //登陆操作
            joinRoom:1,     //申请room操作
            leaveRoom:2,    //离开房间
            match:3     //匹配
        };

        if(this.loginFlag === false) {
            this.socket = io.connect(this.url + "/index");
        }
        this.start = function(){

            this.socket.on('loginResult', function(data){
                cc.log('loginResult:' + data.msg + " results:" + data.results);
                //cc.log(data.results);
                this.token = data.results;
                this.token = this.token;
                this.loginFlag = true;
                //this.roomMsg('roomChat','  do you like me?');
            }.bind(this));
            //????????
            this.socket.on('error', function(error){
                console.log('error:' + error);
            }.bind(this));
            //????????
            this.socket.on('disconnect', function(){
                //if (this.userName != null && this.userName.length > 0) {
                    //this.login();
                    //this.roomMsg('roomChat','  do you like me?');
                //}
                cc.log('disconnect');
            }.bind(this));
            //????????
            this.socket.on('reconnect', function () {
                cc.log('reconnect');
                //if (this.userName != null && this.userName.length > 0) {
                //    this.start();
                //    this.login();
                //}
            }.bind(this));
            //????????
            this.socket.on('reconnect_error', function () {
                cc.log('reconnect_error');
            });
            //?????????
            this.socket.on('msg', function(data){
                cc.log('msg:' + data.msg);
            });
            //操作类反馈消息监听
            this.socket.on('controlMsg', function(data){
                cc.log('controlMsg, type:' + data.type + ' msg:' + data.msg);
                switch (data.type){
                    //登陆
                    case msgType.login:
                        if(data.status == msgEnum.fail || data.status == msgEnum.error){ //登陆错误重新尝试
                            setTimeout(login(),1000); //1秒间隔
                        }
                        break;
                    //room操作
                    case msgType.joinRoom:
                        if(data.status == msgEnum.fail || data.status == msgEnum.error){
                            setTimeout(join(),1000); //1秒间隔
                        }else{
                            //type: roomChat 普通聊天 roomHit 战斗房间
                            if(data.type == 'roomChat'){
                                talkRoom = data.room;
                            }else if(data.type == 'roomHit'){
                                fightRoom = data.room;
                            }
                        }
                        break;
                    default:
                        console.log("default  type:" + data.type);
                }
            }.bind(this));
            this.socket.on('roomChat', function(data){
                cc.log(data.msg);
                switch(data.msg.name){
                    case "creatureCreate":this.manager.creatureCreateNetwork(data.msg.detail);break;
                    case "magicCreate":this.manager.magicCreateNetwork(data.msg.detail);break;
                    case "chantCreate":this.manager.chantCreateNetwork(data.msg.detail);break;
                    //case "heroDeath":this.manager.heroDeathDetail(data.msg.detail);break;
                    case "enemyMove":this.manager.changeEnemyMove(data.msg.detail);break;
                    case "enemyJump":this.manager.changeEnemyJump(data.msg.detail);break;
                    case "message":this.messageLabel.string = data.msg.detail;break;
                    case "enemyAttack":this.manager.changeEnemyAttack(data.msg.detail);break;
                    case "rand":
                        //比大小确定自己的队伍
                        if(this.randNum > data.msg.num){
                            this.nowTeam = - 1;
                        }else{
                            this.nowTeam = 1;
                        }
                        //进入战斗界面
                        this.mainStart = true;
                        cc.director.loadScene('game');break;
                }
            }.bind(this));
            //匹配结果
            this.socket.on('matchMsg', function(data){
                if(data.status == 200){
                    this.messageLabel.string = data.room;
                    this.room = data.room;
                    this.room = data.room;
                    //生成一个随机数，用于大小比较，来判别英雄的左右
                    this.randNum = Math.random();
                    //发送消息
                    setTimeout(function(){
                        this.roomMsg(data.room, 'roomChat', "init");
                    }.bind(this),200);
                    //发送随机数过去
                    setTimeout(function(){
                        this.roomMsg(data.room, 'roomChat', {"name":"rand",num:this.randNum});
                    }.bind(this),500);
                }else{
                    cc.log("match失败 msg:" + data.msg);
                }
            }.bind(this));
        };

        if(this.loginFlag === false){
            this.start();
            this.login();
        }
    },

    match:function(){
        setTimeout(function(){
            this.socket.emit('match', {'token':this.token});
        }.bind(this),2000);
    },
    joinRoom:function(){
        this.joinMsg('roomChat', this.room);
        cc.log("this.joinMsg('roomChat', data.room);  " + this.room);
    },
    broadcastMsg:function(msg){
        this.socket.emit('broadcastMsg', {'msg': msg, 'token':this.token});
    },
    //????????  ???????   ??????? kenan : 123456
    login:function(){
        this.socket.emit('login', {'userName':this.userName,'password':this.password});
    },
    //room聊天  可以先用joinMsg 申请一个房间   然后再用roomMsg发送消息
    roomMsg:function(room, type, msg){
        this.socket.emit('room', {'type':type, 'room':room, 'msg':msg, 'token':this.token});
        //cc.log("send message");
    },
    //普通消息测试  私聊
    msg:function(msg,id){
        this.socket.emit('msg', {'msg': msg, 'id':id, 'token':this.token});
    },
    
    //申请room聊天室聊天  type: roomChat普通聊天 roomHit战斗房间/战斗申请
    joinMsg:function(type, room){
        this.socket.emit('join',{'type':type, 'room':room, 'token':this.token});
    },
    //退出room
    endRoom:function(room){
        this.socket.emit('leave', {'room':room, 'leaveFlag':true, 'token':this.token});
    }
});*/
