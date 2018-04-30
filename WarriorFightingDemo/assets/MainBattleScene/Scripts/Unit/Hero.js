var globalConstant = require("Constant");

cc.Class({
    extends: cc.Component,

    properties: {

        //自我
        self:true,
        //是否使AI
        ai:false,
        //能否移动
        movable:true,

        drawCardNode:cc.Node,
        //英雄的手牌
        handCard:[cc.Node],

        mana:0,

        maxMana:10,

        manaRecoverSpeedK:1,
        //英雄队伍颜色的调整
        //teamColorNode:[cc.Node]
    },
    // use this for initialization
    onLoad: function () {
        this.unitScript = this.node.getComponent("Unit");

        this.drawCardScript = this.drawCardNode.getComponent("DrawCard");

        this.networkScript = this.unitScript.GameManager.getComponent("network");
        var mainGameManagerScript = this.unitScript.GameManager.getComponent('MainGameManager');
        // 初始化跳跃动作
        //this.jumpAction = this.setJumpAction();
        //this.node.runAction(this.jumpAction);
        this.cameraControlScript = mainGameManagerScript.cameraLayer.getComponent('CameraControl');

        this.deathTimes = 0;
        // 加速度方向开关
        this.accLeft = false;
        this.accRight = false;
        // 主角当前水平方向速度
        this.xSpeed = 0;
        this.isCanJump = true;

        if(this.ai === true){
            this.schedule(function() {
                this.accLeft = true;
                this.accRight = false;
            },2);
            this.schedule(function() {
                this.accLeft = false;
                this.accRight = true;
            },3);
        }
        //初始蓝
        this.mana = 0;
        if (this.self === true) {
            // 初始化键盘输入监听
            this.setInputControl();
        }
    },
    //抽取X张牌
    drawCard:function(x){
        //抽牌循环
        for(var i = 0;i < x;i++) {
            this.drawCardScript.creatCardType();
        }
    },
    //丢弃X张牌
    throwCard:function(x){
        //弃牌循环
        for(var i = 0;i < x;i++) {
            this.drawCardScript.throwCard();
        }
    },
    //获得确定的牌
    getCertainCard:function(cardId,cardPrefab){
        if(cardPrefab === undefined) {
            this.drawCardScript.getCertainCard(cardId);
        }else{
            if(this.handCard.length < globalConstant.handMaxNum){
                this.drawCardScript.creatNewCard(cardPrefab);
            }
        }
    },
    refresh: function (dt) {
        //处理X轴的速度
        if (this.accLeft === this.accRight) {//左右键同时按或不按，则不动
            this.xSpeed = 0;
            this.unitScript.stopAction();
        } else if (this.accLeft === true) {
            //this.unitScript.bodyNode.scaleX = -1;
            this.xSpeed = - this.unitScript.speed;//向左
        } else if (this.accRight === true) {
            //this.unitScript.bodyNode.scaleX = 1;
            this.xSpeed = this.unitScript.speed;//向右
        }
        if(0 > this.node.x){
            this.node.x = 0;
        }
        if(this.node.x > cc.director.getWinSize().width * globalConstant.sceneWidth){
            this.node.x = cc.director.getWinSize().width * globalConstant.sceneWidth;
        }
        if(this.unitScript.death === false && this.xSpeed !== 0) {
            // 根据当前速度更新主角的位置
            this.unitScript.moveAction(this.xSpeed);
        }

        if (this.mana < this.maxMana){
            this.mana += this.manaRecoverSpeedK * Math.sqrt(1 - this.mana / this.maxMana) * dt;
        } else {
            this.mana = this.maxMana;
        }
    },
    onceJumpAciton: function() {
        var self = this;
        this.sendJumpMessage();
        this.unitScript.jumpAction();
    },
    releaseTarget:function(){
        if(this.deathTimes < 3) {
            this.deathTimes ++;
        }

        var eventsend = new cc.Event.EventCustom('heroDeath',true);
        eventsend.setUserData({heroScript:this});
        this.node.dispatchEvent(eventsend);
    },

    //复活英雄
    relive:function(){
        //Y坐标为 -76
        this.node.y = globalConstant.heroY;
        //透明度
        this.node.opacity = 1000;
        this.health = this.maxHealth;
        this.death = false;
    },
    init:function(data){
        this.team = data.team;
        this.node.x = globalConstant.sceneWidth * cc.director.getWinSize().width / 2
            * (1 + this.team / Math.abs(this.team) * 0.9);
        //this.changeOutLook();
    },
    //changeOutLook:function(){
    //    if(this.team < 0) {
    //        this.teamColorNode[0].active = true;
    //        this.teamColorNode[1].active = false;
    //        this.teamColorNode[2].active = false;
    //    }else if(this.team > 0){
    //        this.teamColorNode[0].active = false;
    //        this.teamColorNode[1].active = false;
    //        this.teamColorNode[2].active = true;
    //    }
    //},
    sendMoveMessage:function(){
        var self = this;
        self.networkScript.roomMsg('roomChat', {
            name: "enemyMove",
            detail: {
                accLeft: self.accLeft,
                accRight: self.accRight,
                health:self.unitScript.health,
                x:self.node.x
            }
        })
    },
    sendJumpMessage:function(){
        var self = this;
        if(self.unitScript.isCanJump === true) {
            self.networkScript.roomMsg('roomChat', {
                name: "enemyJump",
                detail: {}
            })
        }
    },
    sendAttackMessage:function(){
        var self = this;
            self.networkScript.roomMsg('roomChat', {
                name: "enemyAttack",
                detail: {}
            })
    },
    setInputControl: function () {
        var self = this;
        // 添加键盘事件监听
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            // 有按键按下时，判断是否是我们指定的方向控制键，并设置向对应方向加速
            onKeyPressed: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.a:
                    case cc.KEY.left:
                        if(self.accLeft === false){
                            self.accLeft = true;
                            self.sendMoveMessage();
                        }
                        break;
                    case cc.KEY.d:
                    case cc.KEY.right:
                        if(self.accRight === false) {
                            self.accRight = true;
                            self.sendMoveMessage();
                        }
                        break;
                    case cc.KEY.w:
                    case cc.KEY.up:
                            self.onceJumpAciton();
                        break;
                    case cc.KEY.j:
                    case cc.KEY.z:
                        if (self.mana >= self.manaUse){
                            self.mana -= self.manaUse;
                            self.generateNode();
                        }
                        break;
                    case cc.KEY.e:
                        self.cameraControlScript.target = self.cameraControlScript.targets[0];
                        self.cameraControlScript.targets[1].x = self.cameraControlScript.targets[0].x;
                        break;
                    case cc.KEY.space:
                        if (self.unitScript.coolTimer === self.unitScript.coolTime &&
                            self.unitScript.attackFreeze === false) {
                            if(self.unitScript.ATKActionFlag === false){
                                self.sendAttackMessage();
                                self.unitScript.ATKActionFlag = true;
                            }
                            self.unitScript.attackAction();
                        }
                        break;
                }
            },
            // 松开按键时，停止向该方向的加速
            onKeyReleased: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.a:
                    case cc.KEY.left:
                        self.accLeft = false;
                        self.sendMoveMessage();
                        break;
                    case cc.KEY.d:
                    case cc.KEY.right:
                        self.accRight = false;
                        self.sendMoveMessage();
                        break;
                }
            }
        }, self.node);
    },

    // 判断魔法是否足够
    checkMana: function(cost) {
        var self = this;
        return (cost <= self.mana);
    },

    removeNode: function (sender, monster) {
        this._pool.put(monster);
    },

    // called every frame, uncomment this function to activate update callback
    //update: function (dt) {
    //
    //},
});