cc.Class({
    extends: cc.Component,

    properties: {
        label:cc.Label,
        //editBox:cc.Node,
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
        cc.log(this.manager);

        //????????  ???????   ??????? kenan : 123456
        this.login = function(){
            this.socket.emit('login', {'userName':this.userName,'password':this.password});
        };
        //?????  ???room  ??????????
        this.broadcastMsg = function(msg){
            this.socket.emit('broadcastMsg', {'msg': msg, 'token':this.token});
        };
        //room??????????
        this.roomMsg = function(room, msg){
            this.socket.emit('room', {'room':room, 'msg':msg, 'token':this.token});
            cc.log("send message");
        };
        //??????????
        this.msg = function(msg,id){
            this.socket.emit('msg', {'msg': msg, 'id':id, 'token':this.token});
        };



        this.start = function(){
            this.socket = io.connect(this.url+"/index");
            var token = this.token;
            var self = this;
            //???????????
            this.socket.on('loginResult', function(data){
                console.log('loginResult:' + data.msg + " results:" + data.results);
                token = data.results;
                self.roomMsg('roomChat','  do you like me?');
            });
            //????????
            this.socket.on('error', function(error){
                console.log('error:' + error);
            });
            //????????
            this.socket.on('disconnect', function(){
                if (self.userName != null && self.userName.length > 0) {
                    login();
                    //self.roomMsg('roomChat','  do you like me?');
                }
                console.log('disconnect');
            });
            //????????
            this.socket.on('reconnect', function () {
                log('reconnect');
                if (this.userName != null && this.userName.length > 0) {
                    self.login();
                }
            });
            //????????
            this.socket.on('reconnect_error', function () {
                log('reconnect_error');
            });
            //?????????
            this.socket.on('msg', function(data){
                console.log('msg' + data.msg);
            });
            //room????
            this.socket.on('roomChat', function(data){
                cc.log(data.msg.name);
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
                }
            });
        };


        this.start();
        this.login();

    },

     //sendMessage:function() {
     //    //room??????????
     //    var socket = this.socket;
     //    var roomMsg = function (room, msg) {
     //        socket.emit('room', {'room': room, 'msg': msg, 'token': 1});
     //    };
     //
     //    roomMsg('roomChat', {name:"message",detail:this.edit.string});
     //}
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    //onLoad: function () {
    //    var url = "http://39.106.67.112:3000";
    //    var socket;
    //    var token;
    //    var userName = "kenan";
    //    var password = "123456";
    //    var label = this.label;
    //
    //    this.edit = this.editBox.getComponent(cc.EditBox);
    //
    //    //????????  ???????   ??????? kenan : 123456
    //    this.login = function(){
    //        socket.emit('login', {'userName':userName,'password':password});
    //    };
    //    //?????  ???room  ??????????
    //    this.broadcastMsg = function(msg){
    //        socket.emit('broadcastMsg', {'msg': msg, 'token':token});
    //    };
    //    //room??????????
    //    this.roomMsg = function(room, msg){
    //        socket.emit('room', {'room':room, 'msg':msg, 'token':token});
    //        cc.log("send message");
    //    };
    //    //??????????
    //    this.msg = function(msg,id){
    //        socket.emit('msg', {'msg': msg, 'id':id, 'token':token});
    //    };
    //
    //
    //
    //    this.start = function(){
    //        socket = io.connect(url+"/index");
    //        cc.log("start");
    //        //???????????
    //        socket.on('loginResult', function(data){
    //            console.log('loginResult:' + data.msg + " results:" + data.results);
    //            token = data.results;
    //            roomMsg('roomChat','  do you like me?');
    //        });
    //        //????????
    //        socket.on('error', function(error){
    //            console.log('error:' + error);
    //        });
    //        //????????
    //        socket.on('disconnect', function(){
    //            console.log('disconnect');
    //        });
    //        //????????
    //        socket.on('reconnect', function () {
    //            log('reconnect');
    //            if (userName != null && userName.length > 0) {
    //                login();
    //            }
    //        });
    //        //????????
    //        socket.on('reconnect_error', function () {
    //            log('reconnect_error');
    //        });
    //        //?????????
    //        socket.on('msg', function(data){
    //            console.log('msg' + data.msg);
    //        });
    //        //room????
    //        socket.on('roomChat', function(data){
    //            label.string = data.msg;
    //            console.log('msg' + data.msg);
    //        });
    //    };
    //
    //
    //    this.start();
    //    this.login();
    //
    //},
});
