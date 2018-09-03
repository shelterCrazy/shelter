var global = require("Global");
var globalConstant = require("Constant");
cc.Class({
    extends: cc.Component,

    properties: {

        purchaseNode:[cc.Node],
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
        moneyItem:cc.Node,
        //细节的文字提前说明
        detailLabel:cc.Label
    },
    // use this for initialization
    onLoad: function () {
        this.node.on('purchaseId',this.purchaseIdChange,this);
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

    purchaseIdChange:function(event){
        this.purchaseId = event.detail.id;
        this.nowMoney = event.detail.script.money;
        var self = this;

        var labelAction = cc.sequence(
            cc.fadeOut(0.5),
            cc.callFunc(function(){
                var position = 1 -  Math.floor(self.purchaseId % 4 / 2);
                    self.detailLabel.node.x = position * 400 - 350;
                    this.detailLabel.string = event.detail.text;
            },this),
            cc.fadeIn(0.7)
        );

        //var moveAction = cc.sequence(cc.moveBy(0,15),cc.moveBy(0,-15));
            this.detailLabel.node.runAction(labelAction);
        //this.detailLabel.node.runAction(moveAction);

        if(event.detail.script.type === 0){
            this.purchaseNumChange();
        }else if(event.detail.script.type === 1){
            this.changeStoryMode();
        }
        this.purchaseNode[0].runAction(cc.moveTo(0.5,200 * this.purchaseId + -300,this.purchaseNode[0].y).easing(
            cc.easeCircleActionInOut()
        ));
        this.purchaseNode[1].runAction(cc.moveTo(0.5,200 * this.purchaseId + -300,this.purchaseNode[1].y).easing(
            cc.easeCircleActionInOut()
        ));
        this.changeStoryMode();
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
        var button;
        if(global.storyEnable[this.purchaseId] === false) {
            this.needMoney = 1 * this.nowMoney;
            this.needMoneyStoryLabel.string = this.needMoney;
            button = this.purchaseButton[1].getComponent(cc.Button);
            button.interactable = true;
        }else{
            this.needMoneyStoryLabel.string = "售罄";
            button = this.purchaseButton[1].getComponent(cc.Button);
            button.interactable = false;
        }
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
            global.bagNum[this.purchaseId] += Math.floor(this.purchaseNumLabel.string);
            this.purchaseNumLabel.string = 0;
            this.purchaseNumChange();
        }else{
            this.massage.string = "抱歉，已经没有钱了";
            var action = cc.sequence(cc.fadeIn(1).easing(cc.easeSineOut()),cc.fadeOut(1).easing(cc.easeSineIn()));
            this.massageNode.runAction(action);
        }
    },
    /**
     * @主要功能 购买故事模式
     * @author C14
     * @Date 2018/1/2
     * @parameters
     * @returns
     */
    purchaseStoryMode:function(){

        if(global.money >= globalConstant.storyModeNeedMoney){
            global.money -= globalConstant.storyModeNeedMoney;
            global.storyEnable[this.purchaseId] = true;
            this.purchaseNumLabel.string = 0;
            this.purchaseNumChange();
        }else{
            this.massage.string = "抱歉，已经没有钱了";
            var action = cc.sequence(cc.fadeIn(1).easing(cc.easeSineOut()),cc.fadeOut(1).easing(cc.easeSineIn()));
            this.massageNode.runAction(action);
        }
        this.changeStoryMode();
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
        var script;
        var bagItem = this.bagItem.children;
        var storyItem = this.storyItem.children;
        this.detailLabel.string = "";
        for(var i = 0;i < bagItem.length;i++){
            script = bagItem[i].getComponent("Item");
            bagItem[i].scale = 1;
            script.init();
        }
        for(i = 0;i < storyItem.length;i++){
            script = storyItem[i].getComponent("Item");
            storyItem[i].scale = 1;
            script.init();
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
