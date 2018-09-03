var Global = require("Global");

cc.Class({
    extends: cc.Component,

    properties: {

        deckPrefab:cc.Prefab,
        //���鲼��
        deckLayout:cc.Node,

        startButton:cc.Button,

        selectBox:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function()
    {
        this.selectSort = 0;
        this.node.on('mouseDownTheDeck',this.selectCard, this);
    },
    /**
     * @��Ҫ���� ˢ�²��Ҵ����ɹ�ѡ��Ŀ���ڵ�
     * @author C14
     * @Date 2018/2/5
     * @parameters
     * @returns
     */
    deckInit:function(){
        var viewDeck,script;
        this.deckLayout.removeAllChildren();

        for(var i = 0;i < Global.userDeckData.length;i++){
            viewDeck = cc.instantiate(this.deckPrefab);
            script = viewDeck.getComponent("ViewDeck");
            //script.num = i;
            //script.changeType(Global.userDeckData[i].type);
            script.changeName(Global.userDeckData[i].deck_name);
            script.deckSort = Global.userDeckData[i].deck_sort;
            script.deckId = Global.userDeckData[i].id;
            script.selectSort = i;
            this.deckLayout.addChild(viewDeck);
        }

    },

    /**
     * @��Ҫ���� ѡ����ʱ�ĺ�������
     * @author C14
     * @Date 2018/2/5
     * @parameters
     * @returns
     */
    selectCard:function(e){
        if(e.detail.object.usable) {
            Global.deckUsage = e.detail.object.deckId;
            cc.log(Global.deckUsage);
            this.selectSort = e.detail.object.selectSort;
            this.renewSelectBox();
        }
    },

    /**
     * @主要功能 调整窗口的出现与消失
     * @author C14
     * @Date 2018/6/24
     * @parameters active
     * @returns null
     */
    changeActive:function(active){
        var self = this;
        if(active === true){
            //this.startButton = this.startButtonNode.getComponent(cc.Button);
            this.renewSelectBox();
            this.deckInit();
            this.node.active = true;
            this.node.runAction(cc.fadeIn(0.3));
        }else{
            this.node.runAction(cc.sequence(
                cc.fadeOut(0.35),
                cc.callFunc(function(){
                    self.node.active = false;
                }.bind(this))
            ));
        }
    },

    renewSelectBox:function(){
        //if(Global.totalDeckData[Global.deckUsage] === null ||
        //    Global.totalDeckData[Global.deckUsage].usable === false){
        //    //this.selectBox.active = false;
        //    //this.startButton.interactable = false;
        //}else{
            this.selectBox.active = true;
            this.selectBox.x = this.selectSort % 3 * 290 - 350;
            this.selectBox.y = - Math.floor(this.selectSort / 3) * 130 + 180;
            this.startButton.interactable = true;
        //}
    },

    /**
     * @��Ҫ���� ��ʼ��Ϸ��Ŀǰֻ��PVP
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
    openSelectWindow: function(){
        this.changeActive(true);
    }
    // update (dt) {},
});
