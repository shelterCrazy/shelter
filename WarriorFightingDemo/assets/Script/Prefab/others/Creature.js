/**
 * @主要功能:   怪物史莱克
 * @type {Function}
 */
var monsterShrek = cc.Class({
    extends: cc.Component,

    properties: {
        //主游戏管理器组件
        GameManager:cc.Component,
        //攻击行为组件
        AttackBehavior:cc.Component,
        //锁定的目标
        focusTarget:cc.Node,
        //目标数组
        target:[cc.Node],
        //目标数组 0生物 1英雄 2基地 3魔法
        targetType:[],
        //目标的坐标
        targetX: null,

        id:"",
        //目标的类型0英雄;1生物;-1无
        focusType:0,
        //生命值
        health:0,
        //生命值标签
        healthLabel:cc.Label,
        //生命值的节点
        healthNode:[cc.Node],
        //生物宽度
        width:0,
        //攻击力
        attack:0,
        //攻击力标签
        attackLabel:cc.Label,
        //攻击范围
        attackArea:0,
        //速度
        velocity:0,
        //可移动标记
        move: true,
        //

        //所属的队伍
        team:0,
        //延时用
        delay:0,
        //是否死亡
        death:false,
        //是否处于召唤状态
        summon:true,
        //攻击进行立Flag
        ATKActionFlag: 0,
        //攻击间隔
        attackSpace: 0,
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
        this.ATKActionFlag = 0;  //攻击行为标记 1攻击进行中
        this.attackTimer = 0;   //攻击计时器

        this.moveFreeze = false;
        this.attackFreeze = false;
        this.weekness = false;

        /*for(i = 0;i < 3;i ++){
            this.healthNode[i].active = false;
        }*/


        this.initAction();
    },


    /**
     * @主要功能:   初始化行为方法
     * @author kenan
     * @Date 2017/7/23 3:39
     */
    initAction: function(){
        //开启攻击轮询侦测      0.5执行一次   直到销毁     监听ATKActionFlag
        this.schedule(function(){
            // cc.log("攻击轮询")
            if(this.target.length === 0 && this.moveFreeze === false){
                this.ATKActionFlag = false;
                this.animationClip.resume(this.id + " " + "walk");
            }
            if(this.attackFreeze === true){
                this.animationClip.pause(this.id + " " + "walk");
            }
            if(this.ATKActionFlag && this.death === false && this.summon === false && this.attackFreeze === false){
                this.attackAction();
            }
        }, 0.5, cc.macro.REPEAT_FOREVER);



        //开启敌对目标轮询侦测      0.5执行一次   直到销毁       不监听
        //this.schedule(function(){
        //    // cc.log("获取敌对目标轮询")
        //    var eventsend = new cc.Event.EventCustom('dataget',true);
        //    eventsend.setUserData({target:this.node});
        //    this.node.dispatchEvent(eventsend);
        //}, 0.5, cc.macro.REPEAT_FOREVER);
    },



    update: function (dt) {
        var self = this;
        self.delay ++;
        self.healthLabel.string = self.health.toFixed(0);
        self.attackLabel.string = self.attack.toFixed(0);

        //自身移动判定  存在目标+非攻击+可以移动标记+自己没死
        if(!self.ATKActionFlag && self.move === true && self.death === false && this.moveFreeze === false){

            //kenan 由于现在行为并不同步  所以会有在执行过程中 目标节点已经被注销的情况  所以这里用上次更新的坐标处理
            if(this.team > 0){
                self.node.x -= this.velocity;
            }else{
                self.node.x += this.velocity;
            }
        }
    },


    /**
     * @主要功能:  攻击行为
     * @author kenan
     * @Date 2017/7/23 1:39
     */
    attackAction: function(){
        //目标为空 或者被销毁  不执行
        if(this.target.length === 0){
            this.ATKActionFlag = false;
            this.animationClip.resume(this.id + " " + "walk");
            return;
        }

        var script;
        if(this.targetType[0] === 0){
            script = this.target[0].getComponent("Creature");
        }else if(this.targetType[0] === 1){
            script = this.target[0].getComponent("Player");
        }else if(this.targetType[0] === 2){
            script = this.target[0].getComponent("Base");
        }

        while(script.death === true){
            this.removeTarget(0);
            if (this.target.length === 0) {
                this.ATKActionFlag = false;
                this.animationClip.resume(this.id + " " + "walk");
                return;
            }
            if(this.targetType[0] === 0){
                script = this.target[0].getComponent("Creature");
            }else if(this.targetType[0] === 1){
                script = this.target[0].getComponent("Player");
            }else if(this.targetType[0] === 2){
                script = this.target[0].getComponent("Base");
            }
        }


        //如果有攻击动画效果   和子弹  就这里执行和创建吧   攻速可以用动画时长+延迟处理
        
        this.animationClip.play(this.id + " " + "attack");
        this.animationClip.stop(this.id + " " + "walk");
        this.sendEvent(this.attackEffect);
        var anim1 = this.animationClip.getAnimationState(this.id + " " + "attack");
        anim1.on('finished',function(){
            this.animationClip.play(this.id + " " + "walk");
            this.animationClip.pause(this.id + " " + "walk");
        },this);
        // this.attackAnimation.play();
        // this.walkAnimation.stop();
        //this.skillAnimation.on('finished', function(){
        //    this.animation[0].active = true;
        //    this.animation[1].active = false;
        //    this.animation[2].active = false;
        //
        //},   this);延时后调用攻击行为是

        //延时后调用攻击行为
        //setTimeout(function(){
    	    if(this.attackArea === 0){
    		    this.AttackBehavior.attack(this.node, this.target[0], this.targetType[0]);
    	    }else{
    		    this.AttackBehavior.areaAttack(this.node);
    	    }
   
        //}.bind(this),500);
        //单体或者范围攻击    调用伤害发生器

    },

    /**
     * @主要功能:   生命变更函数改变值为value，发动这个函数的对方目标为target
     * @author kenan
     * @Date 2017/7/23 1:41
     * @parameters value target
     * @returns {number}   阵亡标记 0活着  1死了
     */
    changeHealth: function(value,target){
        //用于改变伤害倍数的变量
        var add = 1;
        if(this.weekness === true)add = 2;
        if(this.death === false) {
            if (this.health + value > 0) {
                this.health = this.health + value * add;
            } else {
                //死亡
                this.death = true;
                if (this.death === true) {
                    this.release();
                }
            }
            //if(target !== undefined)target.x += -this.team * 200;
        }
	    return this.death; //返回自己是否已经阵亡
    },

    /**
     * @主要功能 改变生物的队伍，并且更新他们
     * @author C14
     * @Date 2017/12/10
     * @parameters team
     * @returns null
     */
    changeTeam: function(team){
        this.cleanTarget();
        this.team = team;
        this.fnTeamRenew();
    },

    /**
     * @主要功能 清除所有攻击目标
     * @author C14
     * @Date 2017/12/10
     * @parameters null
     * @returns null
     */
    removeAllTarget:function(){
        this.target = [];
        this.targetType = [];
    },
    /**
     * @主要功能 清除一个攻击目标
     * @author C14
     * @Date 2017/12/10
     * @param null
     * @returns null
     */
    removeTarget:function(num){
        this.target.splice(num,1);
        this.targetType.splice(num,1);
    },
    /**
     * @主要功能:   释放敌人目标
     * @author kenan
     * @Date 2017/7/23 2:46
     */
    releaseTarget: function(){
        this.focusTarget = null;
        this.targetX = null;
    },



    //释放资源
    release:function(){
        this.animationClip.stop(this.id + " " + "walk");
        this.animationClip.play(this.id + " " + "death");
        this.sendEvent(this.dieEffect);
        var anim1 = this.animationClip.getAnimationState(this.id + " " + "death");
        anim1.on('finished',function(){
            this.GameManager.removeCreature(this.node);
            this.node.removeFromParent();
        },this);
    },


    /**
     * @主要功能:    初始化基本参数   为啥不叫init呢？
     * @parameters data
     */
    fnCreateCreature:function(data){
        this.node.x = data.X;
        this.node.y = data.Y;
        this.attack = data.attack;
        this.health = data.health;
        this.velocity = 0;
        this.team = data.team;

        
        this.AttackBehavior = this.AttackBehavior.getComponent("AttackBehavior");
        this.animationClip = this.node.getComponent(cc.Animation);
        
        this.animationClip.play(this.id + " " + "appear");
        this.summon = true;

        this.sendEvent(this.summonEffect);
        var anim1 = this.animationClip.getAnimationState(this.id + " " + "appear");
        anim1.on('finished',function(){
            this.sendEvent(this.summonEndEffect);
            this.animationClip.play(this.id + " " + "walk");
            this.velocity = data.velocity;
            this.summon = false;
        },this);


        this.fnTeamRenew();
        cc.log(this.team);
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
        if(fullVolume === undefined || fullVolume === null || fullVolume === false){
            fullVolume = false;
        }else{
            fullVolume = true;
        }
        eventsend.setUserData({
            effect:audioChip,
            volume:volume,
            fullVolume:fullVolume,
            target:this.node,
        });
        this.node.dispatchEvent(eventsend);
    },
    /**
     * @主要功能:   初始化阵营显示内容
     */
    fnTeamRenew: function(){
        this.bodyNode.scaleX = - this.team;
        if(this.team > 0){
            this.healthNode[0].active = 0;
            this.healthNode[1].active = 0;
            this.healthNode[2].active = 1;
        }else if(this.team < 0){
            this.healthNode[0].active = 1;
            this.healthNode[1].active = 0;
            this.healthNode[2].active = 0;
        }else{
            this.healthNode[0].active = 0;
            this.healthNode[1].active = 1;
            this.healthNode[2].active = 0;            
        }
    }

});
