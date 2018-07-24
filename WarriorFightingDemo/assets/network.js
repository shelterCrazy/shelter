var Global = require("Global");

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
        this.socket = io.connect(this.url+"/index");
        this.start = function(){
            
            //this.socket = io.connect(this.url+"/index");
            //var token = this.token;
            
            //???????????
            self.socket.on('loginResult', function(data){
                cc.log('loginResult:' + data.msg + " results:" + data.results);
                //cc.log(data.results);
                self.token = data.results;
                //self.roomMsg('roomChat','  do you like me?');
            });
            //????????
            self.socket.on('error', function(error){
                console.log('error:' + error);
            });
            //????????
            self.socket.on('disconnect', function(){
                //if (self.userName != null && self.userName.length > 0) {
                    //self.login();
                    //self.roomMsg('roomChat','  do you like me?');
                //}
                cc.log('disconnect');
            });
            //????????
            self.socket.on('reconnect', function () {
                cc.log('reconnect');
                if (this.userName != null && this.userName.length > 0) {
                    self.start();
                    self.login();
                }
            });
            //????????
            self.socket.on('reconnect_error', function () {
                cc.log('reconnect_error');
            });
            //?????????
            self.socket.on('msg', function(data){
                cc.log('msg:' + data.msg);
            });
            //操作类反馈消息监听
            self.socket.on('controlMsg', function(data){
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
            });
            self.socket.on('roomChat', function(data){
                cc.log(data.msg);
                if(data.msg.name === "creatureCreate"){
                    self.manager.creatureCreateNetwork(data.msg.detail);
                }else if(data.msg.name === "magicCreate"){
                    self.manager.magicCreateNetwork(data.msg.detail);
                }else if(data.msg.name === "chantCreate"){
                    self.manager.chantCreateNetwork(data.msg.detail);
                }else if(data.msg.name === "heroDeath"){
                    //self.manager.heroDeathDetail(data.msg.detail);
                }else if(data.msg.name === "enemyMove"){
                    self.manager.changeEnemyMove(data.msg.detail);
                }else if(data.msg.name === "enemyJump"){
                    self.manager.changeEnemyJump(data.msg.detail);
                }else if(data.msg.name === "message"){
                    self.messageLabel.string = data.msg.detail;
                }else if(data.msg.name === "enemyAttack"){
                    self.manager.changeEnemyAttack(data.msg.detail);
                }
            });
            //匹配结果
            self.socket.on('matchMsg', function(data){
                if(data.status == 200){
                    cc.log("match成功 room:");
                    self.messageLabel.string = data.room;
                    self.room = data.room;
                    cc.log(data.room);
                    //setTimeout(function() {
                    //    self.roomMsg(data.room + '', "匹配成功了解一下", 'roomChat');
                    //    cc.log("self.roomMsg(room.toString(), '匹配成功了解一下'', 'roomChat');   " + data.room);
                    //},4000);
                }else{
                    cc.log("match失败 msg:" + data.msg);
                }
            });
        };
        
        
        setTimeout(function(){
            //self.start();
            //self.login();
        },1000);
        
        
        
        //this.match();
    },

    match:function(){
        var self = this;
        this.start();
        this.login();
        setTimeout(function(){
            self.socket.emit('match', {'token':self.token});
        },2000);
    },
    joinRoom:function(){
        this.joinMsg('roomChat', this.room + "");
        cc.log("self.joinMsg('roomChat', data.room);  " + this.room);
    },
    joinRoomAndMessage:function(){
        this.roomMsg(this.room + "", "匹配成功了解一下", 'roomChat');
        cc.log("self.roomMsg(room + '', '匹配成功了解一下'', 'roomChat');   " + this.room);
    },


    broadcastMsg:function(msg){
        this.socket.emit('broadcastMsg', {'msg': msg, 'token':this.token});
    },
    //????????  ???????   ??????? kenan : 123456
    login:function(){
        this.socket.emit('login', {'userName':this.userName,'password':this.password});
    },
    //room聊天  可以先用joinMsg 申请一个房间   然后再用roomMsg发送消息
    roomMsg:function(room, msg, type){
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
});
