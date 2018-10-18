var Global = require('Global');
var globalConstant = require("Constant");
var globalCardData = require("CardData");

cc.Class({
    extends: cc.Component,

    properties: {
        cardGroup: {
            default: [],
            type: cc.Prefab,
        },
        //现在选取的卡牌
        _nowCard: cc.node,

        cardBoard: {
            default: null,
            type: cc.Node
        },
        userCardNode:cc.Node,

        infoBoard: {
            default: null,
            type: cc.Node
        },

        deck: {
            default: [],
            type: cc.Node
        },
        layout: {
            default: null,
            type: cc.Layout
        },

        mode: {
            type: cc.Enum({
                //普通浏览模式
                Normal: 0,
                //当前合成分解模式
                Craft: 1,
                //组卡组模式
                Edit: 2,
                //全部显示，合成分解模式
                Total: 3
            }),
            default: 0
        },
        //迷你展示牌的节点
        miniCardNode:{
            default: [],
            type: cc.Node
        },


        //右侧展示牌的节点
        showCardNode:{
            default: [],
            type: cc.Node
        },
        //上一页下一页的按钮节点
        lastPageButton:cc.Button,
        nextPageButton:cc.Button,

        //迷你卡牌的生物预制
        miniCreaturePrefab:cc.Prefab,
        //迷你卡牌的法术预制
        miniMagicPrefab:cc.Prefab,
        showCreaturePrefab:cc.Prefab,
        showMagicPrefab:cc.Prefab,

        originMagicCardPrefab:cc.Prefab,
        originCreatureCardPrefab:cc.Prefab,

        //是否显示全部的卡片
        allCardEnable:false,
        //卡组里面的改名字框框
        changeName:cc.Prefab,

        //用户卡组组件
        userDeckComponent:cc.Component,
        //用户卡组卡牌编辑组件
        userDeckCardComponent:cc.Component,

        //用于将添加到遮罩的节点
        cardLayout:cc.Node,
        pagePrefab:cc.Prefab,

        deckPrefab:cc.Prefab,

        buttons:cc.Node,
        //调整合成分解卡牌的选项按钮
        toggles:[cc.Toggle],

        mainScence:cc.Node,
        deckNum:0,
        positionX: -1,
        positionY: 1,
        cardIndex: 0
    },


    // use this for initialization
    onLoad: function () {
        var self = this;

        self.nowPage = 0;
        this.filterType = [];
        this.filterType[0] = 0;
        this.filterType[1] = 0;
        this.filterType[2] = 9;
        //最大的页数
        this.maxPage = 0;

        this.userDeckComponent = this.userDeckComponent.getComponent("DeckManager");
        this.userDeckCardComponent = this.userDeckCardComponent.getComponent("DeckCardManager");
        //Global.userDeckCardData = [];

        if(Global.initUserData === false) {
            cc.loader.loadResDir("CardTextures/",cc.SpriteFrame, function (err,spriteFrames) {
                if(err){
                    return;
                }
                for(var i = 0;i < spriteFrames.length;i++) {
                    cc.log(parseInt(spriteFrames[i].name));
                    Global.cardSpriteFrames[parseInt(spriteFrames[i].name)] = spriteFrames[i];
                }
                for(i = 0;i < 400;i++) {
                    Global.miniCardNode[i] = null;
                    Global.cardPrefab[i] = null;
                    Global.showCardNode[i] = null;
                }
                self.initPrefab();
                this.initUserCard();
                this.initUserDeck();
            }.bind(this));
        }else{
            this.userCardInit();
            this.renewShowCardGroup(1);
            this.userDeckComponent.initUserDeck();
        }
        self.infoBoardScript = null;
        this.initListenEvent();
        this.changePageButtonState();
    },

    /**
     * @主要功能 动态加载牌库资源
     * @author
     * @Date 2018/2/7
     * @parameters
     * @returns
     */
    initPrefab:function(){
        var self = this;
        var results = globalCardData;
        var originNode,originShowCard;
        for(var i = 0;i < results.cardData.length;i++) {
            //如果是魔法牌的话
            if(results.cardData[i].card_type === 0){
                //获取原型魔法牌
                var newNode = cc.instantiate(self.originMagicCardPrefab);
                //获取迷你展示用法术预制
                originNode = cc.instantiate(self.miniMagicPrefab);
                //获取展示用法术预制
                originShowCard = cc.instantiate(self.showMagicPrefab);

                var cardDetailScript = newNode.getComponent("MagicCard");

                cardDetailScript.magicType = results.cardData[i].releaseType;
                cardDetailScript.cardId = results.cardData[i].id;
                cardDetailScript.cardType = 0;
            }else{
            //如果是生物牌的话
                //获取原型生物预制
                newNode = cc.instantiate(self.originCreatureCardPrefab);
                //获取迷你展示用生物预制
                originNode = cc.instantiate(self.miniCreaturePrefab);
                //获取展示用生物预制
                originShowCard = cc.instantiate(self.showCreaturePrefab);

                cardDetailScript = newNode.getComponent("CreepCard");

                cardDetailScript.magicType = results.cardData[i].releaseType;
                cardDetailScript.cardId = results.cardData[i].id;
                cardDetailScript.cardType = 1;
                cardDetailScript.race = results.cardData[i].race;
                cardDetailScript.attack = results.cardData[i].attack;
                cardDetailScript.health = results.cardData[i].health;
                cardDetailScript.speed = results.cardData[i].speed;
            }
            cardDetailScript.usableType = results.cardData[i].usableType;

            var loadScript = newNode.getComponent("Card");
            loadScript.loadSpriteFrame(Global.cardSpriteFrames[results.cardData[i].id]);
            loadScript.manaConsume = results.cardData[i].mana;
            loadScript.rarity = results.cardData[i].rarity;
            loadScript.cardId = results.cardData[i].id;
            loadScript.cName = results.cardData[i].card_name;
            loadScript.describe = results.cardData[i].memo;
            loadScript.storyDescribe = results.cardData[i].detail[0];
            loadScript.cardType = results.cardData[i].card_type;

            Global.miniCardNode[loadScript.cardId] = originNode;
            //Global.showCardNode[loadScript.cardId] = originShowCard;

            Global.cardPrefab[loadScript.cardId] = cc.instantiate(newNode);


            var script = originNode.getComponent("MiniCard");
            var script2 = originShowCard.getComponent("InfoBoard");

            script.manaConsume = loadScript.manaConsume;
            script.rarity = loadScript.rarity;
            script.cName = loadScript.cName;
            script.cardId = loadScript.cardId;
            script.cardType = loadScript.cardType;
            script.loadSpriteFrame(Global.cardSpriteFrames[results.cardData[i].id]);

            script2.manaConsume = loadScript.manaConsume;
            script2.rarity = loadScript.rarity;
            script2.cName = loadScript.cName;
            script2.describe = loadScript.describe;
            script2.storyDescribe = loadScript.storyDescribe;
            script2.cardId = loadScript.cardId;
            script2.cardType = loadScript.cardType;
            script2.loadSpriteFrame(Global.cardSpriteFrames[results.cardData[i].id]);
            //如果是生物牌则注入三个其他的量
            if(loadScript.cardType === 1) {
                script2.attack = cardDetailScript.attack;
                script2.health = cardDetailScript.health;
                script2.speed = cardDetailScript.speed;
                script2.race = cardDetailScript.race;
                //cardDetailScript.race;
            }
            Global.showCardNode[script2.cardId] = cc.instantiate(originShowCard);
        }
    },

    changeAllCardEnable:function(){
        this.allCardEnable = !this.allCardEnable;
        //this.nextPageButton.interactable = true;
        //this.lastPageButton.interactable = false;
        this.nowPage = 0;
        this.changePageButtonState();
        this.renewShowCardGroup(-1);
    },
    modeChange:function(event, customEventData){

    },
    modeChange0: function(){
        this.mode = 0;
        this.toggles[0].interactable = true;
        this.toggles[1].interactable = true;
        this.toggles[1].node.active = true;
        if (this.infoBoard !== null) {
            this.infoBoard.removeFromParent();
        }
        this.buttons.active = false;
        cc.log(this.mode);
    },
    modeChange1: function(){
        this.mode = 1;
        this.toggles[0].interactable = true;
        this.toggles[1].interactable = true;
        this.toggles[1].node.active = true;
        cc.log(this.mode);
    },
    modeChange2: function(){
        this.mode = 2;
        this.toggles[0].interactable = false;
        this.toggles[1].interactable = false;
        this.toggles[1].node.active = false;
        if (this.infoBoard !== null) {
            this.infoBoard.removeFromParent();
        }
        this.buttons.active = false;
        cc.log(this.mode);
    },
    modeChange3: function(){
        this.mode = 3;
        this.toggles[0].interactable = false;
        this.toggles[1].interactable = false;
        this.toggles[1].node.active = false;
        if (this.infoBoard !== null) {
            this.infoBoard.removeFromParent();
        }
    },
    /**
     * @主要功能 选择筛选类型
     * @author
     * @Date 2018/2/2
     * @parameters
     * @returns
     */
    filterTypeSelect:function(event, customEventData) {
        this.filterType[customEventData[0] - '0'] = customEventData[1] - '0';
        this.nowPage = 0;
        this.renewShowCardGroup(- 1);
        this.changePageButtonState();
    },

    dispose: function(event, customEventData){
        var infoBoardScript = this.infoBoard.getComponent("InfoBoard");
        var selectCardScript = this._nowCard.getComponent("MiniCard");
        if(Global.userCard[this.infoBoardScript.cardId] > 0) {
            infoBoardScript.changeNum(-1);
            selectCardScript.changeNum(-1);
            if(-- Global.userCard[this.infoBoardScript.cardId] === 0){
                if (this.infoBoard !== null) {
                    this.infoBoard.removeFromParent();
                }

                if(this.allCardEnable === true){
                    selectCardScript.node.opacity = 100;
                }else{
                    this.renewShowCardGroup(1);
                }
                this.buttons.active = false;
            }
        }

    },
    craft:function(){
        var infoBoardScript = this.infoBoard.getComponent("InfoBoard");
        var selectCardScript = this._nowCard.getComponent("MiniCard");
        if(Global.userCard[this.infoBoardScript.cardId] < 99) {
            Global.userCard[this.infoBoardScript.cardId]++;
            infoBoardScript.changeNum(1);
            selectCardScript.changeNum(1);
            if(Global.userCard[this.infoBoardScript.cardId] === 1) {
                selectCardScript.node.opacity = 1000;
            }
        }else{
            cc.log("不要啊，太多了");
        }
    },
    /**
     * @主要功能 更新卡牌展示组的卡牌
     * @author C14
     * @Date 2018/10/12
     * @parameters positions 如果为正则从右向左，为负则从左向右
     * @returns
     */
    renewShowCardGroup: function(position){
        var flag = 0;
        //this.userCardNode.removeAllChildren();
        //position = - position;
        //为卡组的节点中的子节点也就是卡牌添加动作
        for(var i in this.userCardNode.children){
            this.userCardNode.children[i].runAction(
                cc.sequence(
                    //先等待，如果方向为正，则为靠近的后运行，远离离开位置的先运行

                    //消失，向左移动，放大
                    cc.spawn(
                        cc.sequence(
                            cc.delayTime(((1.5 * (1 - position)) + (position) * Math.floor(this.userCardNode.children[i].x / 160)) * 0.1),
                            cc.fadeOut(0.4).easing(cc.easeCubicActionOut())
                        ),
                        cc.moveBy(1.7,- 480 * position,0).easing(cc.easeCubicActionOut())

            //cc.scaleTo(0.5,0.3,0.3).easing(cc.easeCircleActionOut())
                        //cc.scaleTo(0.2,0,1).easing(cc.easeCircleActionOut()),
                    ),
                    //移出父节点
                    cc.callFunc(function(object){
                        object.removeFromParent();
                    }.bind(this),this,this.userCardNode.children[i])
                )
            )
        }
        for(var i in this.userCardData){
            if(this.allCardEnable === false && this.userCardData[i].num === 0){
                continue;
            }
            //筛选符合条件的牌，符合条件，flag加1
            if((((this.filterType[0] - 1)*100 <= this.userCardData[i].card_id &&
                (this.filterType[0] - 1)*100 + 100 > this.userCardData[i].card_id) || this.filterType[0] === 0) &&
                (this.userCardData[i].rarity === this.filterType[1] || this.filterType[1] === 0) &&
                (this.userCardData[i].mana === this.filterType[2] || this.filterType[2] === 9))
            {
                //到达了这一页，那么可以开始显示了
                if(flag >= this.nowPage * 9 && flag < (this.nowPage + 1) * 9){
                    var card = cc.instantiate(Global.miniCardNode[this.userCardData[i].card_id]);
                    (card.getComponent("MiniCard")).num = this.userCardData[i].num;
                    card.x = 160 * ((flag - this.nowPage * 9) % 3);
                    card.y = - 200 * Math.floor((flag - this.nowPage * 9) / 3);
                    card.x += 400 * position;
                    card.runAction(
                        cc.sequence(
                            //cc.delayTime(((1.5 * (1 + position)) - (position) * ((flag - this.nowPage * 9) % 3)) * 0.1 + 0.3),
                            cc.delayTime(0.2),
                            cc.callFunc(function(card){
                                this.userCardNode.addChild(card);
                                card.opacity = 0;
                            },this,card),
                            cc.fadeOut(0),
                            cc.spawn(
                                cc.sequence(
                                    cc.delayTime(((1.5 * (1 - position)) + (position) * ((flag - this.nowPage * 9) % 3)) * 0.1),
                                    cc.fadeTo(0.4,this.userCardData[i].num !== 0 ? 255:100).easing(cc.easeCubicActionOut())
                                ),
                                cc.moveBy(1.4,- 400 * position,0).easing(cc.easeCubicActionOut())
                                //cc.moveBy(0.7,- 250 * position,0).easing(cc.easeCubicActionOut()),
                                //cc.scaleTo(0.2, 1, 1).easing(cc.easeCircleActionOut())
                            )
                        )
                    )
                }
                flag ++;
            }
        }
        this.maxPage = Math.ceil(flag / 9);
    },
    //更新一次现在的卡片浏览
    userCardInit: function(){
        this.cardGroup = [];
        //采用键值：数量的储存方法
        this.userCardData = [];
        //按照法力水晶排序
        var compare = function (obj1, obj2) {
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
        for(var i in globalCardData.cardData) {
            var num = 0;
            for(var j in Global.userCard){
                if(Global.userCard[j].card_id === globalCardData.cardData[i].id){
                    num++;
                }
            }
            var data = {
                "card_name":globalCardData.cardData[i].card_name,
                "card_type":globalCardData.cardData[i].card_type,
                "card_id":globalCardData.cardData[i].id,
                "mana":globalCardData.cardData[i].mana,
                "rarity":globalCardData.cardData[i].rarity,
                "num":num
            };
            this.userCardData.push(data);
        }
        this.userCardData.sort(compare);
        //cc.log(this.userCardData);
    },

    //重新更新卡组的顺序
    sortShowCardGroup: function(){
        var i = 0,j = 0;
        var out = [];
        var script = null;
        for(j = 0 ;j <= 10; j++){
            for(i = 0 ;i < this.cardGroup.length; i++){
                script = this.cardGroup[i].getComponent('MiniCard');
                if(script.manaConsume === j){
                    out.push(this.cardGroup[i]);
                }
            }
        }

        return out;
    },

    /**
     * @主要功能 翻页函数,改
     * @author C14
     * @Date 2018/7/17
     * @parameters
     * @returns
     */
    turnUserCardPage: function(event, customEventData){
        switch(customEventData){
            case 'next':
                if(this.nowPage < this.maxPage - 1)
                {
                    this.nowPage++;
                    this.renewShowCardGroup(1);
                    this.changePageButtonState();
                }
                break;
            case 'last':
                if(this.nowPage > 0)
                {
                    this.nowPage --;
                    this.renewShowCardGroup(-1);
                    this.changePageButtonState();
                }
                break;
        }
    },
    /**
     * @主要功能 更具当前的页数改变翻页按钮的状态
     * @author
     * @Date 2018/9/29
     * @parameters
     * @returns
     */
    changePageButtonState:function(){
        this.lastPageButton.node.active = !(this.nowPage == 0);
        this.nextPageButton.node.active = !(this.nowPage == this.maxPage - 1);
    },



    cleanCardBoard: function(){
        for(var i=0;i<this.cardGroup.length;i++){
            this.cardGroup[i].active = false;//removeFromParent();    
        }
    },
    
    initListenEvent: function(){
        var self = this;
        this.node.on("whenMouseEnterTheMiniCard",mouseEnterMiniCard,this);
        this.node.on("whenMouseLeaveTheMiniCard",mouseLeaveMiniCard,this);
        this.node.on("whenMouseUpTheMiniCard",mouseUpMiniCard,this);
        
       function mouseEnterMiniCard(event){
           //if(this.mode !== 1){
           //    this.buttons.active = false;
           //}
           //if(this.mode === 2) {
           if (this.infoBoard !== null) {
               this.infoBoard.removeFromParent();
           }
           this.infoBoard = cc.instantiate(Global.showCardNode[event.detail.id]);

           this._nowCard = event.detail.miniCardNode;
           this.infoBoard.x = 400;
           this.infoBoard.y = -100;
           this.infoBoardScript = this.infoBoard.getComponent("InfoBoard");
           this.infoBoardScript.num = event.detail.num;
           this.infoBoardScript.level = event.detail.level;

           this.infoBoard.opacity = 0;
           self.node.addChild(this.infoBoard);

           if(this.infoBoardScript.num === 0){
               this.infoBoard.runAction(cc.fadeTo(0.1,120));
           }else{
               this.infoBoard.runAction(cc.fadeTo(0.1,255));
           }
        }
       function mouseLeaveMiniCard(event){
       var self = this;
           if (this.infoBoard !== null) {
               this.infoBoard.runAction(cc.fadeOut(0.1));
           }
        }

       function mouseUpMiniCard(event) {
           ////用预制创建一个预览用的小方块的节点
           //var view = cc.instantiate(this.mainScript.deckBuildPrefab);
           //var script = view.getComponent('ViewCard');
           //var deckScript = null;
           //var i = 0;
           //script.addViewCard(event.detail);
           if (event.detail.button === cc.Event.EventMouse.BUTTON_LEFT) {
               cc.log("按下了左键");
               //if (this.mode === 2) {
                   //把本卡牌的ID发送过去
                   this.userDeckCardComponent.renewUserDeckCard(event.detail.id);
                   //如果不行的话会返回一个数据来表示这是不行的，也就是达到卡牌加入数量的限制
               //} else if (this.mode === 1) {

               //}
           }else if(event.detail.button === cc.Event.EventMouse.BUTTON_RIGHT){
               cc.log("按下了右键");
               if (this.infoBoard !== null) {
                   this.infoBoard.removeFromParent();
               }
               /**
                * @主要功能 卡牌展示位
                */
               //if (event.detail.typeId === 1) {
                   this.infoBoard = cc.instantiate(Global.showCardNode[event.detail.id]);
               //} else {
               //    this.infoBoard = cc.instantiate(this.showMagicNode[event.detail.id]);
               //}
               this._nowCard = event.detail.miniCardNode;
               this.infoBoard.x = 400;
               this.infoBoard.y = -100;
               this.infoBoardScript = this.infoBoard.getComponent("InfoBoard");
               this.infoBoardScript.num = event.detail.num;
               this.infoBoardScript.level = event.detail.level;
               if(this.infoBoardScript.num === 0){
                   this.infoBoard.opacity = 200;
               }
               self.node.addChild(this.infoBoard);
               if (this.mode === 1)
               this.buttons.active = true;
           }
       }
    },

    changeScene:function(){
        cc.director.loadScene("MainScene");
    },

    initUserCard:function(){
        this.getUserCardData(function(flag){
            if(flag === true) {
                this.userCardInit();
                this.renewShowCardGroup(1);
            }
        }.bind(this));
    },
    initUserDeck:function(){
        this.getUserDeckData(function(flag){
            if(flag === true){
                this.userDeckComponent.initUserDeck();
            }
        }.bind(this));
        //setTimeout(function(flag){
        //    this.userDeckComponent.initUserDeck();
        //}.bind(this),500);

    },
    /**
     * @主要功能 初始化用户卡组数据；持有牌信息
     * @author C14
     * @Date 2018/2/27
     * @parameters
     * @returns
     */
    getUserDeckData:function(fn){
        //按照卡组顺序来排列
        var compare2 = function (obj1, obj2) {
            var val1 = obj1.deck_sort;
            var val2 = obj2.deck_sort;
            if (val1 < val2) {
                return -1;
            } else if (val1 > val2) {
                return 1;
            } else {
                return 0;
            }
        };
        $.ajax({
            url: "/areadly/getUserDeck",
            type: "GET",
            dataType: "json",
            data: {"token":Global.token},
            success: function(rs){
                var deckNum = 0;
                if(rs.status === "200") {
                    cc.log("卡组数据获取成功");
                    //将卡组数据放入
                    Global.userDeckData = rs.userDeckList;
                    Global.userDeckData.sort(compare2);
                    cc.log(Global.userDeckData);
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
                                if(deckNum >= Global.userDeckData.length){
                                    fn(true);
                                }
                            },
                            error: function () {
                                cc.log("用户卡组卡牌数据获取错误");
                                //fn(false);
                            }
                        });
                    }
                }else{
                    cc.log("卡组数据获取失败");
                }
            },
            error: function(){
                cc.log("卡组数据获取错误");
                //fn(false);
            }
        });

    },
    getUserCardData:function(fn){
        //按照card_id排序
        var compare = function (obj1, obj2) {
            var val1 = obj1.card_id;
            var val2 = obj2.card_id;
            if (val1 < val2) {
                return -1;
            } else if (val1 > val2) {
                return 1;
            } else {
                return 0;
            }
        };
        $.ajax({
            url: "/areadly/getUserCardInfo",
            type: "GET",
            dataType: "json",
            data: {"token":Global.token},
            success: function(rs){
                if(rs.status === "200") {
                    cc.log("用户卡牌数据获取成功");
                    Global.userCard = rs.userCardList;
                    //按照法力水晶消耗排序
                    Global.userCard.sort(compare);
                    cc.log(Global.userCard);
                    fn(true);
                }else{
                    cc.log("用户卡牌数据获取失败");
                    fn(false);
                }
            },
            error: function(){
                cc.log("用户卡牌数据获取错误");
                fn(false);
            }
        });
    }
});


