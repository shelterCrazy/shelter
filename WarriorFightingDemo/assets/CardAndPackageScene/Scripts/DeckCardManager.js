/**
 * @主要功能 卡组卡牌搭建的管理器
 * @author C14
 * @parameters
 * @returns
 */
var Global = require('Global');
var globalConstant = require("Constant");
var globalCardData = require("CardData");

cc.Class({
    extends: cc.Component,

    properties: {
        //用户的卡组预制
        userDeckCardPrefab:cc.Prefab,
        //用户的卡组存放节点
        userDeckCardNode:cc.Node,
        //确认删除用的节点
        confirmNode:cc.Node,

        //卡组界面节点
        userDeckEditComponent:cc.Component,

        interactable:true,
    },

    // use this for initialization
    onLoad: function () {
        this.editDeckId = 0;
        this.viewCardGroup = [];
        this.editDeckCardData = [];
        this.userDeckEditComponent = this.userDeckEditComponent.getComponent("DeckManager");
        this.initListenEvent();
    },
    initUserDeckCard:function(){
        var self = this;
        //var userDeckCardData = [];
        this.viewCardGroup = [];
        this.userDeckCardNode.removeAllChildren();

        //按照mana排序
        var compareMana = function (obj1, obj2) {
            var val1 = obj1.mana;
            var val2 = obj2.mana;
            if (val1 < val2) {
                return -1;
            } else if (val1 > val2) {
                return 1;
            } else {
                return 0;
            }
        };
        globalCardData.cardData.sort(compareMana);
        var viewCardNum = 0;
        for(var i in globalCardData.cardData) {
            var num = 0;
            //遍历现在编辑的卡组，如果有的话，那么加1
            for (var j in this.editDeckCardData) {
                if(this.editDeckCardData[j].card_id === globalCardData.cardData[i].id){
                    num ++;
                }
            }
            if(num === 0)continue;
            var viewCard = cc.instantiate(this.userDeckCardPrefab);
            var script = viewCard.getComponent("ViewCard");

            script.cName = globalCardData.cardData[i].card_name;
            script.num = num;
            script.cardId = globalCardData.cardData[i].id;
            script.cardType = globalCardData.cardData[i].card_type;
            script.manaConsume = globalCardData.cardData[i].mana;
            viewCard.y = - viewCardNum * 60;
            viewCard.scaleY = 0;
            this.viewCardGroup.push(viewCard);
            this.userDeckCardNode.addChild(viewCard);
            viewCard.runAction(cc.sequence(
                cc.delayTime(viewCardNum * 0.1),
                cc.scaleTo(0.3, 1, 1).easing(cc.easeCubicActionOut())
            ));
            viewCardNum ++;
        }
    },

    addOneDeckCard:function(id){
        var viewCardNum = 0;
        for (var j in globalCardData.cardData) {
            if(globalCardData.cardData[j].id === id){
                var mana = globalCardData.cardData[j].mana;
                break;
            }
        }
        for(var i = 0; i <  this.viewCardGroup.length; i++) {
            var script = this.viewCardGroup[i].getComponent("ViewCard");
            if(mana < script.manaConsume){
                break;
            }
        }
        var viewCard = cc.instantiate(this.userDeckCardPrefab);
        var newScript = viewCard.getComponent("ViewCard");
        newScript.cName = globalCardData.cardData[j].card_name;
        newScript.num = 1;
        newScript.cardId = globalCardData.cardData[j].id;
        newScript.cardType = globalCardData.cardData[j].card_type;
        newScript.manaConsume = globalCardData.cardData[j].mana;
        viewCard.scaleY = 0;
        this.viewCardGroup.splice(i,0,viewCard);
        viewCard.y = - i * 60;
        this.userDeckCardNode.addChild(viewCard);
        viewCard.runAction(cc.scaleTo(0.3, 1, 1).easing(cc.easeCubicActionOut()));
    },
    sortDeckCard:function(){
        for(var i in this.viewCardGroup) {
            this.viewCardGroup[i].runAction(cc.moveTo(0.7, 0, - i * 60).easing(cc.easeCubicActionOut()));
        }
    },

    /**
     * @主要功能 进入卡组卡牌编辑的模式
     * @author C14
     * @Date 2018/7/22
     * @parameters deckId
     * @returns
     */
    editDeckCard:function(deckId){
        this.editDeckId = deckId;
        //现在编辑的卡组数据为空
        this.editDeckCardData = [];
        for (var i in Global.userDeckCardData) {
            //如果卡牌数据里面是没有数据的
            if (Global.userDeckCardData[i].length === 0) {
                continue;
            }
            if (Global.userDeckCardData[i][0].deck_id === deckId) {
                //现在编辑的卡组数据
                this.editDeckCardData = Global.userDeckCardData[i];
            }
        }
        this.initUserDeckCard();
    },

    /**
     * @主要功能 更新现有的卡组
     * @阐述 利用输入的卡牌ID增加此卡牌
     * @author C14
     * @Date 2018/7/22
     * @parameters cardId add
     * @returns 返回是否能够进行添加
     */
    renewUserDeckCard:function(userCardId){
        var flag = false;
        //遍历所有的用户持有的卡牌
        for(var i in Global.userCard) {
            //如果卡牌ID是需要的ID时
            if(Global.userCard[i].card_id === userCardId){
                flag = false;
                //遍历所有的用户持有的卡牌
                for(var j in this.editDeckCardData) {
                    //如果卡牌之前加入过,打断
                    if(this.editDeckCardData[j].user_card_id === Global.userCard[i].id){
                        flag = true;
                        break;
                    }
                }
                //如果卡牌之前未加入过
                if(flag === false){
                    //限制条件与返回
                    //加入它
                    this.addUserDeckCard({
                        "card_id":Global.userCard[i].card_id,
                        "user_card_id":Global.userCard[i].id
                    });
                    break;
                }
            }
        }
    },
    addUserDeckCard:function(data){
        this.editDeckCardData.push(data);
        cc.log(this.editDeckCardData);
        for(var i = 0;i < this.userDeckCardNode.children.length; i ++) {
            //如果卡牌的ID有符合的话
            if(this.userDeckCardNode.children[i].getComponent("ViewCard").cardId === data.card_id){
                this.userDeckCardNode.children[i].getComponent("ViewCard").addNumBy(1);
                break;
            }
        }
        //如果没有符合的情况的话
        if(i === this.userDeckCardNode.children.length){
            this.addOneDeckCard(data.card_id);
            this.sortDeckCard();
        }
    },
    endDeckCardEdit:function(){
        var self = this;
        if(this.editDeckCardData.length === 0){
            self.getOutDeck();
        }else{
            var data = {"data":[]};
            //用现有的数据创建一个新的数据
            for(var i in this.editDeckCardData){
                data.data.push({
                    "cardId":this.editDeckCardData[i].card_id,
                    "userCardId":this.editDeckCardData[i].user_card_id,
                });
            }
            //更新卡组数据
            $.ajax({
                url: "/areadly/renewDeckCard",
                type: "GET",
                dataType: "json",
                data: {"token": Global.token, "deckId":self.editDeckId,"data":JSON.stringify(data)},
                success: function (rs) {
                    if (rs.status === "200") {
                        cc.log("用户卡组更新成功");
                        self.getOutDeck();
                    } else {
                        cc.log("用户卡组更新失败");
                        cc.log(rs);
                    }
                },
                error: function () {
                    cc.log("用户卡组更新错误");
                }
            });
        }
    },
    getOutDeck:function(event) {
        var self = this;
        var deckNum = 0;
        if(this.interactable) {
            //this.node.stopAllActions();
            Global.userDeckCardData = [];
            for(var j = 0;j < Global.userDeckData.length; j++) {
                $.ajax({
                    url: "/areadly/getUserDeckCard",
                    type: "GET",
                    dataType: "json",
                    data: {"token": Global.token, "deckId":Global.userDeckData[j].id},
                    success: function (rs) {
                        if (rs.status === "200") {
                            cc.log("用户卡组卡牌数据获取成功");
                            Global.userDeckCardData.push(rs.userDeckCardList);
                            deckNum ++;
                        } else {
                            deckNum ++;
                            cc.log("用户卡组卡牌数据获取失败");
                        }
                        if(deckNum === Global.userDeckData.length){

                        }
                    },
                    error: function () {
                        cc.log("用户卡组卡牌数据获取错误");
                    }
                });
            }
            setTimeout(function(){
                self.node.runAction(cc.moveBy(0.3, -400, 0).easing(cc.easeSineInOut()));
                self.userDeckEditComponent.node.active = true;
                self.userDeckEditComponent.node.runAction(cc.moveBy(0.7, 400, 0).easing(cc.easeSineOut()));
                self.userDeckEditComponent.initUserDeck();
                self.userDeckEditComponent.interactable = true;
                self.interactable = false;
            },500);
        }
    },

    initListenEvent: function(){
        var self = this;
        //鼠标接触到了左侧排列的卡牌
        this.node.on("mouseDownTheShowCard",removeDeckCard,this);

        //移除一张
        function removeDeckCard(event){
            //遍历现在编辑的卡组，如果有的话，那么删除一个
            for (var i in this.editDeckCardData) {
                if(this.editDeckCardData[i].card_id === event.detail.object.cardId){
                    break;
                }
            }
            if(i !== this.editDeckCardData.length){
                this.editDeckCardData.splice(i,1);
            }
            //数量减一
            if(event.detail.object.addNumBy(-1) === 0){
                for(var i in this.viewCardGroup) {
                    var script = this.viewCardGroup[i].getComponent("ViewCard");
                    if(script.cardId === event.detail.object.cardId){
                        this.viewCardGroup.splice(i,1);
                        break;
                    }
                }
                event.detail.object.node.runAction(
                    cc.sequence(
                        cc.scaleTo(0.3, 1, 0).easing(cc.easeCubicActionOut()),
                        cc.callFunc(function(){
                            event.detail.object.node.removeFromParent();
                        }.bind(this))
                    )
                );
                this.sortDeckCard();
            }
        }

        function changeDeckName(event){
            Global.totalDeckData[Global.deckView].name = event.detail.name;
        }
    },

    // called every frame, uncomment this function to activate update callback
    //update: function (dt) {
    //
    //}
});
