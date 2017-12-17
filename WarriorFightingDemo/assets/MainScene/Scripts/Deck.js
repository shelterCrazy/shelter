var Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        
        cardBoard: cc.Node,
        mainScence:cc.Node,
        
        deckNum:cc.Label,

        deckAddButton:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.delay = 0;
        this.cardList = this.cardBoard.getComponent('CardList');
        this.mainScript = this.mainScence.getComponent('MainSceneManager');
        this.deckAddScript = this.deckAddButton.getComponent(cc.Button);

        this.initListenEvent();
    },
    
    initListenEvent: function(){
        
        this.node.on("mouseDownTheShowCard",removeCard,this);
        this.node.on("mouseDownTheDeck",getInDeck,this);
        this.node.on("nameTheDeck",changeDeckName,this);
        this.node.on("removeTheDeck",removeDeck,this);

            function removeCard(event){
            var i = 0;
                event.detail.object.addNumBy(-1);
                if(event.detail.object.cardType === 1){
                    //this.mainScript.myCDeck[event.detail.object.cardId]--;
                    this.cardList.deckNum--;
                    if(--this.mainScript.myCDeck[event.detail.object.cardId] === 0){
                        this.cardList.cardDeckInit();
                    }
                }else{
                    //this.mainScript.myMDeck[event.detail.object.cardId]--;
                    this.cardList.deckNum--;
                    if(--this.mainScript.myMDeck[event.detail.object.cardId] === 0){
                        this.cardList.cardDeckInit();
                    }
                }
            }
            //for(i=0;i<this.cardList.deck.length;i++){
            //    if(this.cardList.deck[i] === event.detail.object.node){
            //        this.cardList.deck.splice(i,1);
            //        event.detail.object.node.removeFromParent();
            //    }else{
            //        this.mainScript.myMDeck[event.detail.object.cardId]--;
            //        this.cardList.deckNum--;
            //        if(this.mainScript.myMDeck[event.detail.object.cardId] === 0){
            //            for(i=0;i<this.cardList.deck.length;i++){
            //                if(this.cardList.deck[i] === event.detail.object.node){
            //                    this.cardList.deck.splice(i,1);
            //                    event.detail.object.node.removeFromParent();
            //                }
            //            }
            //        }
            //    }
            //}
            function changeDeckName(event){
                Global.totalDeckData[Global.deckView].name = event.detail.name;
            }
            function removeDeck(event){
                cc.log(event.detail.object.num);
                Global.totalDeckData.splice(event.detail.object.num,1);
                for(var i=0;i<Global.totalDeckData.length;i++)
                {
                    Global.totalDeckData[i].num = i;
                }
                event.detail.object.node.removeFromParent();
            }
            function getInDeck(event){
                this.cardList.mode = 2;
                Global.deckView = event.detail.object.num;

                this.mainScript.myMDeck = Global.totalDeckData[Global.deckView].magicDeck;
                this.mainScript.myCDeck = Global.totalDeckData[Global.deckView].creatureDeck;
                this.deckAddScript.interactable = false;
                this.cardList.ojbk.active = true;

                this.cardList.cardDeckInit();
            }


    },
    getOutDeck:function(event) {
        this.cardList.mode = 0;
        //Global.totalDeckData.deckView = event.detail.object.num;
        Global.totalDeckData[Global.deckView].magicDeck = this.mainScript.myMDeck;
        Global.totalDeckData[Global.deckView].creatureDeck = this.mainScript.myCDeck;
        if(this.cardList.deckNum === 30)Global.totalDeckData[Global.deckView].usable = true;
        else Global.totalDeckData[Global.deckView].usable = false;
        this.deckAddScript.interactable = true;
        this.cardList.ojbk.active = false;

        this.cardList.renewDeckView();
    },
    addDeck:function(){
        var deckDatas = {
            name:"new deck",
            //deckView:0,
            num:0,
            magicDeck:{
                default: [],
                type: cc.Integer,
            },
            creatureDeck:{
                default:[],
                type: cc.Integer,
            },
            //?????
            type: {
                type: cc.Enum({
                    //??
                    //??
                    Science: 0,
                    Fantasy: 1,
                    //??
                    Chaos: 2,
                }),
                default: 0,
            },
            usable:false,
        }
        this.cardList.mode = 2;
        deckDatas.num = Global.totalDeckData.length;
        deckDatas.magicDeck = [0,0];
        deckDatas.creatureDeck = [0];
        Global.totalDeckData.push(deckDatas);
        Global.deckView = Global.totalDeckData.length - 1;
        this.mainScript.myMDeck = Global.totalDeckData[Global.deckView].magicDeck;
        this.mainScript.myCDeck = Global.totalDeckData[Global.deckView].creatureDeck;
        this.deckAddScript.interactable = false;
        this.cardList.ojbk.active = true;

        this.cardList.cardDeckInit();
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.delay ++;
        if(this.delay >= 6){
            this.delay = 0;
            if(this.cardList.mode === 2) {
                this.deckNum.string = this.cardList.deckNum + '/' + this.mainScript.maxDeckNum;
            }else{
                this.deckNum.string = Global.totalDeckData.length + '/' + 9;
            }
        }
    },
});
