cc.Class({
    extends: cc.Component,

    properties: {
        label:cc.Label,
        editBox:cc.Node,
        url:"http://39.106.67.112:3000",
        socket:null,
        token:1,
        userName:"kenan",
        password:"123456",
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


        this.edit = this.editBox.getComponent(cc.EditBox);

        //初始化页面  登陆访问   测试账户 kenan : 123456
        this.login = function(){
            this.socket.emit('login', {'userName':this.userName,'password':this.password});
        };
        //默认空间  默认room  普通消息测试
        this.broadcastMsg = function(msg){
            this.socket.emit('broadcastMsg', {'msg': msg, 'token':this.token});
        };
        //room聊天室聊天
        this.roomMsg = function(room, msg){
            this.socket.emit('room', {'room':room, 'msg':msg, 'token':this.token});
            cc.log("send message");
        };
        //普通消息测试
        this.msg = function(msg,id){
            this.socket.emit('msg', {'msg': msg, 'id':id, 'token':this.token});
        };



        this.start = function(){
            this.socket = io.connect(this.url+"/index");
            var token = this.token;
            var self = this;
            //登陆结果处理
            this.socket.on('loginResult', function(data){
                console.log('loginResult:' + data.msg + " results:" + data.results);
                token = data.results;
                self.roomMsg('roomChat','  do you like me?');
            });
            //错误处理
            this.socket.on('error', function(error){
                console.log('error:' + error);
            });
            //链接已关闭
            this.socket.on('disconnect', function(){
                console.log('disconnect');
            });
            //重新链接
            this.socket.on('reconnect', function () {
                log('reconnect');
                if (this.userName != null && this.userName.length > 0) {
                    self.login();
                }
            });
            //重连错误
            this.socket.on('reconnect_error', function () {
                log('reconnect_error');
            });
            //广播消息测试
            this.socket.on('msg', function(data){
                console.log('msg' + data.msg);
            });
            //room聊天
            this.socket.on('roomChat', function(data){
                self.label.string = data.msg;
                console.log('msg' + data.msg);
            });
        };


        this.start();
        this.login();

    },

    sendMessage:function() {
        //room聊天室聊天
        var socket = this.socket;
        var roomMsg = function (room, msg) {
            socket.emit('room', {'room': room, 'msg': msg, 'token': 1});
        };

        roomMsg('roomChat', this.edit.string);
    }
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
    //    //初始化页面  登陆访问   测试账户 kenan : 123456
    //    this.login = function(){
    //        socket.emit('login', {'userName':userName,'password':password});
    //    };
    //    //默认空间  默认room  普通消息测试
    //    this.broadcastMsg = function(msg){
    //        socket.emit('broadcastMsg', {'msg': msg, 'token':token});
    //    };
    //    //room聊天室聊天
    //    this.roomMsg = function(room, msg){
    //        socket.emit('room', {'room':room, 'msg':msg, 'token':token});
    //        cc.log("send message");
    //    };
    //    //普通消息测试
    //    this.msg = function(msg,id){
    //        socket.emit('msg', {'msg': msg, 'id':id, 'token':token});
    //    };
    //
    //
    //
    //    this.start = function(){
    //        socket = io.connect(url+"/index");
    //        cc.log("start");
    //        //登陆结果处理
    //        socket.on('loginResult', function(data){
    //            console.log('loginResult:' + data.msg + " results:" + data.results);
    //            token = data.results;
    //            roomMsg('roomChat','  do you like me?');
    //        });
    //        //错误处理
    //        socket.on('error', function(error){
    //            console.log('error:' + error);
    //        });
    //        //链接已关闭
    //        socket.on('disconnect', function(){
    //            console.log('disconnect');
    //        });
    //        //重新链接
    //        socket.on('reconnect', function () {
    //            log('reconnect');
    //            if (userName != null && userName.length > 0) {
    //                login();
    //            }
    //        });
    //        //重连错误
    //        socket.on('reconnect_error', function () {
    //            log('reconnect_error');
    //        });
    //        //广播消息测试
    //        socket.on('msg', function(data){
    //            console.log('msg' + data.msg);
    //        });
    //        //room聊天
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
