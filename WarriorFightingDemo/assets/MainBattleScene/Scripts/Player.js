var globalConstant = require("Constant");
var Global = require("Global");
cc.Class({
    extends: cc.Component,

    properties: {

        // 主角跳跃高度
        jumpHeight: 0,
        // 主角跳跃持续时间
        jumpDuration: 0,
        // 最大移动速度
        maxMoveSpeed: 0,
        // 射出子弹
        launchButton: cc.Prefab,
        //生命值
        health: 0,
        //生命值
        maxHealth: 0,
        //生命值标签
        healthLabel: cc.Label,        
        //单位
        body: cc.Node,
        //蓝恢复速度
        manaRecoverSpeedK: 0,
        //最大蓝量
        maxMana: 0,
        //耗蓝
        manaUse: 0,
        //队伍
        team: 0,
        //死亡
        death: false,

        //自我
        self:true,
        //是否使AI
        ai:false,
        //能否移动
        movable:true,
        //英雄是否处于召唤之中
        summon:false,

        mainGameManager:cc.Node,
        gameManager:cc.Node,
        cameraControl:cc.Node,
        stateNode:cc.Node,

        drawCardNode:cc.Node,
        //英雄的手牌
        handCard:[cc.Node],
        //英雄队伍颜色的调整
        teamColorNode:[cc.Node]
    },
    // use this for initialization
    onLoad: function () {

        this.drawCardScript = this.drawCardNode.getComponent("DrawCard");

        this.networkScript = this.mainGameManager.getComponent("network");
        // 初始化跳跃动作
        this.jumpAction = this.setJumpAction();
        //this.node.runAction(this.jumpAction);
        this.cameraControlScript = this.cameraControl.getComponent('CameraControl');

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
        //this._pool = new cc.NodePool('PoolHandler');
        }
    },

    leftMoveButton:function(){
        this.accLeft = true;
        this.accRight = false;
    },
    rightMoveButton:function(){
        this.accRight = true;
        this.accLeft = false;
    },
    leftStopButton:function(){
        this.accLeft = false;
        this.accRight = false;
    },
    rightStopButton:function(){
        this.accLeft = false;
        this.accRight = false;
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
    getCertainCard:function(cardType,cardId,cardPrefab){
        if(cardPrefab === undefined) {
            this.drawCardScript.getCertainCard(cardType, cardId);
        }else{
            if(this.handCard.length < globalConstant.handMaxNum){
                this.drawCardScript.creatNewCard(cardPrefab);
            }
        }
    },
    update: function (dt) {
        //处理X轴的速度
        if (this.accLeft === this.accRight) {//左右键同时按或不按，则不动
            this.xSpeed = 0;
        } else if (this.accLeft === true) {
                this.body.scaleX = -1;
            this.xSpeed = -this.maxMoveSpeed;//向左
        } else if (this.accRight === true) {
                this.body.scaleX = 1;
            this.xSpeed = this.maxMoveSpeed;//向右
        }
        if(0 > this.node.x){
            this.node.x = 0;
        }
        if(this.node.x > cc.director.getWinSize().width * globalConstant.sceneWidth){
            this.node.x = cc.director.getWinSize().width * globalConstant.sceneWidth;
        }
        if(this.death === false && 0 <= this.node.x && this.node.x <= cc.director.getWinSize().width * globalConstant.sceneWidth) {
            // 根据当前速度更新主角的位置
            this.node.x += this.xSpeed;
        }

        if (this.mana < this.maxMana){
            this.mana += this.manaRecoverSpeedK * Math.sqrt(1 - this.mana / this.maxMana) * dt;
        } else {
            this.mana = this.maxMana;
        }
        
        this.healthLabel.string = this.health.toFixed(0);
        //this.manaBar.progress = this.mana / this.maxMana;
        //this.manaLabel.string = this.mana.toFixed(0) + "/" + this.maxMana.toFixed(0);
    },
    
    setJumpAction: function(){
        var jumpUp = cc.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        var jumpDown = cc.moveBy(this.jumpDuration, cc.p(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown));
    },
    
    onceJumpAciton: function() {
        var self = this;
        var jumpUp = cc.moveBy(self.jumpDuration, cc.p(0, self.jumpHeight)).easing(cc.easeCubicActionOut());
        var jumpDown = cc.moveBy(self.jumpDuration, cc.p(0, -self.jumpHeight)).easing(cc.easeCubicActionIn());
        
        self.node.runAction(cc.sequence(jumpUp, jumpDown,
        cc.callFunc(function(){self.isCanJump = true;})));
        
    },
    
    changeHealth: function(value,target){
	    if(this.health + value > 0){
		    this.health = this.health + value;
	    }else if(this.death === false){
            this.health = 0;

            this.death = true;
            this.releaseTarget();
	    }
        return this.death;
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
            * (1 + this.team / Math.abs(this.team));
        this.changeOutLook();
    },
    changeOutLook:function(){
        if(this.team < 0) {
            this.teamColorNode[0].active = true;
            this.teamColorNode[1].active = false;
            this.teamColorNode[2].active = false;
        }else if(this.team > 0){
            this.teamColorNode[0].active = false;
            this.teamColorNode[1].active = false;
            this.teamColorNode[2].active = true;
        }
    },
    sendMoveMessage:function(){
        var self = this;
        NetworkModule.roomMsg(Global.room, 'roomChat', {
            name: "enemyMove",
            detail: {
                accLeft: self.accLeft,
                accRight: self.accRight,
                health:self.health,
                x:self.node.x
            }
        })
    },
    sendJumpMessage:function(){
        var self = this;
        NetworkModule.roomMsg(Global.room, 'roomChat', {
            name: "enemyJump",
            detail: {

            }
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
                        if (self.death === false && self.isCanJump){
                            self.isCanJump = false;
                            self.onceJumpAciton();
                            self.sendJumpMessage();
                        }
                        break;
                    case cc.KEY.j:
                    case cc.KEY.z:
                        if (self.mana >= self.manaUse){
                            self.mana -= self.manaUse;
                            self.generateNode();
                        }
                        break;
                    case cc.KEY.space:
                        self.cameraControlScript.target = self.cameraControlScript.targets[0];
                        self.cameraControlScript.targets[1].x = self.cameraControlScript.targets[0].x;
                        break;
                    case cc.KEY.e:

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
    
    generateNode: function () {
        var monster = this._pool.get();
        if (!monster) {
            monster = cc.instantiate(this.launchButton);
        
            // Add pool handler component which will control the touch event
            monster.addComponent('PoolHandler');
        }
        monster.x = this.node.x;
        monster.y = this.node.y;
        
        var dx = monster.getComponent('Fire').flyDistance * this.body.scaleX;
        var dy = 0;
        
        console.log(dx, dy);
        
        monster.runAction(cc.sequence(
            cc.moveBy(monster.getComponent('Fire').flyDistance / monster.getComponent('Fire').flySpeed, dx, dy),
            cc.callFunc(this.removeNode, this, monster)
        ));
        
        this.node.parent.addChild(monster);
    },
    
    removeNode: function (sender, monster) {
        this._pool.put(monster);
    },

    // called every frame, uncomment this function to activate update callback
    //update: function (dt) {
    //
    //},
});
