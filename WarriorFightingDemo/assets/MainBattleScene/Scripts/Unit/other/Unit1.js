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
        animationId:0,

        unitType:{
            type:cc.Enum({
                creature:0,
                hero:1,
                tower:2,
                base:3
            }),

            default: 0
        },

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
        //wanimationIdth:0,
        //攻击力
        attack:0,
        //攻击力标签
        attackLabel:cc.Label,
        //攻击范围
        attackArea:0,
        //速度
        speed:0,

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
    },


    onLoad: function(){
        var i;
        this.ATKActionFlag = false;  //攻击行为标记 1攻击进行中
        this.coolTimer = this.coolTime;   //攻击计时器
        this.isCanJump = true;

        this.moveFreeze = false;
        this.attackFreeze = false;
        this.weekness = false;

        if(this.bodySkeleton !== null)
        this.bodySkeleton = this.bodySkeleton.getComponent(sp.Skeleton);

        this.initAction();
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



    update: function (dt) {
        var self = this;
        //self.delay ++;
        //cc.log(this.coolTimer);
        if(this.coolTimer > this.coolTime){
            this.coolTimer = this.coolTime;
        }else if(this.coolTimer < this.coolTime){
            this.coolTimer += dt;
        }

        if(this.summon === true){
            return;
        }
        this.typeComponent.refresh(dt);
        if(self.death === false) {
            //this.skillComponent.releaseFunction(3);
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
    moveAction:function(value){

        if (!this.ATKActionFlag && this.move === true && this.death === false &&
            this.moveFreeze === false && this.speed > 0) {
            if(value < 0 && this.bodyNode.scaleX === 1)this.bodyNode.scaleX = -1;
            if(value > 0 && this.bodyNode.scaleX === -1)this.bodyNode.scaleX = 1;
            //this.rigidbody.linearVelocity = cc.v2(value * 70,this.rigidbody.linearVelocity.y);
            this.node.x += value;

            if(this.bodySkeleton !== null && this.bodySkeleton.animation === "idle")
                this.bodySkeleton.animation = "walk";

            if (this.animationClip !== null) {
                var animState = this.animationClip.getAnimationState(this.animationId + " " + "walk");
                var animState2 = this.animationClip.getAnimationState(this.animationId + " " + "attack");
                if(!animState.isPlaying && !animState2.isPlaying) {
                    this.animationClip.play(this.animationId + " " + "walk");
                    this.animationClip.stop(this.animationId + " " + "idle");
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

            if(this.bodySkeleton !== null && this.bodySkeleton.animation === "walk") {
                this.bodySkeleton.animation = "idle";
            }
            if (this.animationClip !== null) {
                var animState = this.animationClip.getAnimationState(this.animationId + " " + "idle");
                var animState2 = this.animationClip.getAnimationState(this.animationId + " " + "attack");
                if (!animState.isPlaying && !animState2.isPlaying) {
                    this.animationClip.stop(this.animationId + " " + "walk");
                    this.animationClip.play(this.animationId + " " + "idle");
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
            if(self.bodySkeleton !== null) {
                self.bodySkeleton.animation = "jump";
            }

            var jumpUp = cc.moveBy(self.jumpDuration, cc.p(0, self.jumpHeight)).easing(cc.easeCubicActionOut());
            var jumpDown = cc.moveBy(self.jumpDuration, cc.p(0, -self.jumpHeight)).easing(cc.easeCubicActionIn());

            self.node.runAction(cc.sequence(jumpUp, jumpDown,
                cc.callFunc(function(){
                    self.isCanJump = true;
                    if(self.bodySkeleton !== null) {
                        self.bodySkeleton.animation = "idle";
                    }
                })));
            //var action =  cc.sequence(
            //    cc.moveBy(0, this.jumpHeight,this.jumpDuration / 2),
            //    cc.moveBy(0,- this.jumpHeight,this.jumpDuration / 2),
            //    cc.callFunc(function(){
            //        self.isCanJump = true;
            //    },this)
            //);
            //cc.log("jump");
            //var worldCenter = this.rigidbody.getWorldCenter();
            //worldCenter = cc.v2();
            //this.rigidbody.getWorldCenter(worldCenter);
            //this.rigidbody.applyLinearImpulse(cc.v2(0,3000),worldCenter);
        }
    },
    onBeginContact: function (contact, selfCollider, otherCollider) {

        if (otherCollider.node.group === "Ground") {
            cc.log("搞事");
            this.isCanJump = true;
        }
    },


    /**
     * @主要功能:  攻击行为
     * @author kenan
     * @Date 2017/7/23 1:39
     */
    attackAction: function(){

        var self = this;

            this.coolTimer = 0;
            //如果有攻击动画效果   和子弹  就这里执行和创建吧   攻速可以用动画时长+延迟处理
            this.sendEvent(this.attackEffect);
            if(this.bodySkeleton !== null) {
                this.bodySkeleton.animation = "attack";

                this.bodySkeleton.setEndListener(
                    function () {
                        if(self.bodySkeleton !== null) {
                            self.bodySkeleton.animation = "idle";
                        }
                        self.ATKActionFlag = false;
                        self.isCanJump = true;
                    }
                );
            }
            if (this.animationClip !== null) {
                this.animationClip.play(this.animationId + " " + "attack");
                this.animationClip.stop(this.animationId + " " + "walk");
                this.animationClip.stop(this.animationId + " " + "idle");
            }
            self.isCanJump = false;

            if (this.animationClip !== null) {
                var anim1 = this.animationClip.getAnimationState(this.animationId + " " + "attack");
                anim1.on('finished', function () {
                    if(self.bodySkeleton !== null) {
                        self.bodySkeleton.animation = "idle";
                    }
                    this.animationClip.play(self.animationId + " " + "idle");
                    self.ATKActionFlag = false;
                    self.isCanJump = true;
                    //this.animationClip.pause(this.animationId + " " + "walk");
                }, this);
            }
            //延时后调用攻击行为
            setTimeout(function () {

                if (self.enemyTarget.length !== 0 && self.death === false) {
                    var script = self.enemyTarget[0].getComponent("Unit");
                    while (script.death === true) {
                        self.enemyTarget.splice(0, 1);
                        if (self.enemyTarget.length === 0) {
                            self.ATKActionFlag = false;
                            self.animationClip.resume(self.animationId + " " + "walk");
                            if(self.bodySkeleton !== null)
                                self.bodySkeleton.animation = "walk";
                            self.bodyNode.scaleX = -self.team;
                            return;
                        }
                        script = self.enemyTarget[0].getComponent("Unit");
                    }
                    if (self.attackArea === 0) {
                        if (self.AttackBehavior.attack(self.node, self.enemyTarget[0])) {
                            self.skillComponent.releaseFunction(6);
                        }
                    } else {
                        self.AttackBehavior.areaAttack(self.node);
                    }

                    self.skillComponent.releaseFunction(5, self.enemyTarget[0]);
                }

            }, 700);
            //单体或者范围攻击    调用伤害发生器
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
                this.healthLabel.string = this.health.toFixed(0);

                if(this.lifeBar !== null)this.lifeBar.progress = this.health / this.maxHealth;

                return false;
            } else {
                //死亡
                this.death = true;

                this.health = 0;
                this.healthLabel.string = this.health.toFixed(0);
                if(this.lifeBar !== null)this.lifeBar.progress = this.health / this.maxHealth;

                if (this.death === true) {
                    this.release();
                    return true;
                }else{
                    return false;
                }
            }
        }
        return true;
    },
    changeHealthTo: function(value,enemyTarget){
        this.health = value;
        this.healthLabel.string = this.health.toFixed(0);
        if(this.lifeBar !== null)this.lifeBar.progress = this.health / this.maxHealth;
    },

    changeAttackBy: function(value){
        this.attack += value;
        if(this.attack < 0)this.attack = 0;
        if(this.attackLabel !== null)
        this.attackLabel.string = this.attack.toFixed(0);
    },
    changeAttackTo: function(value){
        this.attack = value;
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
        //this.animationClip.stop(this.animationId + " " + "walk");
        var self = this;
        this.death = true;
        this.skillComponent.releaseFunction(4);
        //this.animationClip.play(this.animationId + " " + "death");
        if(this.bodySkeleton !== null) {
            this.bodySkeleton.animation = "death";
            this.bodySkeleton.setEndListener(
                function() {
                    self.GameManager.removeCreature(this.node);
                    self.node.removeFromParent();
                }
            );
        }
        this.sendEvent(this.dieEffect);

        //this.bodySkeleton.setCompleteListener();
        //var anim1 = this.animationClip.getAnimationState(this.animationId + " " + "death");
        //anim1.on('finished',function(){
        //    this.GameManager.removeCreature(this.node);
        //    this.node.removeFromParent();
        //},this);
    },

    /**
     * @主要功能 改变生物的队伍，并且更新他们
     * @author C14
     * @Date 2017/12/10
     * @parameters team
     * @returns null
     */
    changeTeam: function(team){
        var k = this.enemyTarget;
        this.enemyTarget = this.friendlyTarget;
        this.friendlyTarget = k;
        this.team = team;
        this.fnTeamRenew();
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

        if(data.speed !== undefined)
            this.speed = data.speed;

        //cc.log(this.savespeed);

        //this.speed = 0;
        this.team = data.team;

        if(this.attackLabel !== null)
        this.attackLabel.string = this.attack.toFixed(0);
        this.healthLabel.string = this.health.toFixed(0);
        
        this.AttackBehavior = this.AttackBehavior.getComponent("AttackBehavior");
        this.skillComponent = this.skillComponent.getComponent("Skill");

        this.animationClip = this.node.getComponent(cc.Animation);
        if(this.animationClip !== null) {
            this.animationClip.play(this.animationId + " " + "appear");
            this.summon = true;

            this.sendEvent(this.summonEffect);
            var anim1 = this.animationClip.getAnimationState(this.animationId + " " + "appear");
            anim1.on('finished', function () {
                this.sendEvent(this.summonEndEffect);
                this.animationClip.play(this.animationId + " " + "walk");
                //cc.log(this.savespeed);
                //this.speed = this.savespeed;
                this.summon = false;
            }, this);
        }else{
            this.sendEvent(this.summonEndEffect);
            //this.animationClip.play(this.animationId + " " + "walk");
            //cc.log(this.savespeed);
            //this.speed = this.savespeed;
            this.summon = false;
        }


        this.fnTeamRenew();

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
    }

});
