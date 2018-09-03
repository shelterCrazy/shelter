var Global = require('Global');
var globalConstant = require("Constant");

cc.Class({
    extends: cc.Component,

    properties: {
        //用户的卡组预制
        userDeckPrefab:cc.Prefab,
        //用户的卡组存放节点
        userDeckNode:cc.Node,
        //确认删除用的节点
        confirmNode:cc.Node,

        //卡组编辑界面节点
        userDeckCardEditComponent:cc.Component,

        interactable:true,

    },

    // use this for initialization
    onLoad: function () {
        this.initListenEvent();
        this.userDeckCardEditComponent = this.userDeckCardEditComponent.getComponent("DeckCardManager");
    },
    initUserDeck:function(){
        this.userDeckNode.removeAllChildren();
        for(var i in Global.userDeckData) {
            var deck = cc.instantiate(this.userDeckPrefab);
            var script = deck.getComponent("ViewDeck");
            //script.deck_id = Global.userDeckData[i].id;
            script.changeName(Global.userDeckData[i].deck_name);
            script.deckSort = Global.userDeckData[i].deck_sort;
            script.deckId = Global.userDeckData[i].id;
            script.judgeUsable();
            this.userDeckNode.addChild(deck);
        }
    },
    renewUserDeck:function(){
        //循环所有的子节点
        for(var i in this.userDeckNode.children) {
            var script = this.userDeckNode.children[i].getComponent("ViewDeck");
            //如果找到了匹配的ID
            for(var j in Global.userDeckData) {
                if(Global.userDeckData[j].id === script.deckId){
                    break;
                }
            }
            //j到末尾了，说明是不匹配的
            if(j === Global.userDeckData.length){
                this.userDeckNode.children[i].removeFromParent();
                continue;
            }
            script.changeName(Global.userDeckData[j].deck_name);
            script.deckSort = Global.userDeckData[j].deck_sort;
            script.judgeUsable();
        }
    },
    initListenEvent: function(){

        //this.node.on("mouseDownTheShowCard",removeCard,this);
        this.node.on("mouseDownTheDeck",this.getInDeck,this);
        //this.node.on("nameTheDeck",changeDeckName,this);
        this.node.on("removeTheDeck",removeDeck,this);

            function removeCard(event){
            var i = 0;
                event.detail.object.addNumBy(-1);

                this.cardList.deckNum --;
                if(-- this.mainScript.myCardDeck[event.detail.object.cardId] === 0){
                    this.cardList.cardDeckInit();
                }
            }

            function changeDeckName(event){
                Global.totalDeckData[Global.deckView].name = event.detail.name;
            }

            function removeDeck(event){
                if(this.interactable) {
                    this.confirmNode.getComponent("ConfirmBox").getAnswer(function (answer) {
                        if (answer === true) {
                            for (var i in Global.userDeckData) {
                                if (Global.userDeckData[i].id === event.detail.object.deckId) {
                                    break;
                                }
                            }
                            if (i !== Global.userDeckData.length) {
                                $.ajax({
                                    url: "/areadly/deleteDeck",
                                    type: "GET",
                                    dataType: "json",
                                    data: {"token": Global.token, "deckId": event.detail.object.deckId},
                                    success: function (rs) {
                                        if (rs.status === "200") {
                                            cc.log("用户卡组删除成功");
                                            Global.userDeckData.splice(i, 1);
                                        } else {
                                            cc.log("用户卡组删除失败");
                                        }
                                    },
                                    error: function () {
                                        cc.log("用户卡组删除错误");
                                    }
                                });
                                event.detail.object.node.removeFromParent();
                            }
                        }
                    }, "确定删除卡组:" + event.detail.object.nameLabel.string + "?");
                }
            }
    },
    getInDeck:function(e,deckId){
        if(this.interactable) {
            //this.node.stopAllActions();
            //播放丝滑移动的动画，移消失
            this.node.runAction(cc.moveBy(0.3,-400,0).easing(cc.easeSineInOut()));
            this.userDeckCardEditComponent.node.active = true;
            //播放丝滑移动的动画，移出现
            this.userDeckCardEditComponent.node.runAction(cc.moveBy(0.7,400,0).easing(cc.easeSineOut()));
            //如果有deckId的话，那么用deckId
            if(deckId !== undefined){
                this.userDeckCardEditComponent.editDeckCard(deckId);
            }else{
                this.userDeckCardEditComponent.editDeckCard(e.detail.object.deckId);
            }
            //卡组细节的节点现在是可以编辑的
            this.userDeckCardEditComponent.interactable = true;
            //此节点暂时变为不可编辑的
            this.interactable = false;
        }
    },


    addDeck:function(){
        if(this.interactable) {
            var max = 0;
            var self = this;
            for (var i in Global.userDeckData) {
                if (Global.userDeckData[i].deck_sort > max) {
                    max = Global.userDeckData[i].deck_sort;
                }
            }
            this.confirmNode.getComponent("ConfirmBox").getAnswer(function (answer, str) {
                if (answer === true) {
                    cc.log(str);
                    $.ajax({
                        url: "/areadly/addDeck",
                        type: "GET",
                        dataType: "json",
                        data: {"token": Global.token, "deckName": str, "deckSort": max + 1},
                        success: function (rs) {
                            if (rs.status === "200") {
                                cc.log("用户卡组创建成功");
                                $.ajax({
                                    url: "/areadly/getUserDeck",
                                    type: "GET",
                                    dataType: "json",
                                    data: {"token": Global.token},
                                    success: function (rs) {
                                        if (rs.status === "200") {
                                            cc.log("卡组数据获取成功");
                                            Global.userDeckData = rs.userDeckList;
                                            self.initUserDeck();
                                            self.getInDeck(
                                                0,
                                                Global.userDeckData[Global.userDeckData.length - 1].id
                                            );
                                        } else {
                                            cc.log("卡组数据获取失败");
                                        }
                                    },
                                    error: function () {
                                        cc.log("用户卡组创建错误");
                                    }
                                });
                            } else {
                                cc.log("用户卡组创建失败");
                            }
                        },
                        error: function () {
                            cc.log("用户卡组创建错误");
                        }
                    });
                }
            }, "请输入卡组名称", "NewDeck");
        }
    },
});
