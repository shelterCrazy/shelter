//var SmallMap = require('SmallMap');
var globalConstant = require("Constant");
/**
 * @主要功能:  游戏主流程控制器
 * @type {Function}
 */
var MainGameManager = cc.Class({
    extends: cc.Component,

    properties: {
        creaturePrefab: [cc.Prefab],  //小兵预制节点
        magicPrefab: [cc.Prefab],
        chantPrefab:cc.Prefab,
        creatures: [cc.Node],
        heros: [cc.Node],
        logicLayer: cc.Node,    //背景节点
        baseLayer: cc.Node,    //基地节点
        creatureLayer: cc.Node,    //生物节点
        magicLayer: cc.Node,    //魔法节点
        mapLayer: cc.Node,    //小地图
        timerLayer: cc.Node,    //小地图

        cameraLayer:cc.Node,//摄像头节点

        audioSource: cc.AudioSource,

        base: cc.Prefab,
        //左侧玩家
        baseData1:0,
        //yoo侧玩家
        baseData2:0,
        
        baseOffset:0,
        
        delay:0,
    },

    onLoad: function () {

        var baseNode = cc.instantiate(this.base);
        var script01 = baseNode.getComponent('Base');
        var baseNode2 = cc.instantiate(this.base);
        var script2 = baseNode2.getComponent('Base');

        script01.init(this.baseData1,-this.baseOffset,-1);
        script01.hero = this.heros[0].getComponent("Player");
        this.baseLayer.addChild(baseNode);

        script2.init(this.baseData2,this.baseOffset,1);
        script2.hero = this.heros[1].getComponent("Player");
        this.baseLayer.addChild(baseNode2);

        cc.director.getCollisionManager().enabled = true;

        var mapScript = this.mapLayer.getComponent("SmallMap");
        mapScript.fnCreateHeroSign(this.heros[0]);
        mapScript.fnCreateHeroSign(this.heros[1]);

        this.timerLayerScript = this.timerLayer.getComponent("GameTimer");
        this.schedule(function() {
            var eventsend = new cc.Event.EventCustom('creatureCreate',true);
            eventsend.setUserData({X:(cc.director.getWinSize().width * globalConstant.sceneWidth),Y:null,attack:2,health:10,team:1,velocity:3,id:1});

            this.node.dispatchEvent(eventsend);
        },2);

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

    isWin:function(event){
        //this.current = cc.audioEngine.play(this.audio, false, 1);
        //this.audio.schedule(back());
        //var back = function(){
            cc.director.loadScene("MainScene");
        //}
    },
    //播放音效回调函数
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
        cc.audioEngine.playEffect(event.detail.effect,false,event.detail.volume * volume);
    },

    heroDeath:function(event){

        //var i = 0;
        //for(i;i<2;i++){
        //    if(this.heros[i] === event.detail.heroScript.node){
        //        this.heroFocus = i;
        //    }
        //}
        event.detail.heroScript.node.y = -1000;
        this.scheduleOnce(function() {
            // 这里的 this 指向 component
            event.detail.heroScript.node.x = cc.director.getWinSize().width * globalConstant.sceneWidth / 2
                + cc.director.getWinSize().width * globalConstant.sceneWidth / 2 * event.detail.heroScript.team;
            event.detail.heroScript.node.y = -85
            event.detail.heroScript.node.opacity = 1000;
            event.detail.heroScript.relive();

        },8*(event.detail.heroScript.deathTimes));
        event.detail.heroScript.node.opacity = 0;
        event.stopPropagation();
    },

    /**
     * @主要功能:  创建魔法
     *              建议以后改用资源池获取节点   资源池使用工厂创建节点，这里可以负责初始化节点属性
     * @author C14
     * @Date 2017/11/01 13:04
     * @param event
     */
    magicCreate: function(event){  //event为父类事件  实际这里是Event.EventCustom子类

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


        //cc.log(event.detail.y);
            //this.logicLayer.addChild(mag);

            
            //cc.log(event.detail.y);

            //kenan 停止事件冒泡   (停止继续向上传递此事件)
            event.stopPropagation();

            // console.log("creatureCreate结束");

        // });
    },
    /**
     * @主要功能:  创建生物节点
     *              建议以后改用资源池获取节点   资源池使用工厂创建节点，这里可以负责初始化节点属性
     * @author kenan
     * @Date 2017/7/23 0:25
     * @param event
     */
    creatureCreate: function(event){  //event为父类事件  实际这里是Event.EventCustom子类

        //kenan 实验证明  事件是同步的  计时器是异步的
        // this.scheduleOnce(function() {
        /** kenan 这里获取npc的资源方法可以改为，使用资源池获取npc节点*/
        var npc = cc.instantiate(this.creaturePrefab[event.detail.id]);
        var npcScript = npc.getComponent("Creature");

        var mapScript = this.mapLayer.getComponent("SmallMap");

        var detail = event.detail;
        cc.log(detail.Y);
        detail.Y = detail.Y === null ? globalConstant.summonY : detail.Y;

        npcScript.fnGetManager(this);

        this.creatures.push(npc);

        mapScript.fnCreateCreatureSign(this.creatures[this.creatures.length - 1]);
        this.creatureLayer.addChild(this.creatures[this.creatures.length - 1]);
        npcScript.fnCreateCreature(detail);//初始化npc属性
        //kenan 停止事件冒泡   (停止继续向上传递此事件)
        event.stopPropagation();

        // console.log("creatureCreate结束");

        // });
    },
    /**
     * @主要功能:  创建吟唱
     *              建议以后改用资源池获取节点   资源池使用工厂创建节点，这里可以负责初始化节点属性
     * @author C14
     * @Date 2017/11/17 20:03
     * @param event
     */
    chantCreate: function(event){  //event为父类事件  实际这里是Event.EventCustom子类

        //kenan 实验证明  事件是同步的  计时器是异步的
        // this.scheduleOnce(function() {

        /** kenan 这里获取npc的资源方法可以改为，使用资源池获取npc节点*/
        var chantMag = cc.instantiate(this.chantPrefab);
        var chantMagScript = chantMag.getComponent('Chant');
        this.timerLayer.addChild(chantMag);
        //       magScript.fnCreateMagic(event.detail);//初始化npc属性
        chantMagScript.percent = this.timerLayerScript.timer/this.timerLayerScript.maxTimer;

        chantMagScript.fnInitChant(event.detail);

        //cc.log(event.detail.y);
        //this.logicLayer.addChild(mag);


        //cc.log(event.detail.y);

        //kenan 停止事件冒泡   (停止继续向上传递此事件)
        event.stopPropagation();

        // console.log("creatureCreate结束");

        // });
    },

    dataGet:function(event){
        var i = 0,record = Number.POSITIVE_INFINITY,j = 0;
        var targetCreature = event.detail.target;
        var targetScript = targetCreature.getComponent('Creature');
        var script = null;
        var target = null,targetType = -1;
        var distance = 0;

        for(i = 0;i < this.creatures.length; i++){
            script = this.creatures[i].getComponent('Creature');
            if(script.death === false){
                distance = Math.abs( this.creatures[i].x - targetCreature.x);
                if( this.creatures[i] === targetCreature){
                    j = i;
                }else{
                    if(script.team !== targetScript.team  && distance < record){
                        record = distance;
                        target = this.creatures[i];
                        targetType = 1;
                    }
                }
            }
        }
        for(i = 0;i < this.heros.length; i++){
            script = this.heros[i].getComponent('Player');
            if(script.death === false){
                distance = Math.abs( this.heros[i].x - targetCreature.x);
                if(script.team !== targetScript.team && distance < record){
                    record = distance;
                    target = this.heros[i];
                    targetType = 0;
                }
            }
        }
        if(target !== null){
            if( record < target.width/2 + targetCreature.width/2){

                /*if( targetType !== 0){
                 this.removeCreature(target);
                 }*/
                targetScript.move = false;
            }else{
                targetScript.move = true;
            }
        }

        script = event.detail.target.getComponent('Creature');
        script.focusTarget = target;
        script.focusType = targetType;
        script.targetX = target === null ? null : target.x;   //kenan 单独记录坐标x

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

