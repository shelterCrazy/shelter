var Global = require('Global');
var globalConstant = require("Constant");

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

                this.cardList.deckNum--;
                if(-- this.mainScript.myCardDeck[event.detail.object.cardId] === 0){
                    this.cardList.cardDeckInit();
                }
            }

            function changeDeckName(event){
                Global.totalDeckData[Global.deckView].name = event.detail.name;
            }
            function removeDeck(event){

                for(var i = 0;i<Global.totalDeckData.length;i++)
                {
                    if(Global.totalDeckData[i].sort === event.detail.object.sort){
                        Global.totalDeckData.splice(i,1);
                        break;
                    }
                }
                event.detail.object.node.removeFromParent();
                this.cardList.renewDeckView();
            }
            function getInDeck(event){
                this.cardList.modeChange2();
                Global.deckView = event.detail.object.num;

                this.mainScript.myCardDeck = Global.totalDeckData[Global.deckView].deck;

                this.deckAddScript.interactable = false;
                this.cardList.ojbk.active = true;

                this.cardList.cardDeckInit();
            }


    },
    getOutDeck:function(event) {
        this.cardList.modeChange0();
        //Global.totalDeckData.deckView = event.detail.object.num;
        Global.totalDeckData[Global.deckView].deck = this.mainScript.myCardDeck;
        Global.totalDeckData[Global.deckView].usable =
            (this.cardList.deckNum === globalConstant.maxDeckCardNum);

        this.deckAddScript.interactable = true;
        this.cardList.ojbk.active = false;

        this.cardList.renewDeckView();
    },
    addDeck:function(){
        var deckData = {
            name:"new deck",
            //deckView:0,
            num:0,
            deckId:0,
            sort:0,
            deck:{
                default: [],
                type: cc.Integer
            },
            type: {
                type: cc.Enum({
                    //??
                    //??
                    Science: 0,
                    Fantasy: 1,
                    //??
                    Chaos: 2
                }),
                default: 0
            },
            usable:false
        };

        this.cardList.modeChange2();
        deckData.num = Global.totalDeckData.length;
        for(var n = 0; n < 100; n++)deckData.deck[n] = 0;

        Global.totalDeckData.push(deckData);
        Global.deckView = Global.totalDeckData.length - 1;
        this.mainScript.myCardDeck = Global.totalDeckData[Global.deckView].deck;

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
                this.deckNum.string = this.cardList.deckNum + '/' + globalConstant.maxDeckCardNum;
            }else{
                this.deckNum.string = Global.totalDeckData.length + '/' + 9;
            }
        }
    }
});
