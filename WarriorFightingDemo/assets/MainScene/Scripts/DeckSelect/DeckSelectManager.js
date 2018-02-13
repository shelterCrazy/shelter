// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var Global = require("Global");

cc.Class({
    extends: cc.Component,

    properties: {

        deckPrefab:cc.Prefab,
        //卡组布局
        deckLayout:cc.Node,

        startButtonNode:cc.Node,

        selectBox:cc.Node,
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function()
    {
        this.node.on('mouseDownTheDeck',this.selectCard, this);
    },
    /**
     * @主要功能 刷新并且创建可供选择的卡组节点
     * @author C14
     * @Date 2018/2/5
     * @parameters
     * @returns
     */
    deckInit:function(){
        var viewDeck,script;
        this.deckLayout.removeAllChildren();

        for(var i = 0;i < Global.totalDeckData.length;i++){
            viewDeck = cc.instantiate(this.deckPrefab);
            script = viewDeck.getComponent("ViewDeck");
            script.num = i;
            script.changeType(Global.totalDeckData[i].type);
            script.changeName(Global.totalDeckData[i].name);
            script.judgeUsable();
            this.deckLayout.addChild(viewDeck);
        }

    },

    /**
     * @主要功能 选择卡组时的函数触发
     * @author C14
     * @Date 2018/2/5
     * @parameters
     * @returns
     */
    selectCard:function(e){
        if(e.detail.object.usable) {
            Global.deckUsage = e.detail.object.num;
            this.renewSelectBox();
        }
    },
    renewSelectBox:function(){
        if(Global.totalDeckData[Global.deckUsage] === null ||
            Global.totalDeckData[Global.deckUsage].usable === false){
            this.selectBox.active = false;
            this.startButton.interactable = false;
        }else{
            this.selectBox.active = true;
            this.selectBox.x = Global.deckUsage % 3 * 290 - 350;
            this.selectBox.y = -Math.floor(Global.deckUsage / 3) * 130 + 180;
            this.startButton.interactable = true;
        }
    },

    /**
     * @主要功能 开始游戏，目前只有PVP
     * @author C14
     * @Date 2018/2/5
     * @parameters
     * @returns
     */
    startGame:function(){
        Global.mainStart = true;
        cc.director.loadScene('game');
    },

    closeSelectWindow: function(){
        this.node.active = false;
    },
    opoenSelectWindow: function(){
        this.startButton = this.startButtonNode.getComponent(cc.Button);
        this.renewSelectBox();
        this.deckInit();
        this.node.active = true;
    }
    // update (dt) {},
});
