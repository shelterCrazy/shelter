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

        //攻击力
        attack: 0,
        //攻击力标签
        attackLabel: cc.Label,
        //生命值
        health: 0,
        //生命值标签
        healthLabel: cc.Label,
        //速度
        velocity: 0,
        //速度
        velocityLabel: cc.Label,

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

        describe: {
            multiline:true,
            default:""
        },
        describeLabel:cc.Label,

        //详细的故事，描述什么的
        storyDescribe: {
            multiline:true,
            default:""
        },
        storyDescribeLabel:cc.Label
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
        self.describeLabel.string = self.describe;
        self.storyDescribeLabel.string = self.storyDescribe;

        self.renewLevel();
        if(self.attackLabel !== null)
        self.attackLabel.string = self.attack;
        if(self.healthLabel !== null)
        self.healthLabel.string = self.health;
        if(self.velocityLabel !== null)
        self.velocityLabel.string = self.velocity;
    },
    loadSpriteFrame:function(spriteFrame){
        var sprite = this.picNode.getComponent(cc.Sprite);
        sprite.spriteFrame = spriteFrame;
    },
    renewLevel:function(){
        this.levelLayer.removeAllChildren();
        for(var i = 1;i <= globalConstant.cardMaxLevel[this.rarity];i++){
            if(i <= this.level) {
                var level = cc.instantiate(this.levelOnPrefab);
            }else{
                level = cc.instantiate(this.levelOffPrefab);
            }
            this.levelLayer.addChild(level);
        }
    },
    changeNum:function(num){
        this.num += num;
        this.numLabel.string = 'X' + this.num;
    }
});