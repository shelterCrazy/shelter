var globalConstant = require("Constant");
cc.Class({
    extends: cc.Component,

    properties: {
        creature: cc.Node,
        attack:cc.Label,
        health:cc.Label,
        script:null,
        //≈–∂œ¿‡–Õ « hero creature
        nodeType:{
            type: cc.Enum({
                Creature: 0,
                Hero: 1,
                Base: 2,
            }),
            default: 0
        },

        signState:0,
        signNode:[cc.Node],
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        this.node.y = - 16;
    },
    fnGiveNode: function(node){
        this.creature = node;
        this.node.x = this.creature.x / (cc.director.getWinSize().width * globalConstant.sceneWidth)
            * globalConstant.smallMapLength;
        if(this.nodeType === 0){
            this.script = this.creature.getComponent('Creature');
        }else if(this.nodeType === 1){
            this.script = this.creature.getComponent('Player');
        }else{

        }
    },
    fnRenewSign:function(){
        this.node.x = this.creature.x / (cc.director.getWinSize().width * globalConstant.sceneWidth)
            * globalConstant.smallMapLength;
        if(this.nodeType === 0) {
            this.attack.string = this.script.attack;
        }else{
            this.attack.string = "";
        }
        this.health.string = this.script.health;
        for(var i = 0;i < this.signNode.length;i++){
            if(this.signState === i){
                this.signNode[i].active = true;
            }else{
                this.signNode[i].active = false;
            }
        }
    },
    renewTeam:function(){
        if(this.nodeType === 0) {
            if (this.script.team < 0) {
                this.signState = 0;
            } else if (this.script.team > 0) {
                this.signState = 1;
            } else {

            }
        }else {
            if (this.script.team < 0) {
                if(this.script.death === true){
                    this.signState = 4;
                }else{
                    this.signState = 2;
                }
            } else if (this.script.team > 0) {
                if(this.script.death === true){
                    this.signState = 5;
                }else{
                    this.signState = 3;
                }
            } else {

            }

        }
    },
    removeSign: function(){
        this.node.removeFromParent();
        this.node.active = false;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.renewTeam();
        this.fnRenewSign();
    },
    
    
});
