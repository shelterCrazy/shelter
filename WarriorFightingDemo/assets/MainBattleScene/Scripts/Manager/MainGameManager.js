//var SmallMap = require('SmallMap');
var globalConstant = require("Constant");
var Global = require("Global");
var CardData = require("CardData");
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
        //全部法术,生物预制
        unitPrefab: [cc.Prefab],
        //生物节点
        creatures: [cc.Node],
        //英雄节点(2个)
        heros: [cc.Node],

        heroPrefab: [cc.Prefab],
        ////逻辑层
        //logicLayer: cc.Node,    //背景节点
        //基地层
        baseLayer: cc.Node,
        //生物层
        creatureLayer: cc.Node,
        //魔法层
        magicLayer: cc.Node,

        heroLayer: cc.Node,
        //战争迷雾层
        fogLayer:cc.Node,
        mapFogLayer:cc.Node,


        drawCardNode:cc.Node,
        //小地图节点
        mapLayer: cc.Node,
        //右下角定时器的节点
        timerLayer: cc.Node,
        //摄像机节点
        cameraLayer:cc.Node,
        //摄像机跟随节点
        cameraFollow:cc.Node,

        audioSource: cc.AudioSource,
        //战争迷雾预制
        fogPrefab:cc.Prefab,
        mapFogPrefab:cc.Prefab,

        //基地预制
        base: cc.Prefab,
        //左侧玩家
        baseData1:0,
        //yoo侧玩家
        baseData2:0,
        
        baseOffset:0,
        
        delay:0,

        //胜利，失败面板
        winPanel:cc.Node,
        losePanel:cc.Node,

        backGroundMusic:cc.AudioClip
    },
    getCard:function(dat) {
        var heroScript = this.heros[0].getComponent("Hero");
        cc.log(dat);
        heroScript.getCertainCard(4);
    },
    onLoad: function () {

        var self = this;
        //获取基地节点，将预制实例化
        var baseNode = cc.instantiate(this.base);
        //获取基地节点的js脚本
        var script1 = baseNode.getComponent('Base');
        var baseNode2 = cc.instantiate(this.base);
        var script2 = baseNode2.getComponent('Base');

        //获取网络脚本
        this.network = this.node.getComponent("network");
        //获取小地图脚本
        var mapScript = this.mapLayer.getComponent("SmallMap");

        this.heroCreate(0,-1);
        this.heroCreate(0,1);

        var cameraScript = this.cameraLayer.getComponent("CameraControl");

        cameraScript.targets[0] = this.heros[0];
        cameraScript.target = cameraScript.targets[0];

        //初始化两个基地坐标，以及注入一些关键数据
        script1.init(this.baseData1,-this.baseOffset,-1);


        if(globalConstant.fogOpen) {
            for (var i = globalConstant.fogStart; i < globalConstant.fogEnd; i += globalConstant.fogOffset) {
                var fogNode = cc.instantiate(this.fogPrefab);
                var fogNodeScript = fogNode.getComponent("Fog");

                var mapFogNode = cc.instantiate(this.mapFogPrefab);
                mapFogNode.y = 0;
                fogNodeScript.mapFogNode = mapFogNode;
                this.fogLayer.addChild(fogNode);
                fogNode.x = (globalConstant.sceneWidth * cc.director.getWinSize().width) *
                    (1 + script1.hero.team / Math.abs(script1.hero.team)) / 2 -
                    script1.hero.team / Math.abs(script1.hero.team) * i;
                cc.log(fogNode.x * globalConstant.smallMapLength / globalConstant.width /
                    cc.director.getWinSize().width);
                mapFogNode.x = fogNode.x * globalConstant.smallMapLength / globalConstant.sceneWidth /
                    cc.director.getWinSize().width;
                this.mapFogLayer.addChild(mapFogNode);
            }
        }
        //碰撞系统打开
        //cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabled = true;
        cc.director.getPhysicsManager().enabled = true;

        //英雄标记中添加两个英雄节点（方便坐标获取）
        this.heros[0].getComponent("Unit")._mapSign = mapScript.fnCreateHeroSign(this.heros[0]);
        this.heros[1].getComponent("Unit")._mapSign = mapScript.fnCreateHeroSign(this.heros[1]);

        //获取时间记录器脚本，此脚本负责自动推进时间轴
        this.timerLayerScript = this.timerLayer.getComponent("GameTimer");

        for(i = 0;i < 400; i++) {
            self.magicPrefab[i] = null;
        }
        var url = "Prefab/Magic/Sprite";
        cc.loader.loadResDir(url,cc.Prefab, function (err, results) {
            if (err) {
                cc.error("失败了!!%s",err);
                cc.log(err);
            }else{
                for(var i = 0;i < results.length; i++) {
                    var magicNode = cc.instantiate(results[i]);

                    var scripts = magicNode.getComponent("Magic");

                    self.magicPrefab[scripts.id] = results[i];
                }
            }
        });
        url = "Prefab/Magic/Chaos";
        cc.loader.loadResDir(url,cc.Prefab, function (err, results) {
            if (err) {
                cc.error("失败了!!%s",err);
                cc.log(err);
            }else{
                for(var i = 0;i < results.length; i++) {
                    var magicNode = cc.instantiate(results[i]);

                    var scripts = magicNode.getComponent("Magic");

                    self.magicPrefab[scripts.id] = results[i];
                }
            }
        });
        url = "Prefab/Magic/Science";
        cc.loader.loadResDir(url,cc.Prefab, function (err, results) {
            if (err) {
                cc.error("失败了!!%s",err);
                cc.log(err);
            }else{
                for(var i = 0;i < results.length; i++) {
                    var magicNode = cc.instantiate(results[i]);

                    var scripts = magicNode.getComponent("Magic");
                    self.magicPrefab[scripts.id] = results[i];
                }
            }
        });

        //this.creaturePool = [];
        //for(i = 0;i < 20; i++) {
        //    if(self.creaturePrefab[i] !== null){
        //        this.creaturePool[i] = new cc.NodePool();
        //        let initCount = 30;
        //        for (var j = 0; j < initCount; j++) {
        //            //var creatureObject = ;
        //            this.creaturePool[i].put(cc.instantiate(this.creaturePrefab[i])); // 通过 putInPool 接口放入对象池
        //        }
        //    }
        //}
        setTimeout(function(){
            self.magicPool = [];
            for(i = 0;i < 400; i++) {
                if(self.magicPrefab[i] !== null){
                    self.magicPool[i] = new cc.NodePool(); 
                    var initCount = 10;
                    for (var j = 0; j < initCount; j++) {
                        //var magicObject = ;
                        self.magicPool[i].put(cc.instantiate(self.magicPrefab[i])); // 通过 putInPool 接口放入对象池
                    }
                }
            }
        },2000);
        
        //var data = false;
        ////每隔一段时间召唤一个小怪
        //this.schedule(function() {
        //    var eventsend = new cc.Event.EventCustom('creatureCreate',true);
        //    var eventsend2 = new cc.Event.EventCustom('creatureCreate',true);
        //    eventsend.setUserData({X:(cc.director.getWinSize().width * globalConstant.sceneWidth),Y:null,attack:1,health:5,team:1,speed:10,id:1});
        //    eventsend2.setUserData({X:0,Y:null,attack:1,health:5,team:-1,speed:10,id:1});
        //
        //    data = ~data;
        //    if(data) {
        //        this.node.dispatchEvent(eventsend2);
        //        this.node.dispatchEvent(eventsend);
        //    }else{
        //        this.node.dispatchEvent(eventsend);
        //        this.node.dispatchEvent(eventsend2);
        //    }
        //},1);



        //创建npc 小地图节点 事件
        this.node.on('creatureCreate',this.creatureCreate,this);

        this.node.on('animationCreate',this.animationCreate,this);
        //创建咏唱法术事件
        this.node.on('chantCreate',this.chantCreate,this);
        //英雄死亡事件
        this.node.on('heroDeath',this.heroDeath,this);
        //魔法创建事件
        this.node.on('magicCreate',this.magicCreate,this);
        //游戏是否获胜事件
        this.node.on('isWin',this.isWin,this);
        //游戏是否获胜,调出胜利，失败界面
        this.node.on('callWinLosePanel',this.callWinLosePanel,this);
        //音效播放事件
        this.node.on('playEffect',this.playEffect,this);

        cc.audioEngine.playMusic(this.backGroundMusic,true);
            
    },

    /**
     * @主要功能 判断胜利，胜利就返回到初始场景中
     * @author C14
     * @Date 2017/11/19
     * @parameters
     * @returns
     */
    isWin:function(e){
        var script = this.cameraLayer.getComponent("CameraControl");
        var self = this;
        script.targets[1].x = script.targets[0].x;
        script.target = script.targets[1];
        this.heros[0].active = false;
        this.heros[1].active = false;
        this.creatureLayer.active = false;
        this.magicLayer.active = false;
        this.cameraFollow.runAction(
            cc.sequence(
                cc.moveTo(3,e.detail.position,0),
                cc.callFunc(function(){
                    e.detail.baseScript.playEndAnimation();
                },this)
            )
        );
        e.stopPropagation();
    },
    /**
     * @主要功能 判断胜利，调出胜利失败的面板
     * @author C14
     * @Date 2017/11/19
     * @parameters
     * @returns
     */
    callWinLosePanel:function(e){
        var script = this.heros[0].getComponent("Player");
        var win = (script.team / Math.abs(script.team) !== e.detail.loseTeam);
        if(win === true){
            this.winPanel.active = true;
        }else{
            this.losePanel.active = true;
        }
        e.stopPropagation();
    },
    backToMainScene:function(){
        cc.director.loadScene('MainScene');
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
        var cameraRatioEffect = Math.pow(globalConstant.cameraRatio,4);
        //播放音效
        cc.audioEngine.playEffect(
            event.detail.effect,false,
            event.detail.volume * volume *
            Global.mainEffectVolume * Global.mainVolume * (cameraRatioEffect)
        );
        event.stopPropagation();
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
        //event.detail.heroScript.node.y = -1000;
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
        if(event.detail.network === undefined || event.detail.network === true) {
            this.network.roomMsg('roomChat', {name: "magicCreate", detail: event.detail});
        }
        //kenan 实验证明  事件是同步的  计时器是异步的
        // this.scheduleOnce(function() {
            var mag = null;
        /** kenan 这里获取npc的资源方法可以改为，使用资源池获取npc节点*/
        if(event.detail.prefab === undefined || event.detail.prefab === null){
            if (this.magicPool[event.detail.id].size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
                mag = this.magicPool[event.detail.id].get();
            } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                mag = cc.instantiate(this.magicPrefab[event.detail.id]);
            }
            //var mag = cc.instantiate();
        }else{
            mag = cc.instantiate(event.detail.prefab);
        }
        var magScript = mag.getComponent("Magic");
        magScript.fnGetManager(this);

        if(event.detail.position === null) {

        }else{
            mag.x = event.detail.position;
        }

        if(event.detail.y === null){
            mag.y = globalConstant.magicY;
        }else{
            mag.y = event.detail.y;
        }
        
        this.magicLayer.addChild(mag);
        magScript.init();
        magScript.initMagic(event.detail);

        //if(data.detail.battleCry !== undefined && data.detail.battleCry === true){
        magScript.magicSkill.releaseFunction(0);
        //}
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
        var mag = null;
        if (this.magicPool[data.id].size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            mag = this.magicPool[data.id].get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            mag = cc.instantiate(this.magicPrefab[data.id]);
        }
        //var mag = cc.instantiate(this.magicPrefab[data.id]);

        var magScript = mag.getComponent("Magic");

        magScript.createByNetwork = true;
        magScript.fnGetManager(this);
        // magScript.fnCreateMagic(event.detail);//初始化npc属性
        mag.x = data.position;
        if(data.y === null){
            mag.y = globalConstant.magicY;
        }else{
            mag.y = data.y;
        }
        
        this.magicLayer.addChild(mag);
        magScript.init();
        magScript.initMagic(data);
        magScript.magicSkill.releaseFunction(0);
    },

    /**
     * @主要功能:  创建生物节点
     *              建议以后改用资源池获取节点   资源池使用工厂创建节点，这里可以负责初始化节点属性
     * @author kenan
     * @Date 2017/7/23 0:25
     * @param data
     */
    creatureCreate: function(data){  //event为父类事件  实际这里是Event.EventCustom子类
        if(data.detail.network === undefined || data.detail.network === true) {
            this.network.roomMsg('roomChat', {name: "creatureCreate", detail: data.detail});
        }
        var npc = null;
        //kenan 实验证明  事件是同步的  计时器是异步的
        // this.scheduleOnce(function() {
        /** kenan 这里获取npc的资源方法可以改为，使用资源池获取npc节点*/
        if(data.detail.prefab === undefined || data.detail.prefab === null){
            //if (this.creaturePool[data.detail.id].size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
                //npc = this.creaturePool[data.detail.id].get();
            //} else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                npc = cc.instantiate(this.creaturePrefab[data.detail.id]);
            //}
            //enemy.parent = parentNode; // 将生成的敌人加入节点树
            //enemy.getComponent('Enemy').init(); //接下来就可以调用 enemy 身上的脚本进行初始化
            //npc = cc.instantiate(this.creaturePrefab[data.detail.id]);
        }else{
            npc = cc.instantiate(data.detail.prefab);
        }
        var npcScript = npc.getComponent("Unit");

        var mapScript = this.mapLayer.getComponent("SmallMap");

        var detail = data.detail;
        detail.Y = detail.Y === null ? globalConstant.summonY : detail.Y;

        npcScript.fnGetManager(this);

        this.creatures.push(npc);

        npcScript.initUnit(detail);//初始化npc属性
        npcScript._mapSign = mapScript.fnCreateCreatureSign(npc);

        if(npcScript.team * this.heros[0].getComponent("Unit").team > 0){
            npcScript.focusTarget = this.heros[1];
        }else{
            npcScript.focusTarget = this.heros[0];
        }
        
        this.creatureLayer.addChild(this.creatures[this.creatures.length - 1]);
        if(data.detail.battleCry !== undefined && data.detail.battleCry === true){
            npcScript.skillComponent.releaseFunction(0);
        }


        //kenan 停止事件冒泡   (停止继续向上传递此事件)
        data.stopPropagation();

        // console.log("creatureCreate结束");

        // });
    },
    /**
     * @主要功能 创建英雄
     * @author
     * @Date 2018/4/18
     * @parameters
     * @returns
     */
    heroCreate: function(heroId,team){


        var hero = cc.instantiate(this.heroPrefab[heroId]);
        var heroScript = hero.getComponent("Hero");
        var unitScript = hero.getComponent("Unit");
        unitScript.fnGetManager(this);
        unitScript.initUnit({
            team: team,
            X: (team/Math.abs(team) / 2 + 1 / 2) * cc.director.getWinSize().width * globalConstant.sceneWidth,
            Y: globalConstant.heroY
        });
        heroScript.drawCardNode = this.drawCardNode;
        heroScript.init({
            team: team
        });
        if(team === Global.nowTeam) {
            this.heros[0] = hero;
        }else{
            this.heros[1] = hero;
            heroScript.self = false;
        }
            this.heroLayer.addChild(hero);
        //基地层添加上述节点
        //this.baseLayer.addChild(baseNode);
        //script2.init(this.baseData2,this.baseOffset,1);
        //script2.hero = this.heros[1].getComponent("Hero");
        //var newscript2 = this.heros[1].getComponent("Unit");
        //newscript2.fnGetManager(this);
        //newscript2.initUnit({
        //    team:-Global.nowTeam
        //});
        //script1.hero.init({team:Global.nowTeam});
        //script2.hero.init({team:- Global.nowTeam});

    },
    /**
     * @主要功能:  创建动画特效
     * @author C14
     * @Date 2018/3/17
     * @param data
     */
    animationCreate: function(data){  //event为父类事件  实际这里是Event.EventCustom子类
        if(data.detail.network === undefined || data.detail.network === true) {
            this.network.roomMsg('roomChat', {name: "creatureCreate", detail: data.detail});
        }
        var animation = null;
        // this.scheduleOnce(function() {
        /** kenan 这里获取npc的资源方法可以改为，使用资源池获取npc节点*/
        if(data.detail.prefab === undefined || data.detail.prefab === null){
            cc.log("不存在的");
            return;
            //animation = cc.instantiate(this.creaturePrefab[data.detail.id]);
        }else{
            animation = cc.instantiate(data.detail.prefab);
        }
        var detail = data.detail;
        animation.y = detail.Y === null ? globalConstant.magicY : detail.Y;
        animation.x = detail.X;

        this.magicLayer.addChild(animation);
        //C14 停止事件冒泡   (停止继续向上传递此事件)
        data.stopPropagation();
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
        var npc = null;
        if(data.prefab === undefined || data.prefab === null){
            //if (this.creaturePool[data.id].size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            //    npc = this.creaturePool[data.id].get();
            //} else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
                npc = cc.instantiate(this.creaturePrefab[data.id]);
            //}
            //npc = cc.instantiate(this.creaturePrefab[data.id]);
        }else{
            npc = cc.instantiate(data.prefab);
        }
        var npcScript = npc.getComponent("Unit");

        var mapScript = this.mapLayer.getComponent("SmallMap");

        var detail = data;
        detail.Y = detail.Y === null ? globalConstant.summonY : detail.Y;

        npcScript.fnGetManager(this);

        this.creatures.push(npc);


        npcScript.initUnit(detail);//初始化npc属性
        if(npcScript.team * this.heros[0].getComponent("Unit").team > 0){
            npcScript.focusTarget = this.heros[1];
        }else{
            npcScript.focusTarget = this.heros[0];
        }
        npcScript._mapSign = mapScript.fnCreateCreatureSign(npc);//this.creatures[this.creatures.length - 1]
        this.creatureLayer.addChild(npc);
        if(data.battleCry !== undefined && data.battleCry === true){
            npcScript.skillComponent.releaseFunction(0);
        }
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
        this.timerLayer.addChild(chantMag);
        chantMagScript.fnInitChant(event.detail);

        //       magScript.fnCreateMagic(event.detail);//初始化npc属性



        //kenan 停止事件冒泡   (停止继续向上传递此事件)
        event.stopPropagation();
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
        var script = this.heros[1].getComponent("Hero");
        this.heros[1].x = data.x;
        script.accLeft = data.accLeft;
        script.accRight = data.accRight;

        var script1 = this.heros[1].getComponent("Unit");
        script.health = data.health;
    },
    /**
     * @主要功能 让敌人跳一下
     * @author C14
     * @Date 2018/1/12
     * @parameters
     * @returns
     */
    changeEnemyJump:function(data){
        var script = this.heros[1].getComponent("Unit");
        script.jumpAction();
    },
    changeEnemyAttack:function(data){
        cc.log("attack");
        var script = this.heros[1].getComponent("Unit");
        script.ATKActionFlag = true;
        script.attackAction();
    },
    /**
     * @主要功能: 释放小兵节点
     *          建议使用资源池回收节点
     * @param node
     */
    removeCreature: function(node){
        var i = 0; 
        
        var id = node.getComponent('Unit').id;
        cc.log(id);
        var mapScript = this.mapLayer.getComponent('SmallMap');
        mapScript.fnDeleteSign(node);
        for(i = 0;i < this.creatures.length; i++){
            if( this.creatures[i] === node){
                //this.creatures[i].destroy();
                //this.creatures[i].removeFromParent();
                node.destroy();
                this.creatures.splice(i,1);
                break;
            }
        }
        
        //kenan 因为没有回收池  这里需要释放资源
        //if(i !== this.creatures.length){
        

        //this.creaturePool[id].put(node);
    },

    /**
     * @主要功能: 释放法术
     *          建议使用资源池回收节点
     * @param node
     */
    removeMagic: function(node){
        var i = 0; 
        
        var id = node.getComponent('Magic').id;

        this.magicPool[id].put(node);
    },

    update: function (dt) {
        for(var i = 0;i < this.creatureLayer.children.length;i ++)
        this.creatureLayer.children[i].getComponent("Unit").theUpdate(dt);
        for(i = 0;i < this.heroLayer.children.length;i ++)
        this.heroLayer.children[i].getComponent("Unit").theUpdate(dt);
    }
    
});

