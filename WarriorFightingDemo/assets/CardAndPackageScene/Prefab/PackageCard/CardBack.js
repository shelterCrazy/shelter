var Global = require("Global");
var globalCardData = require("CardData");

cc.Class({
    extends: cc.Component,

    properties: {
        //bodyNode卡背的图样
        bodyNode:cc.Node,
        //翻牌时播放的音效
        rotateSound:[cc.AudioClip],
        cardId:365,

        interactivable:true,
    },

    onLoad:function(){

    },
    /**
     * @主要功能 初始化一张可以翻过来的卡牌,参数，此牌的Id，随后根据总数据去查询
     * @author C14
     * @Date 2018/7/25
     * @parameters cardId
     * @returns
     */
    init:function(cardId) {
        this.findCardData = globalCardData.cardData.find(
            function(obj){
                return obj.id === cardId;
            }
        );
        cc.log("稀有度是" + this.findCardData.rarity);
        this.packageCard = cc.instantiate(Global.showCardNode[cardId]);
        this.packageCard.scaleX = 0;

        this.node.addChild(this.packageCard);

        this.node.on(cc.Node.EventType.MOUSE_DOWN,function(){
            if(this.interactivable) {
                this.interactivable = false;
                this.bodyNode.runAction(cc.scaleTo(0.4, 0, 1).easing(cc.easeSineIn()));
                cc.audioEngine.playEffect(this.rotateSound[this.findCardData.rarity - 1], false);
                setTimeout(function () {
                    this.packageCard.runAction(cc.scaleTo(0.4, 1, 1).easing(cc.easeSineOut()));
                }.bind(this), 400);
                var eventsend = new cc.Event.EventCustom('rotateCard',true);
                this.node.dispatchEvent(eventsend);
            }
        }.bind(this), this);
    },

    showInfo:function(){
        var eventsend = new cc.Event.EventCustom('rotateCard',true);
        this.node.dispatchEvent(eventsend);
    },

    // update (dt) {},
});
