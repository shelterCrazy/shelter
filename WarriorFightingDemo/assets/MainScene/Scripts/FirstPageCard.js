cc.Class({
    extends: cc.Component,

    properties: {
        moonLightWorm:{
            default: null,
            type: cc.Prefab,
        },
        unDeadBird:{
            default: null,
            type: cc.Prefab,
        },
    },

    // use this for initialization
    onLoad: function () {
        this.creatCard(this.moonLightWorm,0);
        this.creatCard(this.unDeadBird,1);
    },
    creatCard: function(cardType,i){
        var newCard = cc.instantiate(cardType);
        newCard.x = -120+(120*i);
        newCard.y = 130;
        this.node.addChild(newCard);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
