var globalConstant = require("Constant");

//var directionMagic = cc.Class({
//    name: "DirectionMagic",
//    properties:{
//
//    }
//});

cc.Class({
    extends: cc.Component,

    properties: {
        //启动的时候播放的音效
        loadEffect:{
            type:cc.AudioSource,
            default:null
        },
        //击中单位播放的音效
        hitEffect:{
            type:cc.AudioSource,
            default:null
        },
        //效果节点
        skillNode:cc.Node,
        //游戏管理器
        GameManager:cc.Component,

        //显示层
        viewNode:cc.Node,
        //逻辑层
        logicNode:cc.Node,

        magicType:{
            type:cc.Enum({
                //常规法术
                normalMagic:0,
                //范围法术
                areaMagic:1,
                //指向性法术
                directionMagic:2
            }),
            default:0,
            displayName: "法术类型"
        },
        //法术范围
        area:0,
        //法术从属的队伍
        team:0,
        //法术id
        id:0,
        //法术是否死亡
        death:false,
        //起始的坐标，如果是-1的话，那么，召唤在我方英雄的位置
        position:-1,
        //法术间隔时间，初始化时自动计算
        _interval:[],
        //是需要通过网络实现效果
        network:true,
        //是否是通过网络创建的
        createByNetwork:false,
        //
        //飞行速度
        startSpeed:0,
        speed:cc.Vec2,

        //受到重力的值
        gravity:{
            default: 0,
            displayName: "重力"
        },
        //英雄是否反弹
        heroBounce:{
            default: false,
            displayName: "碰到英雄是否反弹"
        },
        //天空是否反弹
        skyBounce:{
            default: false,
            displayName: "碰到天空是否反弹"
        },
        //地面是否反弹
        groundBounce:{
            default: false,
            displayName: "碰到地面是否反弹"
        },
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
                leftOrRight:10
            }),
            default:0,
            displayName: "法术结束的条件",

        },
        _stopLock:false,
    },

    // use this for initialization
    onLoad: function () {
        //this.speed = cc.v2(0,0);
    },

    init: function () {
        var self = this;

        
        this.animation = this.node.getComponent("customAnimation");
        this.team = 0;
        this.death = false;
        this._stopLock = false;
        this.timer = 0;
        //播放音效
        if(this.loadEffect !== null)
            this.sendEvent(this.loadEffect);
        this.collisionTime = 0;
        //实现单位时间释放性质的法术
        this.schedule(function(){
            //if(self.network === true) self.createByNetwork !== true
            this.magicSkill.releaseFunction(7);
        }, globalConstant.unitTime, cc.macro.REPEAT_FOREVER);
        //实现每秒时间释放性质的法术
        this.schedule(function(){
            //if(self.network === true) self.createByNetwork !== true
            this.magicSkill.releaseFunction(10);
        }, 0.3, cc.macro.REPEAT_FOREVER);

        //动画存在的话运行，增加代码的耐操性
        if(this.animation !== null) {
            //计算不同动画的开始时间
            for (var i = 0; i < 3; i++) {
                if(this.animation.animations[i].interval === 0){
                    this._interval[i] = (this.animation.animations[i].endNumber -
                        this.animation.animations[i].startNumber) * 1000 / 60 *
                        this.animation.animations[i].loops;
                }else{
                    this._interval[i] = (this.animation.animations[i].endNumber -
                        this.animation.animations[i].startNumber) * 1000 / 60 *
                        this.animation.animations[i].loops *
                        (this.animation.animations[i].interval * 1000 );
                }
            }

            //直接播放开始动画
            this.animation.play("start");

            //如果开始动画不是无限循环的话
            if(self._interval[0] >= 0) {
                //中段循环动画的开始
                setTimeout(function () {
                    if (self._interval[1] !== 0) {
                        self.animation.play("loop");
                    }
                        self.magicSkill.releaseFunction(8);
                }, this._interval[0]);

                //如果中间段动画不是无限循环的话
                if (self._interval[1] >= 0) {
                    //结束动画的开始
                    setTimeout(function () {
                        self.animation.play("end");
                        //循环结束
                        if (self.network === true || self.createByNetwork === false)
                            self.magicSkill.releaseFunction(9);
                    }, this._interval[0] + this._interval[1]);

                    //如果结束段动画不是无限循环的话
                    if (self._interval[2] >= 0) {
                        setTimeout(function () {
                            self.release();
                        }, this._interval[0] + this._interval[1] + this._interval[2]);
                    }
                }
            }
        }
    },

    judgeCondition:function(condition){
        return (condition === this.vanishCondition);
    },

    onCollisionEnter: function (other, self) {
        var typeMagic = cc.Enum({
            //常规法术
            normalMagic:0,
            //范围法术
            areaMagic:1,
            //指向性法术
            directionMagic:2
        });
        switch (this.magicType) {
            case typeMagic.normalMagic:
                if (other.node.group === "Unit" || other.node.group === "ViewUnit") {
                    //var script1 = other.node.getComponent('Unit');
                    //var stateScript = script1.stateNode.getComponent('CreatureState');

                    this.magicSkill.releaseFunction(2, other.node);
                }
                break;
            case typeMagic.areaMagic:
                if (other.node.group === "Unit" || other.node.group === "ViewUnit") {
                    //script1 = other.node.getComponent('Unit');
                    //stateScript = script1.stateNode.getComponent('CreatureState');
                    this.magicSkill.releaseFunction(2,other.node);
                }
                break;
            case typeMagic.directionMagic:
                var vanishType = cc.Enum({
                    //不消失
                    none: 0,
                    //碰撞次数到达后消失
                    time: 1,
                    //碰撞到敌方后消失
                    enemyHero: 2,
                    //碰撞到我方英雄后消失
                    myHero: 3,
                    //碰撞到敌方生物后消失
                    enemyCreature: 4,
                    //碰撞到我方生物后消失
                    myCreature: 5,
                    //碰撞到敌方生物后消失
                    enemyBase: 6,
                    //碰撞到我方生物后消失
                    myBase: 7,

                    sky: 8,
                    ground: 9,
                    leftOrRight: 10
                });
                if (other.node.group === "Ground") {
                    this.collisionTime++;
                        this.magicSkill.releaseFunction(3);
                    if (this.judgeCondition(vanishType.ground)) {
                        this.release();
                    }
                    //如果允许地面反弹的话
                    if (this.groundBounce === true) {
                        //y方向速度调整为反向
                        this.speed.y = - this.speed.y * this.elasticCoefficient;
                        //y坐标上提
                        this.node.y = this.node.getComponent(cc.BoxCollider).size.height / 2;
                    }
                    //this.node.removeFromParent();
                }
                if (other.node.group === "Sky") {
                    this.collisionTime++;
                        this.magicSkill.releaseFunction(4);
                    if (this.judgeCondition(vanishType.sky)) {
                        this.release();
                    }
                    if (this.skyBounce === true) {
                        this.speed.y = - this.speed.y * this.elasticCoefficient;
                        this.node.y = other.node.y - other.node.getComponent(cc.BoxCollider).size.height / 2
                        - this.node.getComponent(cc.BoxCollider).size.height / 2;
                    }
                }
                if (other.node.group === "LBound") {
                    this.collisionTime++;
                    if (this.team < 0) {
                            this.magicSkill.releaseFunction(5);
                    } else if (this.team > 0) {
                            this.magicSkill.releaseFunction(6);
                    }
                    if (this.judgeCondition(vanishType.leftOrRight)) {
                        this.release();
                    }
                    if (this.leftRightBounce === true)
                        this.speed.x = - this.speed.x * this.elasticCoefficient;
                }
                if (other.node.group === "RBound") {
                    this.collisionTime++;
                    if (this.team < 0) {
                            this.magicSkill.releaseFunction(6);
                    } else if (this.team > 0) {
                            this.magicSkill.releaseFunction(5);
                    }
                    if (this.judgeCondition(vanishType.leftOrRight)) {
                        this.release();
                    }
                    if (this.leftRightBounce === true)
                        this.speed.x = - this.speed.x * this.elasticCoefficient;
                }
                //cc.log(this.collisionTime);
                if (this.judgeCondition(vanishType.time) && this.collisionTime > this.collisionMaxTime) {
                    this.release();
                }

                if (other.node.group === "Unit" || other.node.group === "ViewUnit") {
                    //cc.log(other.node.group);
                    var script1 = other.node.getComponent('Unit');

                    if (this.heroBounce === true && script1.unitType === 1) {
                        this.speed.x = - this.speed.x * this.elasticCoefficient;
                        if (this.judgeCondition(vanishType.myHero) || this.judgeCondition(vanishType.enemyHero)) {
                            this.release();
                        }
                    }

                        this.magicSkill.releaseFunction(2, other.node);
                    if (script1.unitType === 0) {
                        if (this.judgeCondition(vanishType.myCreature) || this.judgeCondition(vanishType.enemyCreature)) {
                            this.release();
                        }
                    }
                }
                break;
        }
    },

    /**
     * @主要功能 动画完全完成以后的效果，如果不是网络创建而且不需要网络传递实体效果的话
     * @author C14
     * @Date 2018/5/11
     * @parameters
     * @returns
     */
    release: function(flag){
        var self = this;
        var typeMagic = cc.Enum({
            //常规法术
            normalMagic:0,
            //范围法术
            areaMagic:1,
            //指向性法术
            directionMagic:2
        });
        //if(this.logicNode === this.node){
        //    this.viewNode.getComponent("Magic").release(true);
        //}
        //如果是显示层那么不触发相应的效果
        //但是如果是控制过去让其播放死亡动画的话，那么release
        if(this.viewNode === this.node){
            switch (this.magicType)
            {
                case typeMagic.normalMagic:
                    this.node.removeFromParent();
                    this.node.destroy();
                    //self.GameManager.removeMagic(self.node);
                    break;
                case typeMagic.areaMagic:
                    this.node.removeFromParent();
                    this.node.destroy();
                    //self.GameManager.removeMagic(self.node);
                    break;
                case typeMagic.directionMagic:
                    if(this.hitEffect !== null)
                        this.sendEvent(this.hitEffect);
                    if(this.animation !== null) {
                        this.animation.play("end");
                    }

                    this._stopLock = true;
                    setTimeout(function () {
                        self.node.removeFromParent();
                        self.node.destroy();
                        //self.GameManager.removeMagic(self.node);
                    },this._interval[2]);
                    break;
            }
        }else {
            switch (this.magicType) {
                case typeMagic.normalMagic:
                    this.magicSkill.releaseFunction(1);
                    //self.node.removeFromParent();
                    //self.node.destroy();
                    self.node.removeFromParent();
                    self.node.destroy();
                    //self.GameManager.removeMagic(this.viewNode);
                    //self.GameManager.removeMagic(self.node);
                    break;
                case typeMagic.areaMagic:
                    this.magicSkill.releaseFunction(1);

                    self.node.removeFromParent();
                    self.node.destroy();
                    //self.GameManager.removeMagic(self.node);
                    break;
                case typeMagic.directionMagic:
                    //if (this.hitEffect !== null)
                    //    this.sendEvent(this.hitEffect);
                    //if (this.animation !== null) {
                    //    this.animation.play("end");
                    //}
                    this.magicSkill.releaseFunction(9);

                    this._stopLock = true;
                    setTimeout(function () {
                        self.magicSkill.releaseFunction(1);
                        //self.node.removeFromParent();
                        //self.node.destroy();
                        //self.GameManager.removeMagic(self.viewNode);
                        self.node.removeFromParent();
                        self.node.destroy();
                        //self.GameManager.removeMagic(self.node);
                    }, this._interval[2]);
                    break;
            }
        }
    },

    initMagic:function(detail){
        var self = this;
        var typeMagic = cc.Enum({
            //常规法术
            normalMagic:0,
            //范围法术
            areaMagic:1,
            //指向性法术
            directionMagic:2
        });

        this.team = detail.team;
        this.death = false;
        switch (this.magicType)
        {
            case typeMagic.normalMagic:
                //取单位队伍
                var unitTeam = this.team / Math.abs(this.team);
                var hero0Team = this.GameManager.heros[0].getComponent("Unit").team /
                    Math.abs(this.GameManager.heros[0].getComponent("Unit").team);
                if(this.position === -1){
                    if(unitTeam === hero0Team){
                        this.node.x = this.GameManager.heros[0].x;
                    }else{
                        this.node.x = this.GameManager.heros[1].x;
                    }
                }else{
                    this.node.x = globalConstant.sceneWidth * cc.director.getWinSize().width * (1 + unitTeam) / 2
                        - this.position * unitTeam;
                }
                break;
            case typeMagic.areaMagic:
            var box = this.node.getComponent(cc.BoxCollider);
                if(!(detail.area === 0 || detail.area === undefined)){
                    this.area = detail.area;
                    box.size.width = this.area;
                    box.size.height = 1000;
                }
                break;
            case typeMagic.directionMagic:
                if(this.speed.x === 0)
                this.speed.x = Math.sin((detail.angel + 90) * Math.PI / 180) * this.startSpeed;
                if(this.speed.y === 0)
                this.speed.y = Math.cos((detail.angel + 90) * Math.PI / 180) * this.startSpeed;
                break;
        }
        this.magicSkill = this.skillNode.getComponent("Skill");
    },
    updateByNet: function (fps) {
        //获得当前帧率下应当推进的速率
        var frameSpeed = globalConstant.frameRate / fps;
        if(this.magicType === 2) {
            if (this._stopLock === false) {
                this.speed.y -= this.gravity * frameSpeed;
                this.node.x += this.speed.x * frameSpeed;
                this.node.y += this.speed.y * frameSpeed;
            }
        }
        //如果自己是逻辑节点，此外另一个节点还未被销毁，那么进行一些同步的处理
        if(this.logicNode === this.node && cc.isValid(this.viewNode)) {
            if ((++ this.timer) % 6 === 5) {
                var action = cc.moveBy(
                    0.5,
                    this.node.x - this.viewNode.x,
                    this.node.y - this.viewNode.y
                );
                action.setTag(1);
                //暂停同步用的那个动画
                var animation = this.viewNode.getActionByTag(1);
                if(animation !== null) {
                    this.viewNode.stopAction(animation);
                }
                this.viewNode.runAction(action);
                //this.viewNode.position = cc.v2(this.node.x,this.node.y);
                //(this.viewNode.getComponent("Magic")).speed = this.speed;
                this.timer = 0;
            }
        }
    },
    /**
     * @主要功能 播放音效
     * @author C14
     * @Date 2017/12/12
     * @parameters
     * @returns
     */
    sendEvent:function(audioChip,fullVolume,volume) {
        var eventsend = new cc.Event.EventCustom("playEffect", true);
        if(volume === undefined || volume === null){
            volume = 1;
        }
        fullVolume = !(fullVolume === undefined || fullVolume === null || fullVolume === false)
        eventsend.setUserData({
            effect:audioChip,
            volume:volume,
            fullVolume:fullVolume,
            target:this.node
        });
        this.node.dispatchEvent(eventsend);
    },

    /**
     * @��Ҫ����:   ��ʼ��ע�������
     * @parameters Manager
     */
    fnGetManager:function(Manager){
        this.GameManager = Manager;
    },
    // called every frame, uncomment this function to activate update callback
    //update: function (dt) {
    //},
});

