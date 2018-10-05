/**
 * @主要功能 卡组选择的管理器
 * @author C14
 * @Date 2018/10/5
 * @parameters
 * @returns
 */
var Global = require("Global");

cc.Class({
    extends: cc.Component,

    properties: {
        deckPrefab:cc.Prefab,
        deckLayer:cc.Node,
        _select:true,
        deckButtonNode:[cc.Node]
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function()
    {
        this.selectSort = 0;
        this.node.on('mouseDownTheDeck',this.selectDeck, this);
    },
    /**
     * @主要功能 关闭开启卡组选择功能
     * @author C14
     * @Date 2018/10/5
     * @parameters enable
     * @returns
     */
    selectEnable:function(enable){
        this._select = enable;
    },
    /**
     * @主要功能 初始化用户的卡组
     * @author C14
     * @Date 2018/10/5
     * @parameters
     * @returns
     */
    deckInit:function(){
        var viewDeck,script;
        //this.deckLayer.removeAllChildren();

        for(var i = 0;i < Global.userDeckData.length;i++){
            viewDeck = cc.instantiate(this.deckPrefab);
            script = viewDeck.getComponent("ViewDeck");
            script.changeName(Global.userDeckData[i].deck_name);
            script.changeType(0);
            script.deckSort = Global.userDeckData[i].deck_sort;
            script.deckId = Global.userDeckData[i].id;
            script.deckNum = i;
            viewDeck.x = (Global.userDeckData.length - i + 1) % 2 * 65;
            viewDeck.y = (Global.userDeckData.length - i - 1) * 65;
            script.judgeUsable();
            this.deckButtonNode.push(viewDeck);
            this.deckLayer.addChild(viewDeck);
        }
    },


    selectDeck:function(e){
        var num = e.detail.object.deckNum;
        if(e.detail.object.usable) {

            //是否能够调整选择
            if(this._select) {
                //如果英雄已经选择过了的话,并且两者不是同一个的话
                if (Global.nowDeckNum !== -1 && Global.nowDeckNum !== num) {
                    //this.heroNode[Global.heroNum].opacity = 0;
                    //this.heroLabelNode[Global.heroNum].opacity = 0;
                    this.deckButtonNode[Global.nowDeckNum].getComponent("BorderButton").unselected();
                    this.deckButtonNode[Global.nowDeckNum].getComponent("ViewDeck").changeSelectedState(false);
                }
                this.deckButtonNode[num].getComponent("BorderButton").selected();
                this.deckButtonNode[num].getComponent("PlayEffect").playPressEffect();
                e.detail.object.changeSelectedState(true);
                if (Global.nowDeckNum !== num) {
                    //一套移动操作
                    //this.heroNode[num].x -= 80;
                    //this.heroLabelNode[num].x -= 10;
                    //this.heroLabelNode[num].y -= 40;
                    //this.heroNode[num].active = true;
                    //this.heroNode[num].opacity = 255;
                    //this.heroLabelNode[num].opacity = 255;
                    //this.heroNode[num].runAction(cc.moveBy(0.5, 80, 0).easing(cc.easeCubicActionOut()));
                    //this.heroLabelNode[num].runAction(cc.moveBy(0.5, 10, 40).easing(cc.easeCubicActionOut()));
                }
                Global.nowDeckNum = num;
            }
        }
    },

    // update (dt) {},
});
