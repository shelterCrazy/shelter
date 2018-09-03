cc.Class({
    extends: cc.Component,

    properties: {
        //魔法消耗
        manaConsume: 0,
        //魔法消耗标签
        manaConsumeLabel: cc.Label,

        team:0,
        
        //卡片类型
        cardType: {
            type: cc.Enum({
               MagicCard: 0,
               CreepCard: 1,
            }),
            default: 0,
        },     //0法术牌；1生物牌
        rarity:{
            type: cc.Enum({
                N: 0,
                R: 1,
                SR: 2,
                SSR: 3
            }),
            default: 0
        },
        //这张牌对应的法术或者是生物实体
        Prefab:cc.Prefab,
        //卡片ID
        cardId: 0,
        //卡片名称
        cName: cc.String,
        //卡片名称的标签
        cNameLabel: cc.Label,

        picNode:cc.Node,
        /*//描述
        describe: cc.String,*/
        describe: {
            multiline:true,
            default:""
        },
        //描述的标签
        describeLabel: cc.Label,

        //详细的故事，描述什么的
        storyDescribe: {
            multiline:true,
            default:""
        },



        //手牌的2个位置
        cardHand: cc.Node,
        cardUsing: cc.Node,

        //用于读取英雄的节点
        hero: cc.Node,

        cameraControl:cc.Node,
        cameraControlScript:cc.Node,
        mainGameManager:cc.Node,
        //使用了卡牌播放音效或者没有使用，收回的音效
        startCardEffect:cc.AudioClip,
        endCardEffect:cc.AudioClip
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        //如果这两个变量未初始化，则作为展示用的卡牌
        if(self.hero !== null || self.cameraControl !== null) {
            self.heroScirpt = self.hero.getComponent("UnitRouter").getLogicTypeScript();
            self.heroUnitScirpt = self.hero.getComponent("UnitRouter").getLogicUnitScript();
            self.cameraControlScript = this.cameraControl.getComponent("CameraControl");
            // this.cardHand = require("CardHand");
            // this.cardUsing = require("CardUsing");

            switch (self.cardType) {
                case 0:
                    self.typeComponent = self.node.getComponent("MagicCard");
                    if (self.typeComponent) {
                        //console.log("This is a MagicCard!");
                    }
                    break;
                case 1:
                    self.typeComponent = self.node.getComponent("CreepCard");
                    if (self.typeComponent) {
                        //console.log("This is a CreepCard!");
                    }
                    break;
                default:
                    break;
            }

            var cardObject = this.node;
            cardObject.on(cc.Node.EventType.MOUSE_ENTER, this.enterMouseEvent, this);
            cardObject.on(cc.Node.EventType.MOUSE_LEAVE, this.leaveMouseEvent, this);

            self.manaConsumeLabel.string = self.manaConsume;
            self.cNameLabel.string = self.cName;
            self.describeLabel.string = self.describe;
        }
    },

    //获得使用情况 false 无法使用；true可以使用
    getUseState: function(){
        var state = true;

        //卡牌的判断
        //若真，则往下一层判断
        if (state) {
            state = this.typeComponent.getUseState();
        }

        return state;
    },
    useCard: function(){
        // var self = this;
        // var script = null;
        // if(self.cardType === 0){
        //     script = self.node.getComponent('M' + self.cardId);
        // }else{
        //     script = self.node.getComponent('C' + self.cardId);
        // }
        // script.useCard();
        if (this.getUseState()) {
            //卡牌层面的操作
            //下一层的操作
        }

    },

    changeUsableType:function(usableType){
        this.usableType = usableType;
    },
    loadSpriteFrame:function(spriteFrame){
        var sprite = this.picNode.getComponent(cc.Sprite);
        sprite.spriteFrame = spriteFrame;
    },
    enterMouseEvent: function (event) {
        var cardObject = this.node;
        cardObject.runAction(cc.speed(cc.scaleBy(1.3,1.3), 7));


        cardObject.on(cc.Node.EventType.TOUCH_START,this.downMouseEvent,this);

        event.stopPropagation();
    },

    leaveMouseEvent: function (event) {
        var cardObject = this.node;
        cardObject.stopAllActions();
        cardObject.runAction(cc.speed(cc.scaleTo(1,1),7));

        event.stopPropagation();
    },

    downMouseEvent: function (event) {
        var self = this;

        // 判断魔法值
        if (self.heroScirpt.checkMana(self.manaConsume)) {
            //开始监听鼠标移动事件
            if(!self.heroUnitScirpt.death || self.cardType !== 0) {
                var cardObject = this.node;
                var sender = new cc.Event.EventCustom('cardSelect', true);
                sender.setUserData({card: this.node, posX: event.getLocationX(), posY: event.getLocationY()});
                this.node.dispatchEvent(sender);
                //console.log("downMouse!");

                this.node.x = event.getLocationX() - cc.director.getWinSize().width / 2;
                this.node.y = event.getLocationY() - (cc.director.getWinSize().height / 2) + 300;

                // 开启移动监听
                cardObject.on(cc.Node.EventType.TOUCH_MOVE, this.moveMouseEvent, this);
                cardObject.on(cc.Node.EventType.TOUCH_END, this.upMouseEvent, this);
            }else{
                var sender1 = new cc.Event.EventCustom('errorTips', true);
                sender1.setUserData({text: "Hero is dead!"});
                this.node.dispatchEvent(sender1);
            }
        } else {

            var sender2 = new cc.Event.EventCustom('errorTips', true);
            sender2.setUserData({text: "No enough mana!"});
            this.node.dispatchEvent(sender2);

        }

        event.stopPropagation();
    },

    upMouseEvent: function (event) {
        //关闭监听鼠标移动事件
        var cardObject = this.node;

        var sender = new cc.Event.EventCustom('cardExit',true);
        sender.setUserData({card: this.node});
        this.node.dispatchEvent(sender);

        console.log("upMouse");

        // 关闭一系列监听
        cardObject.off(cc.Node.EventType.TOUCH_MOVE,this.moveMouseEvent,this);
        cardObject.off(cc.Node.EventType.TOUCH_START,this.downMouseEvent,this);
        cardObject.off(cc.Node.EventType.TOUCH_END,this.upMouseEvent,this);

        // this.drawCardScript.deleteCard(this.cardIndex);

        event.stopPropagation();
    },

    moveMouseEvent: function (event) {
        //鼠标移动监听
        var cardObject = this.node;
        cardObject.x += event.getDeltaX();
        cardObject.y += event.getDeltaY();

        event.stopPropagation();
    },

    //mouseLeaveEvent: function(){
    //    var sender = new cc.Event.EventCustom('cardOut', true);
    //    sender.setUserData({card:this.node});
    //    this.node.dispatchEvent(sender);
    //    event.stopPropagation();
    //}

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});