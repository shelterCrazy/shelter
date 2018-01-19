var globalConstant = require("Constant");
/**
 * @主要功能 用于处理魔法牌类型的逻辑
 * @author 老黄，C14
 * @Date 2017/
 * @parameters
 * @returns
 */
cc.Class({
    extends: cc.Component,

    properties: {

        cardID: 0,

        cardType: 0,
        // 这个是枚举，相当的好用啊，以后都用这个好了
        magicType: {
            type: cc.Enum({
                NoTarget: 0,
                AreaTarget: 1,
                DirectionTarget: 2,
            }),
            default: 0
        },
        //为该层添加范围法术，投掷法术的参数
        area:0,
        //投掷速度
        speed:0,

        hero:cc.Node,
        backRoll:cc.Node,

        rangeNode: cc.Prefab,
        rangeAnimationNode: cc.Prefab,
        arrowNode: cc.Prefab,


        prepareCardEffect:cc.AudioClip,
        useCardEffect:cc.AudioClip,
        //摄像头移动标记
        cameraMoveFlag:0,

        arraw:cc.Node,
        rangeLNode:cc.Node,
        rangeRNode:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        self.magicTypeEnum = cc.Enum({
            NoTarget: 0,
            AreaTarget: 1,
            DirectionTarget: 2,
        });
        //this.arrow = cc.instantiate(this.arrowNode);
        this.startListen();
        //是否移动到上面准备使用了，初始值，否
        this.preUse = false;
        //this.backRollScript = this.backRoll.getComponent("BackRoll");
        this.cardScript = self.node.getComponent('Card');
        this.heroScirpt = this.cardScript.hero.getComponent('Player');

        //这个的最深层代码JS的获取
         this.mScript = null;
         if(self.cardType === 0){
             this.mScript = self.node.getComponent('M' + self.cardID);
         }else{
             this.mScript = self.node.getComponent('C' + self.cardID);
        }

        this.currentEffect = false;
        //为该层添加范围法术，投掷法术的参数
        this.mAngle = 0;
        //var state = this.script.getUseState();
         //return state;

        // 这个添加监听为测试用
        // self.startListen();
    },

    /**
     *
     * @param event
     * @constructor
     */
    NoTargetMagicStartListen: function (event) {
        // this.node.x = event.getLocationX();
        // this.node.y = event.getLocationY();
        if (event.getButton() === cc.Event.EventMouse.BUTTON_LEFT)
        {
            // console.log("NoTargetMagicStartListen" + event.getLocationX().toFixed(0));
        }
    },
    /**
     *
     * @param event
     * @constructor
     */
    AreaTargetMagicStartListen: function (event) {
        //向主控制脚本传递信息，播放开始的音效
        this.cardScript.cameraControlScript.targets[1].x  =
            this.cardScript.cameraControlScript.targets[0].x;
    },
    /**
     *
     * @param event
     * @constructor
     */
    DirectionTargetMagicStartListen: function (event) {
        // this.node.x = event.getLocationX();
        // this.node.y = event.getLocationY();
        // console.log("DirectionTargetMagicStartListen");
    },
    /**
     *
     * @param event
     * @constructor
     */
    NoTargetMagicMoveListen: function (event) {
        // console.log("NoTargetMagicStartListen " + event.getLocationX().toFixed(0) + "," + event.getLocationY().toFixed(0));
        if(this.node.y > globalConstant.cardUseLine && this.preUse === false){
            this.node.opacity = 200;
            this.preUse = true;
            //播放法术准备用的音效
            this.currentEffect = cc.audioEngine.playEffect(this.prepareCardEffect, true, 1);
        }
        if(this.node.y <= globalConstant.cardUseLine && this.preUse === true){
            this.node.opacity = 1000;
            this.preUse = false;
            //停止准备用的音乐
            cc.audioEngine.stopEffect(this.currentEffect);
        }
    },
    /**
     *
     * @param event
     * @constructor
     */
    AreaTargetMagicMoveListen: function (event) {
         //console.log("AreaTargetMagicMoveListen");
        var self = this;
        if(this.node.y > globalConstant.cardUseLine){
            if(this.preUse === false){
                this.node.opacity = 0;
                this.preUse = true;
                this.rangeLNode.active = true;
                this.rangeRNode.active = true;
                this.rangeAnimeNode.active = true;
                //播放法术准备用的音效
                this.currentEffect = cc.audioEngine.playEffect(this.prepareCardEffect, true, 1);
            }
            this.rangeAnimeNode.x = this.node.x;
            this.rangeLNode.x = this.node.x - this.area * globalConstant.unitLength / 2;
            this.rangeRNode.x = this.node.x + this.area * globalConstant.unitLength / 2;

            if(this.node.x + cc.director.getWinSize().width/2 > cc.director.getWinSize().width - globalConstant.magicMoveEdge){
                if(this.cameraMoveFlag !== 8){
                    this.cameraMoveFlag = 8;
                    this.cardScript.cameraControlScript.target =
                        this.cardScript.cameraControlScript.targets[1];
                    this.unschedule(this.cameraMove);
                    this.schedule(this.cameraMove,0.01);
                }
            }else if(this.node.x + cc.director.getWinSize().width/2 < globalConstant.magicMoveEdge){
                this.cardScript.cameraControlScript.target =
                    this.cardScript.cameraControlScript.targets[1];
                if(this.cameraMoveFlag !== -8){
                    this.cameraMoveFlag = -8;
                    this.cardScript.cameraControlScript.target =
                        this.cardScript.cameraControlScript.targets[1];
                    this.unschedule(this.cameraMove);
                    this.schedule(this.cameraMove,0.01);
                }
            }else{
                this.cameraMoveFlag = 0;
                this.unschedule(this.cameraMove);
            }
        }



        if(this.node.y <= globalConstant.cardUseLine && this.preUse === true){
            this.node.opacity = 1000;
            this.preUse = false;
            this.rangeLNode.active = false;
            this.rangeRNode.active = false;
            this.rangeAnimeNode.active = false;

            this.unschedule(this.cameraMove);
            //停止准备用的音乐
            cc.audioEngine.stopEffect(this.currentEffect);
        }
    },
    /**
     * @主要功能 相机移动，用于范围法术移动时的相机移动
     * @author C14
     * @Date 2018/1/11
     * @parameters
     * @returns
     */
    cameraMove:function(){
        var self = this;
        self.cardScript.cameraControlScript.targets[1].x += self.cameraMoveFlag;
        if(this.cardScript.cameraControlScript.target !==
                this.cardScript.cameraControlScript.targets[1]){
            this.cardScript.cameraControlScript.target = this.cardScript.cameraControlScript.targets[1];
        }
    },
    // called every frame, uncomment this function to activate update callback
    //update: function (dt) {
    //    if(this.cameraMoveFlag !== 0)
    //        this.cardScript.cameraControlScript.targets[1].x += this.cameraMoveFlag;
    //},

    /**
     *
     * @param event
     * @constructor
     */
    DirectionTargetMagicMoveListen: function (event) {

        // console.log("DirectionTargetMagicMoveListen");
        if(this.node.y > globalConstant.cardUseLine){
            if(this.preUse === false){
                this.node.opacity = 0;
                this.preUse = true;
                this.arrow.active = true;
                //播放法术准备用的音效
                this.currentEffect = cc.audioEngine.playEffect(this.prepareCardEffect, true, 1);
            }
            var targetPos = this.arrow.convertToWorldSpaceAR(cc.Vec2.ZERO);
            if (globalConstant.cameraOffset === 0) {
                this.arrow.rotation = 360 - Math.atan2(event.getLocationY() - targetPos.y,
                        event.getLocationX() - this.hero.x) * 180 / Math.PI;
            }else if(this.hero.x > cc.director.getWinSize().width * (globalConstant.sceneWidth - globalConstant.sceneEdge)) {
                this.arrow.rotation = 360 - Math.atan2(event.getLocationY() - cc.director.getWinSize().height / 2 - (this.arrow.y + this.arrow.parent.y),
                        event.getLocationX() - this.hero.x + cc.director.getWinSize().width * (globalConstant.sceneWidth - globalConstant.sceneEdge * 2)) * 180 / Math.PI;
            } else {
                this.arrow.rotation = 360 - Math.atan2(event.getLocationY() - cc.director.getWinSize().height / 2 - (this.arrow.y + this.arrow.parent.y),
                        event.getLocationX() - cc.director.getWinSize().width * globalConstant.sceneEdge) * 180 / Math.PI;
            }
        }


        if(this.node.y <= globalConstant.cardUseLine && this.preUse === true){
            this.node.opacity = 1000;
            this.preUse = false;
            this.arrow.active = false;
            //停止准备用的音乐
            cc.audioEngine.stopEffect(this.currentEffect);
        }

    },
    /**
     *
     * @param event
     * @constructor
     */
    NoTargetMagicEndListen: function (event) {
        //停止准备用的音乐
        this.stopEffect();
        this.sendEvent(this.useCardEffect,true);
    },
    /**
     *
     * @param event
     * @constructor
     */
    AreaTargetMagicEndListen: function (event) {
        console.log(" AreaTargetMagicEndListen");
        //停止准备用的音乐
        this.stopEffect();
        this.cameraMoveFlag = 0;
        if(this.preUse === true) {
            this.rangeLNode.active = false;
            this.rangeRNode.active = false;
            this.rangeAnimeNode.active = false;

            this.heroScirpt.mana -= this.cardScript.manaConsume;

            this.sendEvent(this.useCardEffect,true);
            this.mScript.useCard(event.getLocationX() + globalConstant.cameraOffset, this.area * globalConstant.unitLength);
        }
    },
    /**
     *
     * @param event
     * @constructor
     */
    DirectionTargetMagicEndListen: function (event) {
        // console.log("DirectionTargetMagicEndListen");
        //停止准备用的音乐
        this.stopEffect();
        if(this.preUse === true) {
            this.arrow.active = false;
            this.heroScirpt.mana -= this.cardScript.manaConsume;
            this.sendEvent(this.useCardEffect,true);
            if (globalConstant.cameraOffset === 0) {
                this.mAngle = 360 - Math.atan2(event.getLocationY() - cc.director.getWinSize().height / 2 - (this.arrow.y + this.arrow.parent.y),
                        event.getLocationX() - this.hero.x) * 180 / Math.PI;
            }else if(this.hero.x > cc.director.getWinSize().width * (globalConstant.sceneWidth - globalConstant.sceneEdge)) {
                this.mAngle = 360 - Math.atan2(event.getLocationY() - cc.director.getWinSize().height / 2 - (this.arrow.y + this.arrow.parent.y),
                        event.getLocationX() - this.hero.x + cc.director.getWinSize().width * (globalConstant.sceneWidth - globalConstant.sceneEdge * 2)) * 180 / Math.PI;
            } else {
                this.mAngle = 360 - Math.atan2(event.getLocationY() - cc.director.getWinSize().height / 2 - (this.arrow.y + this.arrow.parent.y),
                        event.getLocationX() - cc.director.getWinSize().width * globalConstant.sceneEdge) * 180 / Math.PI;
            }

            this.mScript.useCard(this.cardID, this.mAngle, this.speed, this.area * globalConstant.unitLength, this.hero.x, this.arrow.y + this.hero.y);
        }
    },

    /**
     * @主要功能 魔法划出了鼠标后的结果是这样子的
     * @author C14
     * @Date 2018/1/11
     * @parameters
     * @returns
     */
    //MagicLeaveListen:function(){
    //    this.node.opacity = 1000;
    //    this.preUse = false;
    //    if(this.arrow !== null)this.arrow.active = false;
    //    if(this.rangeLNode !== null)this.rangeLNode.active = false;
    //    if(this.rangeRNode !== null)this.rangeRNode.active = false;
    //    //停止准备用的音乐
    //    this.stopEffect();
    //
    //    var sender = new cc.Event.EventCustom('cardOut', true);
    //    sender.setUserData({card: this.node});//, posX: event.getLocationX(), posY: event.getLocationY()
    //    this.node.dispatchEvent(sender);
    //},

    /**
     * @主要功能 向上级节点传递消息，使之播放音效
     * @author C14
     * @Date 2017/12/12
     * @parameters  audioChip volume fullVolume
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
     * @主要功能 停止当前播放的音效
     * @author C14
     * @Date 2017/12/12
     * @parameters null
     * @returns null
     */
    stopEffect:function() {
        cc.audioEngine.stopEffect(this.currentEffect);
    },
    // 开启监听的位置，不过嘛，后面还得改，这里先搭个模子，至少保证功能正常
    startListen: function () {
        var self = this;
        //console.log("add listen");
        switch (self.magicType) {
            case 0:
                self.node.on(cc.Node.EventType.MOUSE_DOWN, self.NoTargetMagicStartListen, self);
                self.node.on(cc.Node.EventType.MOUSE_MOVE, self.NoTargetMagicMoveListen, self);
                self.node.on(cc.Node.EventType.MOUSE_UP, self.NoTargetMagicEndListen, self);
                break;
            case 1:
                self.node.on(cc.Node.EventType.MOUSE_DOWN, self.AreaTargetMagicStartListen, self);
                self.node.on(cc.Node.EventType.MOUSE_MOVE, self.AreaTargetMagicMoveListen, self);
                self.node.on(cc.Node.EventType.MOUSE_UP, self.AreaTargetMagicEndListen, self);

                this.rangeLNode = cc.instantiate(this.rangeNode);
                this.rangeRNode = cc.instantiate(this.rangeNode);

                this.rangeLNode.active = false;
                this.rangeRNode.active = false;

                this.rangeLNode.y = - 100;
                this.rangeRNode.y = - 100;

                this.rangeAnimeNode = cc.instantiate(this.rangeAnimationNode);
                this.rangeAnimeNode.active = false;
                this.rangeAnimeNode.y = - 100;

                this.node.parent.parent.addChild(this.rangeAnimeNode);
                this.node.parent.parent.addChild(this.rangeLNode);
                this.node.parent.parent.addChild(this.rangeRNode);

                break;
            case 2:
                self.node.on(cc.Node.EventType.MOUSE_DOWN, self.DirectionTargetMagicStartListen, self);
                self.node.on(cc.Node.EventType.MOUSE_MOVE, self.DirectionTargetMagicMoveListen, self);
                self.node.on(cc.Node.EventType.MOUSE_UP, self.DirectionTargetMagicEndListen, self);

                this.arrow = cc.instantiate(this.arrowNode);
                this.arrow.active = false;
                this.arrow.y = 200;
                this.arrow.x = 0;
                this.hero.addChild(this.arrow);

                break;
        }
    },


});
