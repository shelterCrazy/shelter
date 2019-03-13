/**
 * @主要功能:   单位
 * @type {Function}
 */
var globalConstant = require("Constant");

var unit = cc.Class({
    extends: cc.Component,

    properties: {
        //主游戏管理器组件
        GameManager:cc.Component,
        //攻击行为组件
        AttackBehavior:cc.Component,
        //攻击范围的组件
        attackRangeComponent:cc.Component,
        //生物技能的组件
        skillComponent:cc.Component,

        skillRangeComponent:cc.Component,

        typeComponent:cc.Component,
        //锁定的目标
        focusTarget:cc.Node,
        //目标数组
        Target:[cc.Node],

        friendlyTarget:[cc.Node],
        enemyTarget:[cc.Node],

        id:0,
        _animationId:0,

        unitType:{
            type:cc.Enum({
                creature:0,
                hero:1,
                tower:2,
                base:3
            }),

            default: 0
        },
        //所属层数的枚举
        //逻辑层节点
        logicNode:cc.Node,
        //显示层节点
        viewNode:cc.Node,

        bodySkeletonNode:cc.Node,
        bodySkeleton:cc.Component,

        //跳跃高度
        jumpHeight: 0,
        //跳跃持续时间
        jumpDuration: 0,

        //focusType:0,

        //生命值
        health:0,
        maxHealth:0,
        //生命值标签
        healthLabel:cc.Label,
        //阵营的节点
        teamNode:[cc.Node],

        teamPicNode:[cc.Node],
        //生物宽度
        //w_animationIdth:0,
        //攻击力
        attack:0,
        //攻击力标签
        attackLabel:cc.Label,
        //攻击范围
        attackArea:0,
        //速度
        speed:0,

        //阻挡
        resist:false,
        //可移动标记
        move: true,

        //恒常移动锁
        moveLock:false,
        //所属的队伍
        team:0,
        //延时用
        delay:0,
        //是否死亡
        death:false,
        //是否处于召唤状态
        summon:true,
        //攻击进行立Flag
        ATKActionFlag: false,

        //攻击间隔
        coolTime: 0,
        //攻击计时器 作废
        // attackTimer: 0,
        _mapSign:cc.Node,

        bodyNode:cc.Node,

        stateNode:cc.Node,

        //召唤生物的音效
        summonEffect:cc.AudioClip,
        //召唤完成时的音效
        summonEndEffect:cc.AudioClip,
        //生物移动的音效
        moveEffect:cc.AudioClip,
        //生物攻击的音效
        attackEffect:cc.AudioClip,
        //死亡时的音效
        dieEffect:cc.AudioClip,


        debugLabel:cc.Label,
    },


    onLoad: function(){
        var i;
        this.ATKActionFlag = false;  //攻击行为标记 1攻击进行中
        this.coolTimer = this.coolTime;   //攻击计时器
        this.isCanJump = true;
        //攻击等待帧数计时器
        this.delayTimer = 0;
        this.timer = 0;
        this._acc = 5;
        this._f = 0.5;
        this._nowSpeed = 0;
        this.ySpeed = 0;
        this.isJump = false;

        this.moveFreeze = false;
        this.attackFreeze = false;
        this.weekness = false;

        if(this.bodySkeleton !== null && this.viewNode === this.node)
        {
            this.bodySkeleton = this.bodySkeleton.getComponent(sp.Skeleton);
        }else{
            this.bodySkeleton.node.removeFromParent();
            this.bodySkeleton = null;
        }

        this.initAction();

        if(globalConstant.debug === false){
            this.debugLabel.string = "";
        }
    },


    /**
     * @主要功能:   初始化行为方法
     * @author kenan
     * @Date 2017/7/23 3:39
     */
    initAction: function(){

        this.schedule(function(){
            this.skillComponent.releaseFunction(1);
        }, globalConstant.unitTime, cc.macro.REPEAT_FOREVER);

        //开启敌对目标轮询侦测      0.5执行一次   直到销毁       不监听
        //this.schedule(function(){
        //    // cc.log("获取敌对目标轮询")
        //    var eventsend = new cc.Event.EventCustom('dataget',true);
        //    eventsend.setUserData({enemyTarget:this.node});
        //    this.node.dispatchEvent(eventsend);
        //}, 0.5, cc.macro.REPEAT_FOREVER);
    },



    updateByNet: function (fps) {
        //获得当前帧率下应当推进的速率
        var frameSpeed = globalConstant.frameRate / fps;
        if(globalConstant.debug === true){
            this.debugLabel.string = "cool:" + this.coolTimer + "\ndelay:" + this.delayTimer
                + "\nenemyNum:" + this.enemyTarget.length + "\natkFlag:" + this.ATKActionFlag;
        }
        //如果正在召唤的话，那就返回，不执行下面的内容
        if(this.summon === true){
            return;
        }
        //this.attackRangeComponent.judgeCreature();
        this.typeComponent.refresh(fps);

        if(this.isJump === true){
            this.ySpeed -= 0.6 * frameSpeed;
            this.node.y += this.ySpeed * frameSpeed;
        }
        if(this.coolTimer > this.coolTime)
        {
            this.coolTimer = this.coolTime;
        }else if(this.coolTimer < this.coolTime){
            this.coolTimer += frameSpeed;
        }
        //如果延迟用定时器不等于0
        if(this.delayTimer !== 0)
        {
            //加加
            this.delayTimer += frameSpeed;
            //达到了延迟的数量以后
            if (this.delayTimer >= this.delay)
            {
                //达到了延迟的数量以后，清零
                this.delayTimer = 0;
                //攻击一次
                this.attackOnce();
                this.ATKActionFlag = false;
                if (this.isJump === false)
                    this.isCanJump = true;
            }
        }

        //为逻辑节点
        //if(this.logicNode === this.node && this.viewNode !== null) {
            //if ((++ this.timer) % 6 === 0)
            //{
            //    this.timer = 0;
            //    //cc.log(this.timer);
            //    this.viewNode.getComponent("Unit").changeHealthTo(this.health);
            //    this.viewNode.getComponent("Unit").changeAttackTo(this.attack);
            //    var action = cc.moveBy(1,cc.v2(this.node.x - this.viewNode.x,0));
            //    action.setTag(1);
            //    //暂停同步用的那个动画
            //    this.viewNode.stopAction(this.viewNode.getActionByTag(1));
            //    this.viewNode.runAction(action);
            //}
            //this.viewNode.getComponent("Unit").changeHealthTo(this.health);
        //}
    },

    onCollisionEnter: function (other, self) {
        if (other.node.group === "Ground") {

            this.ySpeed = 0;

            this.node.y = other.node.y;
            cc.log(other.node.y);
            //this.node.y = otherPreAabb.yMax - this.node.parent.y;
            this.isJump = false;

            this.isCanJump = true;
            //如果是显示层的话，显示身体转动，动画等相关操作
            if (this.node === this.viewNode) {
                if (this.bodySkeleton !== null) {
                    this.bodySkeleton.animation = "idle";
                }
            }
        }
    },



    /**
     * @主要功能 移动行为
     * value为正表示向右移动，为负表示向左移动
     * @author C14
     * @Date 2018/3/8
     * @parameters value
     * @returns
     */
    moveAction:function(value,fps){
        var frameSpeed = globalConstant.frameRate / fps;
        if (this.move === true && this.death === false &&//!this.ATKActionFlag && 
            this.moveFreeze === false && this.speed > 0) {
            if(value < 0 && this.bodyNode.scaleX === 1)this.bodyNode.scaleX = -1;
            if(value > 0 && this.bodyNode.scaleX === -1)this.bodyNode.scaleX = 1;
            //this.rigidbody.linearVelocity = cc.v2(value * 70,this.rigidbody.linearVelocity.y);
            if(this._mapSign !== null)
            this._mapSign.getComponent("SignScript").fnRenewSignPosition();
            this.node.runAction(cc.moveBy(1 / fps,value,0));
            //this.node.x += value;

            if(this.bodySkeleton !== null && this.bodySkeleton.animation === "idle")
                this.bodySkeleton.animation = "walk";

            if (this.animationClip !== null) {
                var animState = this.animationClip.getAnimationState(this._animationId + " " + "walk");
                var animState2 = this.animationClip.getAnimationState(this._animationId + " " + "attack");
                if(!animState.isPlaying && !animState2.isPlaying) {
                    this.animationClip.play(this._animationId + " " + "walk");
                    this.animationClip.stop(this._animationId + " " + "idle");
                }
            }
        }
    },
    /**
     * @主要功能 移动行为
     * value为正表示向右移动，为负表示向左移动
     * @author C14
     * @Date 2018/3/8
     * @parameters value
     * @returns
     */
    moveAccAction:function(position){

        if (this.move === true && this.death === false &&
            this.moveFreeze === false && this.speed > 0) {

            this._nowSpeed += position * this._acc;
            if(this._nowSpeed > this.speed){
                this._nowSpeed = this.speed;
            }else if(this._nowSpeed < - this.speed){
                this._nowSpeed = - this.speed;
            }

            if(position < 0 && this.bodyNode.scaleX === 1)this.bodyNode.scaleX = -1;
            if(position > 0 && this.bodyNode.scaleX === -1)this.bodyNode.scaleX = 1;
            //this.rigidbody.linearVelocity = cc.v2(value * 70,this.rigidbody.linearVelocity.y);

            if(this.bodySkeleton !== null && this.bodySkeleton.animation === "idle")
                this.bodySkeleton.animation = "walk";

            if (this.animationClip !== null) {
                var animState = this.animationClip.getAnimationState(this._animationId + " " + "walk");
                var animState2 = this.animationClip.getAnimationState(this._animationId + " " + "attack");
                if(!animState.isPlaying && !animState2.isPlaying) {
                    this.animationClip.play(this._animationId + " " + "walk");
                    this.animationClip.stop(this._animationId + " " + "idle");
                }
            }
        }
    },
    /**
     * @主要功能 停止其他动作，进入闲散状态
     * @author C14
     * @Date 2018/3/10
     * @parameters
     * @returns
     */
    stopAction:function(){
        if (this.death === false) {

            if(this.bodySkeleton !== null &&
                this.bodySkeleton.animation === "walk" &&
                this.bodySkeleton.animation !== "idle") {
                this.bodySkeleton.animation = "idle";
            }
            if (this.animationClip !== null) {
                var animState = this.animationClip.getAnimationState(this._animationId + " " + "idle");
                var animState2 = this.animationClip.getAnimationState(this._animationId + " " + "attack");
                if (!animState.isPlaying && !animState2.isPlaying) {
                    this.animationClip.stop(this._animationId + " " + "walk");
                    this.animationClip.play(this._animationId + " " + "idle");
                }
            }
        }
    },
    /**
     * @主要功能 跳跃行为
     * @author C14
     * @Date 2018/3/8
     * @parameters value
     * @returns
     */
    jumpAction:function(){
        var self = this;

        if(self.isCanJump === true && this.death === false) {
            self.isCanJump = false;
            this.isJump = true;
            //如果是显示层的话，显示身体转动，动画等相关操作
            if (this.node === this.viewNode) {
                if (self.bodySkeleton !== null) {
                    self.bodySkeleton.animation = "jump";
                }
            }

            this.ySpeed = 20;
        }
    },


    /**
     * @主要功能:  攻击行为
     * @author kenan
     * @Date 2017/7/23 1:39
     */
    attackAction: function() {

        var self = this;

        this.coolTimer = 0;
        self.isCanJump = false;

        //如果有攻击动画效果   和子弹  就这里执行和创建吧   攻速可以用动画时长+延迟处理
        this.sendEvent(this.attackEffect);
        if (this.bodySkeleton !== null) {
            this.bodySkeleton.animation = "attack";
            this.bodySkeleton.setCompleteListener(
                function () {
                    if (self.bodySkeleton !== null) {
                        self.bodySkeleton.animation = "idle";
                    }
                }.bind(this)
            );
        }

        //延时后调用攻击行为
        if(this.delayTimer === 0)
        this.delayTimer ++;
    },
    /**
     * @主要功能 进行一次攻击
     * @author C14
     * @Date 2018/8/30
     * @parameters
     * @returns
     */
    attackOnce:function(){
        //单体或者范围攻击    调用伤害发生器
        if (this.enemyTarget.length !== 0 && this.death === false) {
            var script = this.enemyTarget[0].getComponent("Unit");
            while (script.death === true) {
                this.enemyTarget.splice(0, 1);
                if (this.enemyTarget.length === 0) {
                    this.ATKActionFlag = false;
                    //self.animationClip.resume(self._animationId + " " + "walk");
                    if (this.bodySkeleton !== null)
                        this.bodySkeleton.animation = "idle";
                    this.bodyNode.scaleX = - this.team;
                    return;
                }
                script = this.enemyTarget[0].getComponent("Unit");
            }
            if (this.attackArea === 0) {
                this.AttackBehavior.attack(this.node, this.enemyTarget[0], function(flag){
                    if(flag)this.skillComponent.releaseFunction(6);
                }.bind(this));
            } else {
                this.AttackBehavior.areaAttack(this.node);
            }

            this.skillComponent.releaseFunction(5, this.enemyTarget[0]);
        }
    },

    /**
     * @主要功能:   生命变更函数改变值为value，发动这个函数的对方目标为enemyTarget
     * @author kenan
     * @Date 2017/7/23 1:41
     * @parameters value enemyTarget
     * @returns {number}   阵亡标记 0活着  1死了
     */
    changeHealthBy: function(value,enemyTarget){
        //用于改变伤害倍数的变量
        var add = 1;
        if(this.weekness === true)add = 2;

        if(this.death === false) {
            if (this.health + value > 0) {
                this.health = this.health + value * add;
                this.skillComponent.releaseFunction(2);
                if(this._mapSign !== null)
                this._mapSign.getComponent("SignScript").fnRenewSignHealth();
                if(this.healthLabel !== null)
                this.healthLabel.string = this.health.toFixed(0);

                if(this.maxHealth < this.health){
                    this.maxHealth = this.health;
                }
                if(this.lifeBar !== null)this.lifeBar.progress = this.health / this.maxHealth;

                return false;
            } else {
                //死亡
                this.death = true;

                this.health = 0;
                if(this._mapSign !== null)
                this._mapSign.getComponent("SignScript").fnRenewSignHealth();
                if(this.healthLabel !== null)
                this.healthLabel.string = this.health.toFixed(0);
                if(this.lifeBar !== null)this.lifeBar.progress = this.health / this.maxHealth;

                if(this.logicNode === this.node) {
                    this.release();
                }
                return true;
            }
        }
        return true;
    },
    changeHealthTo: function(value,enemyTarget){
        this.health = value;
        if(this._mapSign !== null)
        this._mapSign.getComponent("SignScript").fnRenewSignHealth();
        if(this.healthLabel !== null)
        this.healthLabel.string = this.health.toFixed(0);
        if(this.maxHealth < this.health){
            this.maxHealth = this.health;
        }
        if(this.lifeBar !== null)this.lifeBar.progress = this.health / this.maxHealth;
    },

    changeAttackBy: function(value){
        this.attack += value;
        if(this.attack < 0)this.attack = 0;
        if(this._mapSign !== null)
        this._mapSign.getComponent("SignScript").fnRenewSignAttack();
        if(this.attackLabel !== null)
        this.attackLabel.string = this.attack.toFixed(0);
    },
    changeAttackTo: function(value){
        this.attack = value;
        if(this._mapSign !== null)
        this._mapSign.getComponent("SignScript").fnRenewSignAttack();
        if(this.attackLabel !== null)
        this.attackLabel.string = this.attack.toFixed(0);
    },
    changeSpeedBy: function(value){
        this.speed += value;
        if(this.speed < 0)this.speed = 0;
    },
    changeSpeedTo: function(value){
        this.speed = value;
    },


    //释放此资源
    release:function(){
        //this.animationClip.stop(this._animationId + " " + "walk");
        var self = this;
        this.death = true;
        if(this.logicNode === this.node) {
            this.viewNode.getComponent("Unit").release();
            this.skillComponent.releaseFunction(4);
            self.GameManager.removeCreature(self.node);
            self.node.removeFromParent();
            self.node.destroy();
        }else{
            this.sendEvent(this.dieEffect);
            this.changeHealthTo(0);
        }

        //this.animationClip.play(this._animationId + " " + "death");
        if(this.bodySkeleton !== null) {
            this.bodySkeleton.animation = "death";
            this.bodySkeleton.setCompleteListener(
                function() {
                    self.GameManager.removeCreature(self.node);
                    self.node.removeFromParent();
                    self.node.destroy();
                }
            );
        }
    },

    /**
     * @主要功能 改变生物的队伍，并且更新他们
     * @author C14
     * @Date 2017/12/10
     * @parameters team
     * @returns null
     */
    changeTeam: function(){
        this.team = - this.team;
        var k = this.enemyTarget,i = 0,self = this;
        var num = 0;
        this.enemyTarget = this.friendlyTarget;
        this.friendlyTarget = k;
        if(this._mapSign !== null)
        this._mapSign.getComponent("SignScript").fnRenewSignTeam();
        if(this.team * this.GameManager.heros[0].getComponent("Unit").team > 0){
            this.focusTarget = this.GameManager.heros[1];
        }else{
            this.focusTarget = this.GameManager.heros[0];
        }
        //for(i = 0;i < this.enemyTarget.length;i++){
        //    var team = this.enemyTarget[i - num].getComponent("Unit").team;
        //    cc.log("队伍" + team);
        //    if(team/Math.abs(team) === this.team/Math.abs(this.team)){
        //        this.friendlyTarget.push(this.enemyTarget[i - num]);
        //        this.enemyTarget.splice(i - num);
        //        num ++;
        //    }
        //}
        //num = 0;
        //for(i = 0;i < this.friendlyTarget.length;i++){
        //    team = this.friendlyTarget[i - num].getComponent("Unit").team;
        //    cc.log("队伍" + team);
        //    if(team/Math.abs(team) === this.team/Math.abs(this.team)){
        //        this.enemyTarget.push(this.friendlyTarget[i - num]);
        //        this.friendlyTarget.splice(i - num);
        //        num ++;
        //    }
        //}
        setTimeout(function(){
            var creatures = self.GameManager.creatureLayer.children;
            for(i = 0;i < creatures.length;i++){
                creatures[i].getComponent("Unit").renewTarget();
            }
        },50);
        this.fnTeamRenew();
    },

    renewTarget:function(){
//***********然而这个地方还是有问题啊，this.friendlyTarget.push(arr[0]);要合适的互换友军敌军
        var num = 0;
        for(var i = 0;i < this.enemyTarget.length;i++){
            var team = this.enemyTarget[i - num].getComponent("Unit").team;
            //cc.log("类型是" + this.enemyTarget[i - num].getComponent("Unit").unitType);
            if(team/Math.abs(team) === this.team/Math.abs(this.team)){
                var arr = this.enemyTarget.splice(i - num,1);
		//cc.log(arr.length);
                //this.friendlyTarget.push(arr[0]);
                num ++;
            }
        }
        num = 0;
        for(i = 0;i < this.friendlyTarget.length;i++){
            team = this.friendlyTarget[i - num].getComponent("Unit").team;
            //cc.log("队伍是" + this.team);
            if(team/Math.abs(team) === this.team/Math.abs(this.team)){
                arr = this.friendlyTarget.splice(i - num,1);
		//cc.log(arr.length);
                //this.enemyTarget.push(arr[0]);
                num ++;
            }
        }
    },

    /**
     * @主要功能:    初始化基本参数   为啥不叫init呢？
     * @parameters data
     */
    initUnit:function(data){
        this.savespeed = 0;
        //有关类型的具体组件
        if(this.unitType === 0) {
            this.typeComponent = this.node.getComponent("Creature");
        }else if(this.unitType === 1) {
            this.typeComponent = this.node.getComponent("Hero");
        }else if(this.unitType === 2) {
            this.typeComponent = this.node.getComponent("Tower");
        }
        if(data.X !== undefined)
        this.node.x = data.X;
        if(data.Y !== undefined)
        this.node.y = data.Y;
        if(data.attack !== undefined)
        this.attack = data.attack;
        if(data.health !== undefined)
        this.health = data.health;
        this.maxHealth = this.health;
        if(data.rarity !== undefined)
            this.typeComponent.rarity = data.rarity;
        
        this.death = false;

        if(data.speed !== undefined)
            this.speed = data.speed;

        this.ATKActionFlag = false;
        this.coolTimer = 0;
        this.friendlyTarget = [];
        this.enemyTarget = [];
        
        this.team = data.team;

        if(this.attackLabel !== null)
        this.attackLabel.string = this.attack.toFixed(0);
        if(this.healthLabel !== null)
        this.healthLabel.string = this.health.toFixed(0);
        
        this.AttackBehavior = this.GameManager.node.getComponent("AttackBehavior");
        this.skillComponent = this.skillComponent.getComponent("Skill");

        this.animationClip = this.node.getComponent(cc.Animation);
        if(this.bodySkeleton !== null)
            this.bodySkeleton.animation = "walk";
        if(this.animationClip !== null) {
            this.animationClip.play(this._animationId + " " + "appear");
            this.summon = true;

            this.sendEvent(this.summonEffect);
            var anim1 = this.animationClip.getAnimationState(this._animationId + " " + "appear");
            anim1.on('finished', function () {
                this.sendEvent(this.summonEndEffect);
                this.animationClip.play(this._animationId + " " + "walk");
                //cc.log(this.savespeed);
                //this.speed = this.savespeed;
                this.summon = false;
            }, this);
        }else{
            this.sendEvent(this.summonEndEffect);
            //this.animationClip.play(this._animationId + " " + "walk");
            //cc.log(this.savespeed);
            //this.speed = this.savespeed;
            this.summon = false;
        }
        this.fnTeamRenew();
        if(this.lifeBar !== null)this.lifeBar.progress = this.health / this.maxHealth;
    },


    /**
     * @主要功能:   初始化注入管理类
     * @parameters Manager
     */
    fnGetManager:function(Manager){
        this.GameManager = Manager;
    },

    /**
     * @主要功能 向上级节点传递消息，使之播放音效
     * @author C14
     * @Date 2017/12/12
     * @parameters audioChip volume
     * @returns null
     */
    sendEvent:function(audioChip,fullVolume,volume) {
        var eventsend = new cc.Event.EventCustom("playEffect", true);
        if(volume === undefined || volume === null){
            volume = 1;
        }
        fullVolume = !(fullVolume === undefined || fullVolume === null || fullVolume === false);
        eventsend.setUserData({
            effect:audioChip,
            volume:volume,
            fullVolume:fullVolume,
            target:this.node
        });
        this.node.dispatchEvent(eventsend);
    },
    /**
     * @主要功能:   初始化阵营显示内容
     */
    fnTeamRenew: function(){
        this.bodyNode.scaleX = - this.team;

        if(this.team > 0){
            this.teamNode[0].active = 0;
            this.teamNode[1].active = 0;
            this.teamNode[2].active = 1;

            this.teamPicNode[0].active = 0;
            this.teamPicNode[1].active = 0;
            this.teamPicNode[2].active = 1;
            this.teamNodeNum = 2;
        }else if(this.team < 0){
            this.teamNode[0].active = 1;
            this.teamNode[1].active = 0;
            this.teamNode[2].active = 0;

            this.teamPicNode[0].active = 1;
            this.teamPicNode[1].active = 0;
            this.teamPicNode[2].active = 0;
            this.teamNodeNum = 0;
        }else{
            this.teamNode[0].active = 0;
            this.teamNode[1].active = 1;
            this.teamNode[2].active = 0;

            this.teamPicNode[0].active = 0;
            this.teamPicNode[1].active = 1;
            this.teamPicNode[2].active = 0;
            this.teamNodeNum = 1;
        }
        this.lifeBar = this.teamNode[this.teamNodeNum].getComponent(cc.ProgressBar);
        //cc.log(this.lifeBar);
        //cc.log(this.teamNodeNum);
    }

});
