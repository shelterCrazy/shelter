cc.Class({
    extends: cc.Component,

    properties: {
        cardGroupButton:{
            default: null,
            type: cc.Button,
        },
        heroInfButton:{
            default:null,
            type:cc.Button,
        },
        choiceHeroBoard:{
            default: null,
            type: cc.Node,
        },
        choiceCardBoard:{
            default: null,
            type: cc.Node,
        },
        cardListNode:cc.Node,
    },
    
    onLoad:function(){
        this.choiceHeroBoard.active = false;
        this.choiceCardBoard.active = true;
        this.cardListScript = this.cardListNode.getComponent("CardList");
    },
    //Ӣ��
    heroInfLayout: function () {
        this.layoutSwitch(this.choiceHeroBoard,this.heroInfButton);
        this.choiceHeroBoard.active = true;
        this.choiceCardBoard.active = false;
        //cc.director.loadScene("HeroInfScene.fire");
    },
    //����
    openCardLayout: function(){
        this.layoutSwitch(this.choiceOpenBoard,this.openCardButton);
        this.choiceHeroBoard.active = false;
        this.choiceCardBoard.active = false;
        //cc.director.loadScene("OpenCardScene.fire");
    },
    //����
    cardGroupLayout: function(){
        this.layoutSwitch(this.choiceCardBoard,this.cardGroupButton);
        this.cardListScript.renewShowCardGroup();
        this.choiceHeroBoard.active = false;
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
