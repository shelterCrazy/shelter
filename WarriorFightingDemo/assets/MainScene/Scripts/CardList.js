var Global = require('Global');

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

        //lastPage: {
        //    default: null,
        //    type: cc.Button,
        //},
        //
        //nextPage: {
        //    default: null,
        //    type: cc.Button,
        //},

        cardBoard: {
            default: null,
            type: cc.Node,
        },

        infoBoard: {
            default: null,
            type: cc.Node,
        },

        deck: {
            default: [],
            type: cc.Node,
        },
        layout: {
            default: null,
            type: cc.Layout,
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
                Total: 3,
            }),
            default: 0,
        },

        //卡组里面的OK按钮
        ojbk:cc.Node,
        //卡组里面的改名字框框
        changeName:cc.Prefab,

        //用于将添加到遮罩的节点
        cardLayout:cc.Node,
        pagePrefab:cc.Prefab,

        deckPrefab:cc.Prefab,

        buttons:cc.Node,
        mainScence:cc.Node,
        deckNum:0,
        positionX: -1,
        positionY: 1,
        cardIndex: 0,
    },

    // use this for initialization
    onLoad: function () {
        var assWeCan = false;
        this.mainScript = this.mainScence.getComponent('MainSceneManager');
        this.infoBoardScript = null;
        this.buttons.active = false;
        this.ojbk.active = false;
        this.renewShowCardGroup();
        if(this.mode === 2)this.cardDeckInit();
        this.renewDeckView();
        this.initListenEvent();
        // this.insertCardElement(this.moonLightWorm);
        // this.insertCardElement(this.undeadBirdDirt);
        // while(this.cardIndex < 2){
        //     this.showCardGroup(this.cardGroup[this.cardIndex]);
        //     this.cardIndex++;
        // }
    },
