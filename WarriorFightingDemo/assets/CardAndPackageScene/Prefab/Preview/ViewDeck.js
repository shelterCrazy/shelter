var Global = require("Global");
var globalConstant = require("Constant");
cc.Class({
    extends: cc.Component,

    properties: {
        deckId:0,
        deckSort:0,
        selectSort:0,
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
        //是否可以使用，初始为否
        usable:true,

        nameLabel:cc.Label,
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
    },
    initMouseEvent:function(){
        var self = this;

        this.node.on(cc.Node.EventType.MOUSE_ENTER,function(){

        }, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE,function(){

        }, this);
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
        for(var i = 0;i < Global.userDeckCardData.length;i++){
            if(Global.userDeckCardData[i][0].deck_id === this.deckId)break;
        }
        if(Global.userDeckCardData[i] !== undefined &&
            Global.userDeckCardData[i].length === globalConstant.maxDeckCardNum){
            this.usable = true;
            this.bodyNode.opacity = 255;
            return true;
        }else{
            this.usable = false;
            this.bodyNode.opacity = 30;
            return false;
        }
    },
    changeType:function(type){
        this.type = type;
    },
    changeName:function(name){
        this.nameLabel.string = name;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
