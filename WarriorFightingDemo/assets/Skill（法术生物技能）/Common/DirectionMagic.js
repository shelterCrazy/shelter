var globalConstant = require("Constant");
cc.Class({
    extends: cc.Component,

    properties: {
        //魔法创建成功的音乐
        loadEffect:cc.AudioClip,
        //命中时的音乐
        hitEffect:cc.AudioClip,
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
        skillNode:cc.Node,

        GameManager:cc.Component,
        //飞行速度
        startSpeed:0,
        speed:{
            default: new cc.Vec2(0,0)
        },
        //受到重力的值
        gravity:0,
        //英雄是否反弹
        heroBounce:false,
        //天空是否反弹
        skyBounce:false,
        //天空是否反弹
        groundBounce:false,
        //左右是否反弹
        leftRightBounce:false,
        //弹性系数,默认按照原速度反弹
        elasticCoefficient:1,
        //最大碰撞次数
        collisionMaxTime:0,
        //法术消失条件
        vanishCondition:{
            type:cc.Enum({
                //不消失
                none:0,
                //碰撞次数到达后消失
                time:1,
                //碰撞到敌方后消失
                enemyHero:2,
                //碰撞到我方英雄后消失
                myHero:3,
                //碰撞到敌方生物后消失
                enemyCreature:4,
                //碰撞到我方生物后消失
                myCreature:5,
                //碰撞到敌方生物后消失
                enemyBase:6,
                //碰撞到我方生物后消失
                myBase:7,

                sky:8,
                ground:9,
                leftOrRight:10,
            }),
            default:0
        },

        _interval:[],
        _stopLock:false,

        id:0,

        death:false
},

    // use this for initialization
    onLoad: function () {
        var self = this;
        this.team = 0;
        //this.area = 0;
        //碰撞次数
        this.collisionTime = 0;

        this.animation = this.node.getComponent("customAnimation");
        //传递创建法术成功时音效的事件
        if(this.loadEffect !== null)
            this.sendEvent(this.loadEffect);

        this.schedule(function(){
            this.magicSkill.releaseFunction(7);
        }, globalConstant.unitTime, cc.macro.REPEAT_FOREVER);

        if(this.animation !== null) {
            for(var i = 0;i < 3; i++)
            {
                this._interval[i] = (this.animation.animations[i].endNumber -
                    this.animation.animations[i].startNumber) * 1000 / 60 * this.animation.animations[i].loops;
            }

            this.animation.play("start");

            setTimeout(function () {
                self.animation.play("loop");
                self.magicSkill.releaseFunction(8);
            }, this._interval[0]);
        }

        //setTimeout(function(){
        //    //e.stopPropagation();
        //},this._interval[0] + this._interval[1]);


        //animation.on('finished',  this.onFinished,    this);

        //cc.director.getCollisionManager().enabledDebugDraw = true;

    },

    judgeCondition:function(condition){
        //for(var i = 0;i < this.vanishCondition.length;i++){
            if(condition === this.vanishCondition){
                return true;
            }
        //}
    },

    onCollisionEnter: function (other, self) {
        var vanishType = cc.Enum({
            //不消失
            none:0,
            //碰撞次数到达后消失
            time:1,
            //碰撞到敌方后消失
            enemyHero:2,
            //碰撞到我方英雄后消失
            myHero:3,
            //碰撞到敌方生物后消失
            enemyCreature:4,
            //碰撞到我方生物后消失
            myCreature:5,
            //碰撞到敌方生物后消失
            enemyBase:6,
            //碰撞到我方生物后消失
            myBase:7,

            sky:8,
            ground:9,
            leftOrRight:10,
        });
        if (other.node.group === "Ground") {
            this.collisionTime ++;
            this.magicSkill.releaseFunction(3);
            if(this.judgeCondition(vanishType.ground)){
                this.release();
            }
            if(this.groundBounce === true)
            this.speed.y = - this.speed.y * this.elasticCoefficient;
            //this.node.removeFromParent();
        }
        if (other.node.group === "Sky") {
            this.collisionTime ++;
            this.magicSkill.releaseFunction(4);
            if(this.judgeCondition(vanishType.sky)){
                this.release();
            }
            if(this.skyBounce === true)
                this.speed.y = - this.speed.y * this.elasticCoefficient;
        }
        if (other.node.group === "LBound") {
            this.collisionTime ++;
            if(this.team < 0){
                this.magicSkill.releaseFunction(5);
            }else if(this.team > 0){
                this.magicSkill.releaseFunction(6);
            }
            if(this.judgeCondition(vanishType.leftOrRight)){
                this.release();
            }
            if(this.leftRightBounce === true)
                this.speed.x = - this.speed.x * this.elasticCoefficient;
        }
        if (other.node.group === "RBound") {
            this.collisionTime ++;
            if(this.team < 0){
                this.magicSkill.releaseFunction(6);
            }else if(this.team > 0){
                this.magicSkill.releaseFunction(5);
            }
            if(this.judgeCondition(vanishType.leftOrRight)){
                this.release();
            }
            if(this.leftRightBounce === true)
                this.speed.x = - this.speed.x * this.elasticCoefficient;
        }

        if(this.judgeCondition(vanishType.time) && this.collisionTime > this.collisionMaxTime){
            this.release();
        }

        if (other.node.group === "Unit") {
            var script1 = other.node.getComponent('Unit');
            var stateScript = script1.stateNode.getComponent('CreatureState');

            if(this.heroBounce === true && script1.unitType === 1) {
                this.speed.x = -this.speed.x * this.elasticCoefficient;
                if(this.judgeCondition(vanishType.myHero) || this.judgeCondition(vanishType.enemyHero)){
                    this.release();
                }
            }

            this.magicSkill.releaseFunction(2,other.node);
            cc.log("???:" + this.judgeCondition(vanishType.enemyCreature));
            if(script1.unitType === 0){
                if(this.judgeCondition(vanishType.myCreature) || this.judgeCondition(vanishType.enemyCreature)){
                    this.release();
                }
            }
        }
    },

    onCollisionExit: function (other, self) {
        if (other.node.group === "Ground") {

        }

        if (other.node.group === "Creature") {

        }
    },
    release:function(){
        var self = this;

        if(this.hitEffect !== null)
            this.sendEvent(this.hitEffect);
        if(this.animation !== null) {
            this.animation.play("end");
        }
        this.magicSkill.releaseFunction(9);

        this._stopLock = true;
        setTimeout(function () {
            self.magicSkill.releaseFunction(1);
            self.node.removeFromParent();
        },this._interval[2]);
    },

    changeTeam: function(team){
        //this.node.removeFromParent();
    },
    initMagic:function(detail){
        this.team = detail.team;
        //this.area = detail.area;
        this.magicSkill = this.skillNode.getComponent("Skill");
        this.speed.x = Math.sin((detail.angel + 90)*Math.PI/180) * this.startSpeed;
        this.speed.y = Math.cos((detail.angel + 90)*Math.PI/180) * this.startSpeed;
    },
    //called every frame, uncomment this function to activate update callback
    update: function (dt) {
        //delayTime(1);
        if(this._stopLock === false) {
            this.speed.y -= this.gravity * dt;
            this.node.x += this.speed.x * dt;
            this.node.y += this.speed.y * dt;
        }
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
     * @主要功能:   初始化注入管理类
     * @parameters Manager
     */
    fnGetManager:function(Manager){
        this.GameManager = Manager;
    },
});