/////////
    modeChange0: function(mode){
        this.mode = 0;
        if (this.infoBoard !== null) {
            this.infoBoard.removeFromParent();
        }
        this.buttons.active = false;
        cc.log(this.mode);
    },
    modeChange1: function(mode){
        this.mode = 1;
        cc.log(this.mode);
    },
    modeChange2: function(mode){
        this.mode = 2;
        if (this.infoBoard !== null) {
            this.infoBoard.removeFromParent();
        }
        this.buttons.active = false;
        cc.log(this.mode);
    },
    modeChange3: function(mode){
        this.mode = 3;
        if (this.infoBoard !== null) {
            this.infoBoard.removeFromParent();
        }
        cc.log(this.mode);
    },

    dispose: function(){
        if(this.infoBoardScript.cardType === 0) {
            if(this.mainScript.myMCards[this.infoBoardScript.cardID] > 0) {
                if(--this.mainScript.myMCards[this.infoBoardScript.cardID] === 0){
                    if (this.infoBoard !== null) {
                        this.infoBoard.removeFromParent();
                    }
                    this.buttons.active = false;
                }
            }
        }else{
            if(this.mainScript.myCCards[this.infoBoardScript.cardID] > 0) {
                if( --this.mainScript.myCCards[this.infoBoardScript.cardID] === 0){
                    if (this.infoBoard !== null) {
                        this.infoBoard.removeFromParent();
                    }
                    this.buttons.active = false;
                }
            }
        }
        this.renewShowCardGroup();
    },
    craft:function(){
        if(this.infoBoardScript.cardType === 0) {
                this.mainScript.myMCards[this.infoBoardScript.cardID] ++;
        }else{
                this.mainScript.myCCards[this.infoBoardScript.cardID] ++;
        }
        this.renewShowCardGroup();
    },


    //更新一次现在的大的卡组浏览
    renewDeckView: function(){
        var i = 0;
        this.layout.node.removeAllChildren();
            for(i = 0;i<Global.totalDeckData.length;i++){
                var decks = cc.instantiate(this.deckPrefab);
                var deckScript = decks.getComponent("ViewDeck");
                if(Global.totalDeckData[i].usable === false)decks.opacity = 100;
                deckScript.num = i;
                deckScript.changeType(Global.totalDeckData[i].type);
                deckScript.changeName(Global.totalDeckData[i].name);
                this.layout.node.addChild(decks);
            }
    },
    //更新一次现在的卡片浏览
    renewShowCardGroup: function(){
        this.cardGroup = [];
        //this.cardLayout.removeAllChildren(false);
        for(var i=0;i<this.mainScript.myCCards.length;i++){
            if(this.mode === 1 && this.mainScript.myCCards[i] === 0){
                this.showCardGroup(i,this.mainScript.myCCards[i],1);
            }else if(this.mainScript.myCCards[i] !== 0){
                this.showCardGroup(i,this.mainScript.myCCards[i],1);
            }
        }
        for(var j=0;j<this.mainScript.myMCards.length;j++){
            if(this.mode === 1 && this.mainScript.myMCards[j] === 0){
                this.showCardGroup(j,this.mainScript.myMCards[j],0);
            }else if(this.mainScript.myMCards[j] !== 0){
                this.showCardGroup(j,this.mainScript.myMCards[j],0);
            }
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
        for(j = 0 ;j < pageNum + 1; j++){
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

    //将展示用的全体卡组展示出来
    showCardGroup: function(indication,num,cardTypeId) {
        var newCard = null;
        if(cardTypeId === 1){
            newCard = cc.instantiate(this.mainScript.miniCreaturePrefab[indication]);
        }else{
            newCard = cc.instantiate(this.mainScript.miniMagicPrefab[indication]);
        }
        var script = newCard.getComponent('MiniCard');
        script.num = num;
        script.label = 'x'+num;
        if(num === 0){
            newCard.opacity = 100;
        }
        newCard.x = 0;
        newCard.y = 0;
        //if(script.manaConsume === this.mainScript.filterType[2] || this.mainScript.filterType[2] === 9) {
        //    this.cardGroup.push(newCard);
        //}

        if((((this.mainScript.filterType[0] - 1)*100 <= script.cardID &&
            (this.mainScript.filterType[0] - 1)*100 + 100 > script.cardID) || this.mainScript.filterType[0] === 0) &&
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
        
    this.node.on("whenMouseEnterTheMiniCard",mouseEnterMiniCard,this);
    this.node.on("whenMouseLeaveTheMiniCard",mouseLeaveMiniCard,this);
    this.node.on("whenMouseUpTheMiniCard",mouseUpMiniCard,this);
        
       function mouseEnterMiniCard(event){
           if(this.mode !== 1){
               this.buttons.active = false;
           }
           if(this.mode === 2) {
               if (event.detail.typeId === 1) {
                   this.infoBoard = cc.instantiate(this.mainScript.showCPrefab[event.detail.id]);
               } else {
                   this.infoBoard = cc.instantiate(this.mainScript.showMPrefab[event.detail.id]);
               }
               this.infoBoard.x = 300;
               this.infoBoard.y = 200;
               this.infoBoardScript = event.detail.cardScript;
               this.node.addChild(this.infoBoard);
           }
        }
       function mouseLeaveMiniCard(event){
           if(this.mode === 2) {
               if (this.infoBoard !== null) {
                   this.infoBoard.removeFromParent();
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
           if (this.mode === 2) {
               if (this.mainScript.maxDeckNum > this.deckNum) {
                   if (event.detail.typeId === 1) {
                       if (this.mainScript.myCDeck[event.detail.id] < event.detail.num) {
                           this.mainScript.myCDeck[event.detail.id]++;
                           this.deckNum++;
                           this.cardDeckInit();
                       }
                   } else {
                       if (this.mainScript.myMDeck[event.detail.id] < event.detail.num) {
                           this.mainScript.myMDeck[event.detail.id]++;
                           this.deckNum++;
                           this.cardDeckInit();
                       }
                   }
               }
           }else if(this.mode === 1){
               if (this.infoBoard !== null) {
                   this.infoBoard.removeFromParent();
               }
               if (event.detail.typeId === 1) {
                   this.infoBoard = cc.instantiate(this.mainScript.showCPrefab[event.detail.id]);
               } else {
                   this.infoBoard = cc.instantiate(this.mainScript.showMPrefab[event.detail.id]);
               }
               this.infoBoard.x = 300;
               this.infoBoard.y = 200;
               this.infoBoardScript = event.detail.cardScript;
               this.node.addChild(this.infoBoard);

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

    //将卡组的具体卡的组成呈现出来
    cardDeckInit:function(){
        var i;
        var deckScript = null;
        //if(this.deck !== null)this.deck = [null];
        var deck = [],deckNum = 0;

        for(i = 0 ;i < this.mainScript.myCDeck.length;i++){
            var view = cc.instantiate(this.mainScript.deckBuildPrefab);
            var script = view.getComponent('ViewCard');
            if(this.mainScript.myCDeck[i] !== 0 )
            {
                deckScript = cc.instantiate(this.mainScript.miniCreaturePrefab[i]);
                deckScript = deckScript.getComponent('MiniCard');
                view.x = 0;
                script.num = this.mainScript.myCDeck[i];
                script.cardType = 1;
                script.cardId = deckScript.cardID;
                script.cName = deckScript.cName;
                script.manaConsume = deckScript.manaConsume;

                deck.push(view);

                deckNum += this.mainScript.myCDeck[i];
            }
        }
        for(i = 0 ;i < this.mainScript.myMDeck.length;i++){
            var view = cc.instantiate(this.mainScript.deckBuildPrefab);
            var script = view.getComponent('ViewCard');
            if(this.mainScript.myMDeck[i] !== 0 ){
                deckScript = cc.instantiate(this.mainScript.miniMagicPrefab[i]);
                deckScript = deckScript.getComponent('MiniCard');
                view.x = 0;
                script.num = this.mainScript.myMDeck[i];
                script.cardType = 0;
                script.cardId = deckScript.cardID;
                script.cName = deckScript.cName;
                script.manaConsume = deckScript.manaConsume;
                deck.push(view);

                deckNum += this.mainScript.myMDeck[i];
            }
        }
        this.deckNum = deckNum;
        this.deck = deck;
        cc.log(deck);
        this.deck = this.sortDeck();

        this.sortLayout();
        cc.log(this.mainScript.myCDeck);
    },

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
    },
    
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
