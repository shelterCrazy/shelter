var global = require("Global");
var globalConstant = require("Constant");
cc.Class({
    extends: cc.Component,

    properties: {

        purchaseButton:[cc.Node],
        purchaseNumLabel:cc.EditBox,
        //显示用的所需金币
        needMoney:0,
        needMoneyLabel:cc.Label,
        needMoneyStoryLabel:cc.Label,
        massage:cc.Label,
        massageNode:cc.Node,
        //故事模式的金币
        storyNeedMoney:0,
        //购买的卡包编号是
        purchaseId:0,
        //当前页面位置
        pageId:0,
        //现在的单价
        nowMoney:0,
        //滑动页面
        pages:[cc.Node],
        //卡包购买项目
        bagItem:cc.Node,
        //故事购买项目
        storyItem:cc.Node,
        //氪金购买项目
        moneyItem:cc.Node
    },

    // use this for initialization
    onLoad: function () {
        this.node.on('purchaseId',this.purchaseIdChange,this);
    },
    purchaseIdChange:function(event){
        this.purchaseId = event.detail.id;
        this.nowMoney = event.detail.script.money;

        if(event.detail.script.type === 0){
            this.purchaseNumChange();
        }else if(event.detail.script.type === 1){
            this.changeStoryMode();
        }
        this.purchaseButton[0].runAction(cc.moveTo(0.5,200 * this.purchaseId + -300,this.purchaseButton[0].y).easing(
            cc.easeCircleActionInOut()
        ));
        this.purchaseButton[1].runAction(cc.moveTo(0.5,200 * this.purchaseId + -300,this.purchaseButton[1].y).easing(
            cc.easeCircleActionInOut()
        ));
    },
    /**
     * @主要功能 提供购买数量更新的操作
     * @author C14
     * @Date 2018/1/1
     * @parameters
     * @returns
     */
    purchaseNumChange:function(){
        this.purchaseNumLabel.string = Math.floor(this.purchaseNumLabel.string);
        this.needMoney = this.purchaseNumLabel.string * this.nowMoney;
        this.needMoneyLabel.string =  this.needMoney;
    },
    /**
     * @主要功能 更新故事模式的操作
     * @author C14
     * @Date 2018/1/2
     * @parameters
     * @returns
     */
    changeStoryMode:function(){
        this.needMoney = 1 * this.nowMoney;
        this.needMoneyStoryLabel.string =  this.needMoney;
    },
    /**
     * @主要功能 购买卡包X个
     * @author C14
     * @Date 2018/1/1
     * @parameters
     * @returns
     */
    purchaseCardBag:function(){
        if(global.money >= this.needMoney){
            global.money -= this.needMoney;
            this.purchaseNumLabel.string = 0;
            this.purchaseNumChange();
        }else{
            this.massage.string = "抱歉，已经没有钱了";
            var action = cc.sequence(cc.fadeIn(1).easing(cc.easeSineOut()),cc.fadeOut(1).easing(cc.easeSineIn()));
            this.massageNode.runAction(action);
        }
    },
    /**
     * @主要功能 购买卡包X个
     * @author C14
     * @Date 2018/1/2
     * @parameters
     * @returns
     */
    purchaseStoryMode:function(){
        if(global.money >= globalConstant.storyModeNeedMoney){
            global.money -= globalConstant.storyModeNeedMoney;
            this.purchaseNumLabel.string = 0;
            this.purchaseNumChange();
        }else{
            this.massage.string = "抱歉，已经没有钱了";
            var action = cc.sequence(cc.fadeIn(1).easing(cc.easeSineOut()),cc.fadeOut(1).easing(cc.easeSineIn()));
            this.massageNode.runAction(action);
        }
    },
    /**
     * @主要功能
     * @author
     * @Date 2018/1/1
     * @parameters
     * @returns
     */
    pageTurning:function(string){
        this.pageId = parseInt(string);

        var bagItem = this.bagItem.children;
        var storyItem = this.storyItem.children;

        for(var i = 0;i < bagItem.length;i++){
            var script = bagItem[i].getComponent("Item");
            bagItem[i].scale = 1;
            script.init();
        }
        for(i = 0;i < storyItem.length;i++){
            var script = storyItem[i].getComponent("Item");
            storyItem[i].scale = 1;
            script.init();
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
