var Global = require('Global');
var globalConstant = require("Constant");

cc.Class({
    extends: cc.Component,

    properties: {
        /*moonLightWorm:{
         default: null,
         type: cc.Prefab,
         },
         undeadBirdDirt:{
         default: null,
         type:cc.Prefab,
         },*/
        cardGroup: {
            default: [],
            type: cc.Prefab,
        },

        cardBoard: {
            default: null,
            type: cc.Node
        },

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
        //miniMagicNode:{
        //    default: [],
        //    type: cc.Node
        //},
        //miniCreatureNode:{
        //    default: [],
        //    type: cc.Node
        //},
        //右侧展示牌的节点
        showCardNode:{
            default: [],
            type: cc.Node
        },
        //showMagicNode:{
        //    default: [],
        //    type: cc.Node
        //},
        //showCreatureNode:{
        //    default: [],
        //    type: cc.Node
        //},
        originMagicCardPrefab:cc.Prefab,
        originCreatureCardPrefab:cc.Prefab,

        //是否显示全部的卡片
        allCardEnable:false,
        //卡组里面的OK按钮
        ojbk:cc.Node,
        //卡组里面的改名字框框
        changeName:cc.Prefab,

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
        var assWeCan = false;
        var self = this;



        self.infoBoardScript = null;
        self.buttons.active = false;
        self.ojbk.active = false;
        self.renewShowCardGroup();
        if(self.mode === 2)self.cardDeckInit();
        self.renewDeckView();
        self.initListenEvent();

        // this.insertCardElement(this.moonLightWorm);
        // this.insertCardElement(this.undeadBirdDirt);
        // while(this.cardIndex < 2){
        //     this.showCardGroup(this.cardGroup[this.cardIndex]);
        //     this.cardIndex++;
        // }
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
        var url = "CardData";

        //for(var i = 0;i < 20;i++) {
        //    self.miniCardNode[i] = null;
        //    self.showCardNode[i] = null;
        //}
            cc.loader.loadRes(url, function (err, results) {
                if(err){
                    cc.error("失败了%s","CardData.json");
                    return;
                }
                cc.log(results);

                for(var i = 0;i < results.cardData.length;i++) {

                    if(results.cardData[i].card_type === 0){
                        var newNode = cc.instantiate(self.originMagicCardPrefab);
                        var cardDetailScript = newNode.getComponent("MagicCard");

                        cardDetailScript.magicType = results.cardData[i].releaseType;
                        cardDetailScript.cardId = results.cardData[i].id;
                        cardDetailScript.cardType = 0;
                    }else{
                        newNode = cc.instantiate(self.originCreatureCardPrefab);
                        cardDetailScript = newNode.getComponent("CreepCard");

                        cardDetailScript.magicType = results.cardData[i].releaseType;
                        cardDetailScript.cardId = results.cardData[i].id;
                        cardDetailScript.cardType = 1;
                        cardDetailScript.race = results.cardData[i].race;
                        cardDetailScript.attack = results.cardData[i].attack;
                        cardDetailScript.health = results.cardData[i].health;
                        cardDetailScript.velocity = results.cardData[i].speed;
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

                    var originNode,originShowCard;

                    if(loadScript.cardType === 0) {
                        originNode = cc.instantiate(self.mainScript.miniMagicPrefab);
                        originShowCard = cc.instantiate(self.mainScript.showMagicPrefab);
                        Global.cardPrefab[loadScript.cardId] = cc.instantiate(newNode);
                    }else{
                        var loadCreepCardScript = newNode.getComponent("CreepCard");

                        originNode = cc.instantiate(self.mainScript.miniCreaturePrefab);
                        //展示板所用的预制
                        originShowCard = cc.instantiate(self.mainScript.showCreaturePrefab);
                        Global.cardPrefab[loadScript.cardId] = cc.instantiate(newNode);
                    }
                    self.miniCardNode[loadScript.cardId] = originNode;
                    self.showCardNode[loadScript.cardId] = originShowCard;

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
                        script2.attack = loadCreepCardScript.attack;
                        script2.health = loadCreepCardScript.health;
                        script2.velocity = loadCreepCardScript.velocity;
                        script2.race = loadCreepCardScript.race;
                        //cardDetailScript.race;
                    }
                }
            });

    },

    changeAllCardEnable:function(){
        this.allCardEnable = !this.allCardEnable;
        this.renewShowCardGroup();
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

    dispose: function(){
        var infoBoardScript = this.infoBoard.getComponent("InfoBoard");

        if(Global.userCard[this.infoBoardScript.cardId] > 0) {
            infoBoardScript.changeNum(-1);
            if(-- Global.userCard[this.infoBoardScript.cardId] === 0){
                if (this.infoBoard !== null) {
                    this.infoBoard.removeFromParent();
                }
                this.buttons.active = false;
            }
        }
        this.renewShowCardGroup();
    },
    craft:function(){
        var infoBoardScript = this.infoBoard.getComponent("InfoBoard");
        if(Global.userCard[this.infoBoardScript.cardId] < 99) {
            Global.userCard[this.infoBoardScript.cardId]++;
            infoBoardScript.changeNum(1);
            this.renewShowCardGroup();
        }else{
            cc.log("不要啊，太多了");
        }
    },

    /**
     * @主要功能 更新一次现在的总卡组浏览
     * @author C14
     * @Date 2017/10/21
     * @parameters
     * @returns
     */
    renewDeckView: function(){
        var i = 0;
        this.layout.node.removeAllChildren();
        for(i = 0;i<Global.totalDeckData.length;i++){
            var decks = cc.instantiate(this.deckPrefab);
            var deckScript = decks.getComponent("ViewDeck");
            if(Global.totalDeckData[i].usable === false)decks.opacity = 100;
            //deckScript.num = i;
            deckScript.deckId = Global.totalDeckData[i].deckId;
            deckScript.sort = Global.totalDeckData[i].sort;
            deckScript.changeType(Global.totalDeckData[i].type);
            deckScript.changeName(Global.totalDeckData[i].name);
            this.layout.node.addChild(decks);
        }
    },

    //更新一次现在的卡片浏览
    renewShowCardGroup: function(){
        this.cardGroup = [];
        //this.cardLayout.removeAllChildren(false);
        for(var i = 0;i<Global.userCard.length;i++) {
            this.showCardGroup(i,Global.userCard[i],1,1);
        }
        this.cardGroup = this.sortShowCardGroup();
        this.sortCardGroupLayout();
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

    //整理卡组用的布局
    sortCardGroupLayout: function(){
        var i = 0,j = 0;
        var pageNode = [];
        this.cardLayout.removeAllChildren(false);
        var pageNum = Math.ceil(this.cardGroup.length / 9);
        cc.log(pageNum);
        for(j = 0 ;j < pageNum; j++){
            var nodeData = cc.instantiate(this.pagePrefab);
            pageNode.push(nodeData);

            this.cardLayout.addChild(pageNode[j]);
            //if(j === 1){
            //    pageNode[j].addChild(this.cardGroup[1]);
            //}
            for (i = j * 9; i < this.cardGroup.length && i < j * 9 + 9; i++) {
                pageNode[j].addChild(this.cardGroup[i]);
            }
        }

        //for(i = 0 ;i < this.cardGroup.length; i++){
        //    this.cardLayout.addChild(this.cardGroup[i]);
        //}
    },

    //
    /**
     * @主要功能 将展示用的全体卡组展示出来
     * @author C14
     * @Date
     * @parameters 卡片ID 张数 卡片类型
     * @returns
     */
    showCardGroup: function(indication,num,cardType,level) {
        var newCard = null;

        if(this.miniCardNode[indication] === undefined || this.miniCardNode[indication] === null)return;
        newCard = cc.instantiate(this.miniCardNode[indication]);

        var script = newCard.getComponent('MiniCard');
        //script.cardId = indication;
        //script.cardType = cardType;
        script.num = num;
        script.label = 'x' + num;
        script.level = level;
        //通过键入的数据更新自己
        //script.initData();
        if(num === 0){
            if(this.allCardEnable === true && level === 1) {
                newCard.opacity = 100;
            }else{
                return;
            }
        }
        newCard.x = 0;
        newCard.y = 0;
        //if(script.manaConsume === this.mainScript.filterType[2] || this.mainScript.filterType[2] === 9) {
        //    this.cardGroup.push(newCard);
        //}

        if((((this.mainScript.filterType[0] - 1)*100 <= script.cardId &&
            (this.mainScript.filterType[0] - 1)*100 + 100 > script.cardId) || this.mainScript.filterType[0] === 0) &&
            (script.rarity + 1 === this.mainScript.filterType[1] || this.mainScript.filterType[1] === 0) &&
        (script.manaConsume === this.mainScript.filterType[2] || this.mainScript.filterType[2] === 9))
        {
            this.cardGroup.push(newCard);
        }
        //this.insertCardElement(newCard);
        return true;
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
           if(this.mode !== 1){
               this.buttons.active = false;
           }
           if(this.mode === 2) {
               //if (event.detail.typeId === 1) {
               //    this.infoBoard = cc.instantiate(this.mainScript.showCPrefab[event.detail.id]);
               //} else {
               //    this.infoBoard = cc.instantiate(this.mainScript.showMPrefab[event.detail.id]);
               //}
               //this.infoBoard.x = 300;
               //this.infoBoard.y = 200;
               //this.infoBoardScript = event.detail.cardScript;
               //this.node.addChild(this.infoBoard);
           }
        }
       function mouseLeaveMiniCard(event){
           if(this.mode === 2) {
               if (this.infoBoard !== null) {
                   //this.infoBoard.removeFromParent();
               }
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
               if (this.mode === 2) {
                   if (globalConstant.maxDeckCardNum > this.deckNum) {
                       if (this.mainScript.myCardDeck[event.detail.id] < event.detail.num) {
                           this.mainScript.myCardDeck[event.detail.id]++;
                           this.deckNum++;
                           this.cardDeckInit();
                       }
                   }
               } else if (this.mode === 1) {

               }
           }else{
               if (this.infoBoard !== null) {
                   this.infoBoard.removeFromParent();
               }
               /**
                * @主要功能 卡牌展示位
                */
               //if (event.detail.typeId === 1) {
                   this.infoBoard = cc.instantiate(this.showCardNode[event.detail.id]);
               //} else {
               //    this.infoBoard = cc.instantiate(this.showMagicNode[event.detail.id]);
               //}
               this.infoBoard.x = 300;
               this.infoBoard.y = 150;
               this.infoBoardScript = this.infoBoard.getComponent("InfoBoard");
               this.infoBoardScript.num = event.detail.num;
               this.infoBoardScript.level = event.detail.level;
               self.node.addChild(this.infoBoard);
               if (this.mode === 1)
               this.buttons.active = true;
           }
       }
    },
    
    sortDeck: function(){
    var i = 0,j = 0;
    var out = [];
    var script = null;
        for(j = 0 ;j <= 10; j++){
            for(i = 0 ;i < this.deck.length; i++){
                script = this.deck[i].getComponent('ViewCard');
                if(script.manaConsume === j){
                    out.push(this.deck[i]);
                }                       
            }
        }
        
    return out;
    },

    //将卡组内部构成的具体卡的组成呈现出来
    cardDeckInit:function(){
        var i;
        var deckScript = null;
        //if(this.deck !== null)this.deck = [null];
        var deck = [],deckNum = 0;

        for(i = 0 ;i < this.mainScript.myCardDeck.length;i++){
            var view = cc.instantiate(this.mainScript.deckBuildPrefab);
            var script = view.getComponent('ViewCard');
            if(this.mainScript.myCardDeck[i] !== 0 )
            {
                deckScript = cc.instantiate(this.miniCardNode[i]);
                deckScript = deckScript.getComponent('MiniCard');
                view.x = 0;

                script.num = this.mainScript.myCardDeck[i];
                script.cardType = deckScript.cardType;
                script.cardId = deckScript.cardId;
                script.cName = deckScript.cName;
                script.manaConsume = deckScript.manaConsume;

                deck.push(view);

                deckNum += this.mainScript.myCardDeck[i];
            }
        }

        this.deckNum = deckNum;
        this.deck = deck;
        cc.log(deck);
        this.deck = this.sortDeck();

        this.sortLayout();
        cc.log(this.mainScript.myCardDeck);
    },

    /**
     * @主要功能 调整卡组编辑里面的卡片信息
     * @author
     * @Date 2018/2/27
     * @parameters
     * @returns
     */
    sortLayout: function(){
    var i = 0;
    this.layout.node.removeAllChildren(false);
        var dat = cc.instantiate(this.changeName);
        var script = dat.getComponent(cc.EditBox);
        script.string = Global.totalDeckData[Global.deckView].name;
        dat.x = 0;
        this.layout.node.addChild(dat);
        for(i = 0 ;i < this.deck.length; i++){
            this.layout.node.addChild(this.deck[i]);                      
        }
        //this.layout.node.addChild(cc.instantiate(this.ojbk));
    }
    
    //toLastPage: function(){
    //    if(this.cardIndex !== 0){
    //        this.cleanCardBoard();
    //        this.cardIndex -= 9;
    //        var i = this.cardIndex;
    //        if(this.cardIndex >= 0){
    //            if(this.cardIndex + 8 <= this.cardGroup.length){
    //                for(i;i<this.cardIndex + 8;i++){
    //                    this.cardGroup[i].active = true;
    //                }
    //            }else{
    //                for(i;i<this.cardGroup.length;i++){
    //                    this.cardGroup[i].active = true;
    //                }
    //            }
    //        }
    //    }
    //},
    //
    //toNextPage: function(){
    //    if((this.cardGroup.length - this.cardIndex) > 9) {
    //    this.cleanCardBoard();
    //    //如果卡组的长度要比我们的引索要小，那就不执行了
    //        this.cardIndex += 9;
    //        var i = this.cardIndex;
    //        if (this.cardIndex <= this.cardGroup.length && this.cardGroup.length - this.cardIndex <= 9)
    //        {
    //            for (i; i < this.cardGroup.length; i++) {
    //                this.cardGroup[i].active = true;
    //            }
    //        }
    //    }
    //},
    
    /*cardBehavior: function(cardObject,infoType){
        
        var newInfoBoard = null;
        cardObject.on(cc.Node.EventType.MOUSE_ENTER,showInfo, this);
        cardObject.on(cc.Node.EventType.MOUSE_LEAVE,cleanInfo, this);
        function showInfo(){
            newInfoBoard = cc.instantiate(infoType);
            newInfoBoard.x = 300;
            newInfoBoard.y = 200;
            this.node.addChild(newInfoBoard);
        }
        function cleanInfo(){
            newInfoBoard.removeFromParent();
        }
    }*/
    
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
