cc.Class({
    extends: cc.Component,

    properties: {
        cardGroupButton:{
            default: null,
            type: cc.Button,
        },
        openCardButton:{
            default:null,
            type:cc.Button,
        },
        heroInfButton:{
            default:null,
            type:cc.Button,
        },
        choiceHeroBoard:{
            default: null,
            type: cc.Node,
        },
        choiceOpenBoard:{
            default: null,
            type: cc.Node,
        },
        choiceCardBoard:{
            default: null,
            type: cc.Node,
        },
    },

    // use this for initialization

    /*heroInfLayout: function () {
        this.choiceHeroBoard.zIndex = 2;
        this.choiceHeroBoard.zIndex = 1;
        //cc.director.loadScene("HeroInfScene.fire");
    },
    
    openCardLayout: function(){
        this.choiceOpenBoard.zIndex = 2;
        this.choiceOpenBoard.zIndex = 1;
        //cc.director.loadScene("OpenCardScene.fire");
    },
    
    cardGroupLayout: function(){
        this.choiceCardBoard.zIndex = 2;
        this.choiceCardBoard.zIndex = 1;
        //cc.director.loadScene("CardGroupScene.fire");
    },*/
    
    onLoad:function(){
        this.node.active = false;
        this.choiceHeroBoard.active = false;
        this.choiceOpenBoard.active = false;
        this.choiceCardBoard.active = true;
    },
    //Ó¢ÐÛ
    heroInfLayout: function () {
        this.layoutSwitch(this.choiceHeroBoard,this.heroInfButton);
        this.choiceHeroBoard.active = true;
        this.choiceOpenBoard.active = false;
        this.choiceCardBoard.active = false;
        //cc.director.loadScene("HeroInfScene.fire");
    },
    //¿ª°ü
    openCardLayout: function(){
        this.layoutSwitch(this.choiceOpenBoard,this.openCardButton);
        this.choiceHeroBoard.active = false;
        this.choiceOpenBoard.active = true;
        this.choiceCardBoard.active = false;
        //cc.director.loadScene("OpenCardScene.fire");
    },
    //¿¨×é
    cardGroupLayout: function(){
        this.layoutSwitch(this.choiceCardBoard,this.cardGroupButton);
        this.choiceHeroBoard.active = false;
        this.choiceOpenBoard.active = false;
        this.choiceCardBoard.active = true;
        //cc.director.loadScene("CardGroupScene.fire");
    },
    /*layoutSwitch: function(choiceBoard,choiceButton){
        choiceBoard.zIndex = 2;
        choiceBoard.zIndex = 1;
        choiceButton.pressedColor = new cc.Color.toCSS("#E9BF81");
    }*/
    layoutSwitch: function(choiceBoard,choiceButton){
        choiceBoard.zIndex = 2;
        choiceButton.zIndex = 1;
    }


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
