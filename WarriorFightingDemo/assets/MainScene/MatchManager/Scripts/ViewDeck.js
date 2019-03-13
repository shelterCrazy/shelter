var Global = require("Global");
var globalConstant = require("Constant");
cc.Class({
    extends: cc.Component,

    properties: {
        deckId:0,
        deckSort:0,
        selectSort:0,
        deckNum:0,
        selected:false,
        //卡组的类型
        type: {
            type: cc.Enum({
                //科学
                Science: 0,
                //幻想
                Fantasy: 1,
                //混沌
                Chaos: 2,
                }),
            default: 0,
        },
        //用来显示颜色的节点bodyNode
        bodyNode:cc.Node,
        //用于标明卡组类型的图片节点
        typePicNode:[cc.Node],
        //是否可以使用，初始为否
        usable:true,

        nameLabel:cc.Label,

        nowScale:1,
        scale:1,
        time1:0,
        time2:0,
    },

    // use this for initialization
    onLoad: function () {
        this.initMouseEvent();
    },
    initMouseEvent:function(){
        var self = this;

        this.node.on(cc.Node.EventType.MOUSE_ENTER,function(){
            if(this.selected === false){
                this.bodyNode.stopAllActions();
                this.bodyNode.runAction(cc.scaleTo(
                    this.time1,
                    this.nowScale + this.scale
                ).easing(cc.easeSineInOut()));
            }
        }, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE,function(){
            if(this.selected === false){
                this.bodyNode.stopAllActions();
                this.bodyNode.runAction(cc.scaleTo(
                    this.time2,
                    this.nowScale
                ).easing(cc.easeSineInOut()));
            }
        }, this);
    },
    /**
     * @主要功能 调整是否被选择的状态
     * @author
     * @Date 2018/10/5
     * @parameters
     * @returns
     */
    changeSelectedState:function(selected){
        this.selected = selected;
        if(selected){
            this.nameLabel.node.runAction(cc.moveBy(1, - 60, 0).easing(cc.easeCubicActionOut()));
        }else{
            this.nameLabel.node.stopAllActions();
            this.nameLabel.node.runAction(cc.moveTo(1, cc.v2(-95, 0)).easing(cc.easeCubicActionOut()));
            this.bodyNode.stopAllActions();
            this.bodyNode.runAction(cc.scaleTo(
                this.time2,
                this.nowScale
            ).easing(cc.easeSineInOut()));
        }
    },
    mouseDownDeck:function(){
        var eventsend = new cc.Event.EventCustom('mouseDownTheDeck',true);
        eventsend.setUserData({object:this});
        this.node.dispatchEvent(eventsend);
    },
    removeThisDeck:function(){
        var eventsend = new cc.Event.EventCustom('removeTheDeck',true);
        eventsend.setUserData({object:this});
        this.node.dispatchEvent(eventsend);
    },
    /**
     * @主要功能 判断可使用性并且调整自身透明度
     * @author
     * @Date 2018/2/5
     * @parameters
     * @returns
     */
    judgeUsable:function(){
        var total = 0;
        //遍历全卡组如果此卡组的ID一样的话，那么确认可以使用
        for(var i = 0;i < Global.userDeckCardData.length;i++){
            if(Global.userDeckCardData[i] === undefined ||  Global.userDeckCardData[i].length === 0){
                continue;
            }
            if(Global.userDeckCardData[i][0].deck_id === this.deckId)break;
        }
        //遍历了全卡组却没有能够对应的不为空的卡组
        if(i === Global.userDeckCardData.length){
            this.usable = false;
            this.bodyNode.opacity = 30;
            this.nameLabel.node.opacity = 30;
            return false;
        }
        if(Global.userDeckCardData[i].length === globalConstant.maxDeckCardNum){
            this.usable = true;
            this.bodyNode.opacity = 255;
            this.nameLabel.node.opacity = 255;
            return true;
        }else{
            this.usable = false;
            this.bodyNode.opacity = 30;
            this.nameLabel.node.opacity = 30;
            return false;
        }
    },
    changeType:function(type){
        this.type = type;
        this.typePicNode[type].active = true;
    },
    changeName:function(name){
        this.nameLabel.string = name;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
