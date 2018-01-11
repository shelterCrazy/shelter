//var SmallMap = require('SmallMap');
var globalConstant = require("Constant");
var Global = require("Global");
/**
 * @主要功能:  游戏主流程控制器
 * @type {Function}
 */
var MainGameManager = cc.Class({
    extends: cc.Component,

    properties: {
        //各种小兵预制
        creaturePrefab: [cc.Prefab],
        //全部法术预制
        magicPrefab: [cc.Prefab],
        //全部咏唱预制
        chantPrefab:cc.Prefab,
        //生物节点
        creatures: [cc.Node],
        //英雄节点(2个)
        heros: [cc.Node],
        ////逻辑层
        //logicLayer: cc.Node,    //背景节点
        //基地层
        baseLayer: cc.Node,
        //生物层
        creatureLayer: cc.Node,
        //魔法层
        magicLayer: cc.Node,

        //小地图节点
        mapLayer: cc.Node,
        //右下角定时器的节点
        timerLayer: cc.Node,
        //摄像机节点
        cameraLayer:cc.Node,


        audioSource: cc.AudioSource,

        //基地预制
        base: cc.Prefab,
        //左侧玩家
        baseData1:0,
        //yoo侧玩家
        baseData2:0,
        
        baseOffset:0,
        
        delay:0
    },

    onLoad: function () {

        //获取基地节点，将预制实例化
        var baseNode = cc.instantiate(this.base);
        //获取基地节点的js脚本
        var script1 = baseNode.getComponent('Base');
        var baseNode2 = cc.instantiate(this.base);
        var script2 = baseNode2.getComponent('Base');

        //获取网络脚本
        this.network = this.node.getComponent("network");

        //初始化两个基地坐标，以及注入一些关键数据
        script1.init(this.baseData1,-this.baseOffset,-1);
        script1.hero = this.heros[0].getComponent("Player");

        //基地层添加上述节点
        this.baseLayer.addChild(baseNode);
        script2.init(this.baseData2,this.baseOffset,1);
        script2.hero = this.heros[1].getComponent("Player");
        this.baseLayer.addChild(baseNode2);

        script1.hero.init({team:Global.nowTeam});
        script2.hero.init({team:- Global.nowTeam});

        //碰撞系统打开
        cc.director.getCollisionManager().enabled = true;

        //获取小地图脚本
        var mapScript = this.mapLayer.getComponent("SmallMap");
        //英雄标记中添加两个英雄节点（方便坐标获取）
        mapScript.fnCreateHeroSign(this.heros[0]);
        mapScript.fnCreateHeroSign(this.heros[1]);

        //获取时间记录器脚本，此脚本负责自动推进时间轴
        this.timerLayerScript = this.timerLayer.getComponent("GameTimer");

        //每隔一段时间召唤一个小怪
        //this.schedule(function() {
        //    var eventsend = new cc.Event.EventCustom('creatureCreate',true);
        //    eventsend.setUserData({X:(cc.director.getWinSize().width * globalConstant.sceneWidth),Y:null,attack:2,health:10,team:1,velocity:3,id:1});
        //
        //    this.node.dispatchEvent(eventsend);
        //},2);

        //创建npc 小地图节点 事件
        this.node.on('creatureCreate',this.creatureCreate,this);
        //创建咏唱法术事件
        this.node.on('chantCreate',this.chantCreate,this);
        //英雄死亡事件
        this.node.on('heroDeath',this.heroDeath,this);
        //魔法创建事件
        this.node.on('magicCreate',this.magicCreate,this);
        //游戏是否获胜事件
        this.node.on('isWin',this.isWin,this);
        //音效播放事件
        this.node.on('playEffect',this.playEffect,this);
            
    },

    /**
     * @主要功能 判断胜利，胜利就返回到初始场景中
     * @author C14
     * @Date 2017/11/19
     * @parameters
     * @returns
     */
    isWin:function(event){
        //this.current = cc.audioEngine.play(this.audio, false, 1);
        //this.audio.schedule(back());
        //var back = function(){
            cc.director.loadScene("MainScene");
        //}
    },

    /**
     * @主要功能 负责处理传输上来的音效，直接播放
     * @author C14
     * @Date 2018/1/2
     * @parameters
     * @returns
     */
    playEffect:function(event){
        var volume = 1;
        if(event.detail.fullVolume === false) {
            if (Math.abs(this.cameraLayer.x - event.detail.target.x) <
                globalConstant.sceneWidth * cc.director.getWinSize().width / 2) {
                volume = 1 - Math.abs(this.cameraLayer.x - event.detail.target.x) /
                    (globalConstant.sceneWidth * cc.director.getWinSize().width / 2);
            } else {
                volume = 0;
            }
        }
        //播放音效
        //cc.audioEngine.playEffect(event.detail.effect,false,event.detail.volume * volume);
    },

    /**
     * @主要功能 英雄死亡后运行一个定时器，即，复活英雄
     * @author C14
     * @Date 2017/12/20
     * @parameters
     * @returns
     */
    heroDeath:function(event){
        //让Y坐标下去
        event.detail.heroScript.node.y = -1000;
        //定时器，死亡次数越多复活需要越长的时间
        this.scheduleOnce(function() {
            //复活的x坐标根据队伍而选择左右
            event.detail.heroScript.node.x = cc.director.getWinSize().width * globalConstant.sceneWidth / 2
                + cc.director.getWinSize().width * globalConstant.sceneWidth / 2 * event.detail.heroScript.team;
            //运行英雄内部的复活接口
            event.detail.heroScript.relive();

        },8*(event.detail.heroScript.deathTimes));
        event.detail.heroScript.node.opacity = 0;
        event.stopPropagation();
    },

    /**
     * @主要功能:  创建法术
     *              建议以后改用资源池获取节点   资源池使用工厂创建节点，这里可以负责初始化节点属性
     * @author C14
     * @Date 2017/11/01 13:04
     * @param event
     */
    magicCreate: function(event){  //event为父类事件  实际这里是Event.EventCustom子类
        this.network.roomMsg('roomChat',{name:"magicCreate",detail:event.detail});
        //kenan 实验证明  事件是同步的  计时器是异步的
        // this.scheduleOnce(function() {

            /** kenan 这里获取npc的资源方法可以改为，使用资源池获取npc节点*/
            var mag = cc.instantiate(this.magicPrefab[event.detail.id]);
            var magScript = mag.getComponent('Magic' + event.detail.id);

     //       magScript.fnCreateMagic(event.detail);//初始化npc属性
            mag.x = event.detail.position;
        if(event.detail.y === null){
            mag.y = globalConstant.magicY;
        }else{
            mag.y = event.detail.y;
        }
        this.magicLayer.addChild(mag);
        magScript.initMagic(event.detail);
        //停止事件冒泡(停止继续向上传递此事件)
        event.stopPropagation();
    },
    /**
     * @主要功能    网络模块调用此代码
     *               创建其他人的法术
     * @author C14
     * @Date 2018/1/9
     * @parameters
     * @returns
     */
    magicCreateNetwork: function(data){
        /** kenan 这里获取npc的资源方法可以改为，使用资源池获取npc节点*/
        var mag = cc.instantiate(this.magicPrefab[data.id]);
        var magScript = mag.getComponent('Magic' + data.id);

        // magScript.fnCreateMagic(event.detail);//初始化npc属性
        mag.x = data.position;
        if(data.y === null){
            mag.y = globalConstant.magicY;
        }else{
            mag.y = data.y;
        }
        this.magicLayer.addChild(mag);
        magScript.initMagic(data);
    },

    /**
     * @主要功能:  创建生物节点
     *              建议以后改用资源池获取节点   资源池使用工厂创建节点，这里可以负责初始化节点属性
     * @author kenan
     * @Date 2017/7/23 0:25
     * @param event
     */
    creatureCreate: function(data){  //event为父类事件  实际这里是Event.EventCustom子类

        this.network.roomMsg('roomChat',{name:"creatureCreate",detail:data.detail});
        //kenan 实验证明  事件是同步的  计时器是异步的
        // this.scheduleOnce(function() {
        /** kenan 这里获取npc的资源方法可以改为，使用资源池获取npc节点*/
        var npc = cc.instantiate(this.creaturePrefab[data.detail.id]);
        var npcScript = npc.getComponent("Creature");

        var mapScript = this.mapLayer.getComponent("SmallMap");

        var detail = data.detail;
        detail.Y = detail.Y === null ? globalConstant.summonY : detail.Y;

        npcScript.fnGetManager(this);

        this.creatures.push(npc);

        mapScript.fnCreateCreatureSign(this.creatures[this.creatures.length - 1]);
        npcScript.fnCreateCreature(detail);//初始化npc属性
        this.creatureLayer.addChild(this.creatures[this.creatures.length - 1]);

        //kenan 停止事件冒泡   (停止继续向上传递此事件)
        data.stopPropagation();

        // console.log("creatureCreate结束");

        // });
    },
    /**
     * @主要功能    网络模块调用此代码
     *               创建其他人的生物
     * @author C14
     * @Date 2018/1/9
     * @parameters
     * @returns
     */
    creatureCreateNetwork: function(data){
        //kenan 实验证明  事件是同步的  计时器是异步的
        // this.scheduleOnce(function() {
        /** kenan 这里获取npc的资源方法可以改为，使用资源池获取npc节点*/
        var npc = cc.instantiate(this.creaturePrefab[data.id]);
        var npcScript = npc.getComponent("Creature");

        var mapScript = this.mapLayer.getComponent("SmallMap");

        var detail = data;
        detail.Y = detail.Y === null ? globalConstant.summonY : detail.Y;

        npcScript.fnGetManager(this);

        this.creatures.push(npc);

        mapScript.fnCreateCreatureSign(this.creatures[this.creatures.length - 1]);
        npcScript.fnCreateCreature(detail);//初始化npc属性
        this.creatureLayer.addChild(this.creatures[this.creatures.length - 1]);
    },
    /**
     * @主要功能:  创建吟唱
     *              建议以后改用资源池获取节点   资源池使用工厂创建节点，这里可以负责初始化节点属性
     * @author C14
     * @Date 2017/11/17 20:03
     * @param event
     */
    chantCreate: function(event){  //event为父类事件  实际这里是Event.EventCustom子类
        this.network.roomMsg('roomChat',{name:"chantCreate",detail:event.detail});

        /** kenan 这里获取npc的资源方法可以改为，使用资源池获取npc节点*/
        var chantMag = cc.instantiate(this.chantPrefab);
        var chantMagScript = chantMag.getComponent('Chant');


        chantMagScript.percent = this.timerLayerScript.timer/this.timerLayerScript.maxTimer;
        chantMagScript.fnInitChant(event.detail);
        this.timerLayer.addChild(chantMag);
        //       magScript.fnCreateMagic(event.detail);//初始化npc属性



        //kenan 停止事件冒泡   (停止继续向上传递此事件)
        event.stopPropagation();

        // console.log("creatureCreate结束");

        // });
    },
    /**
     * @主要功能    网络模块调用此代码
     *               创建其他人的咏唱法术
     * @author C14
     * @Date 2018/1/9
     * @parameters
     * @returns
     */
    chantCreateNetwork: function(data){  //event为父类事件  实际这里是Event.EventCustom子类

        //kenan 实验证明  事件是同步的  计时器是异步的
        // this.scheduleOnce(function() {

        /** kenan 这里获取npc的资源方法可以改为，使用资源池获取npc节点*/
        var chantMag = cc.instantiate(this.chantPrefab);
        var chantMagScript = chantMag.getComponent('Chant');

        //       magScript.fnCreateMagic(event.detail);//初始化npc属性
        chantMagScript.percent = this.timerLayerScript.timer/this.timerLayerScript.maxTimer;
        chantMagScript.fnInitChant(data);
        this.timerLayer.addChild(chantMag);
    },
    /**
     * @主要功能 调整敌人的血量，速度方向，X坐标
     * @author C14
     * @Date 2018/1/9
     * @parameters
     * @returns
     */
    changeEnemyMove:function(data){
        var script = this.heros[1].getComponent("Player");
        this.heros[1].x = data.x;
        script.accLeft = data.accLeft;
        script.accRight = data.accRight;
        script.health = data.health;
    },

    /**
     * @主要功能: 释放小兵节点
     *          建议使用资源池回收节点
     * @param node
     */
    removeCreature: function(node){
        var i = 0;
        var script = node.getComponent('Creature');
        var mapScript = this.mapLayer.getComponent('SmallMap');
        mapScript.fnDeleteSign(node);
        for(i = 0;i < this.creatures.length; i++){
            if( this.creatures[i] === node){
                
                //this.creatures[i].removeFromParent();
                this.creatures.splice(i,1);
            }
        }

        //kenan 因为没有回收池  这里需要释放资源
//        node.destroy();

    }
    
});

