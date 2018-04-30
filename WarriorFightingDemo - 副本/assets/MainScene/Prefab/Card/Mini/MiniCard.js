var globalConstant = require("Constant");

cc.Class({
    extends: cc.Component,

    properties: {
        //魔法消耗
        manaConsume: 0,
        //魔法消耗标签
        manaConsumeLabel: cc.Label, 
        
        //卡片类型
        cardType: 0,     //0法术牌；1生物牌
        //卡片ID
        cardId: 0,

        //稀有度
        rarity:{
            type: cc.Enum({
                N: 0,
                R: 1,
                SR: 2,
                SSR: 3
            }),
            default: 0
        },
        //种族
        race:{
            type: cc.Enum({
                none: 0,
                human: 1,
                dragon: 2,
                sprite: 3
            }),
            default: 0
        },
        //星级
        level:1,

        levelLayer:cc.Node,
        //星星的预制
        levelOnPrefab:cc.Prefab,
        levelOffPrefab:cc.Prefab,

        picNode:cc.Node,
        //张数
        num: 0,
        //张数标签
        numLabel: cc.Label,
        
        //卡片名称
        cName: {
            multiline:true,
            default:""
        },
        //卡片名称的标签
        cNameLabel: cc.Label,

        //详细的故事，描述什么的
        storyDescribe: {
            multiline:true,
            default:""
        }

    },

    // use this for initialization
    onLoad: function () {
        this.init();
    },
    
    init: function(){
        var self = this;
        self.manaConsumeLabel.string = self.manaConsume;
        self.numLabel.string = 'X' + self.num;
        self.cNameLabel.string = self.cName;
        //this.initData();
        this.initMouseEvent();
        this.renewLevel();
    },

    adjustCount: function(num){
        this.num = num;
        this.numLabel.string = 'X' + num;
    },
    
    initMouseEvent:function(){
        var newInfoBoard = null;
        this.node.on(cc.Node.EventType.MOUSE_ENTER,this.showInfo, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE,this.cleanInfo, this);
        this.node.on(cc.Node.EventType.MOUSE_UP,this.addCardtoDeck, this);
    },

    showInfo:function(){
        var eventsend = new cc.Event.EventCustom('whenMouseEnterTheMiniCard',true);
        eventsend.setUserData(
            {
                id:(this.cardId),
                typeId:this.cardType,
                num:this.num,
                level:this.level,
                cardScript:this
            });
        this.node.dispatchEvent(eventsend);
    },

    cleanInfo:function(){
        var eventsend = new cc.Event.EventCustom('whenMouseLeaveTheMiniCard',true);
        this.node.dispatchEvent(eventsend);
    },

    addCardtoDeck:function(event){
        var eventsend = new cc.Event.EventCustom('whenMouseUpTheMiniCard',true);
        eventsend.setUserData({
            id:this.cardId,
            typeId:this.cardType,
            cName:this.cName,
            manaConsume:this.manaConsume,
            num:this.num,
            level:this.level,
            cardScript:this,
            button:event.getButton()
        });
        this.node.dispatchEvent(eventsend);
    },
    loadSpriteFrame:function(spriteFrame){
        var sprite = this.picNode.getComponent(cc.Sprite);
        sprite.spriteFrame = spriteFrame;
    },
    renewLevel:function(){
        //this.levelLayer.removeAllChildren();
        //for(var i = 1;i <= globalConstant.cardMaxLevel[this.rarity];i++){
        //    if(i <= this.level) {
        //        var level = cc.instantiate(this.levelOnPrefab);
        //    }else{
        //        level = cc.instantiate(this.levelOffPrefab);
        //    }
        //    this.levelLayer.addChild(level);
        //}
    }
// called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});