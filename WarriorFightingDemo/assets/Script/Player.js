var globalConstant = require("Constant");

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
        ai:false,
        movable:true,

        gameManager:cc.Node,
        cameraControl:cc.Node,

        drawCardNode:cc.Node,
        //英雄的手牌
        handCard:[cc.Node],
    },
    // use this for initialization
    onLoad: function () {

        this.drawCardScript = this.drawCardNode.getComponent("DrawCard");
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
    //抽取X张牌
    drawCard:function(x){
        //抽牌循环
        for(var i = 0;i < x;i++) {
            this.drawCardScript.creatCardType();
        }
    },
    update: function (dt) {
        //处理X轴的速度
        if (this.accLeft === this.accRight) {//左右键同时按或不按，则不动
            this.xSpeed = 0;
        } else if (this.accLeft === true) {
                this.body.scaleX = -1;
            this.xSpeed = -this.maxMoveSpeed;//向左
            if(this.self === true)
            this.cameraControlScript.target = this.cameraControlScript.targets[0];
        } else if (this.accRight === true) {
                this.body.scaleX = 1;
            this.xSpeed = this.maxMoveSpeed;//向右
            if(this.self === true)
            this.cameraControlScript.target = this.cameraControlScript.targets[0];
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
    
    changeHealth: function(value){
	    if(this.health + value > 0){
		    this.health = this.health + value;
	    }else if(this.death === false){
            this.health = 0;
            this.death = true;
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
        this.health = this.maxHealth;
        this.death = false;
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
                        //cc.log(self.death);
                            self.accLeft = true;
                        // self.accRight = false;
                        break;
                    case cc.KEY.d:
                    case cc.KEY.right:
                            // self.accLeft = false;
                            self.accRight = true;
                        break;
                    case cc.KEY.w:
                    case cc.KEY.up:
                        if (self.isCanJump){
                            self.isCanJump = false;
                            self.onceJumpAciton();
                        }
                        break;
                    case cc.KEY.j:
                    case cc.KEY.z:
                        if (self.mana >= self.manaUse){
                            self.mana -= self.manaUse;
                            self.generateNode();
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
                        break;
                    case cc.KEY.d:
                    case cc.KEY.right:
                        self.accRight = false;
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
    }

    // called every frame, uncomment this function to activate update callback

});
