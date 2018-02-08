var globalConstant = require("Constant");
cc.Class({
    extends: cc.Component,

    properties: {
        team:0,
        health:0,
        death:false,
        element:[cc.Node],

        healthLabel:cc.Label,

        audioSource: cc.AudioClip,

        progressBarNode:cc.Node,

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
        this.health = globalConstant.totalBaseHealth;
        this.healthLabel.string = this.health;
        this.progressBar = this.progressBarNode.getComponent(cc.ProgressBar);
        this.animationClip = this.node.getComponent(cc.Animation);
    },
    playEndAnimation:function(){
        var anim1 = this.animationClip.play("BaseBoom");
        var self = this;
        anim1.on('finished',function(){

            var eventsend = new cc.Event.EventCustom('callWinLosePanel',true);
            eventsend.setUserData({
                loseTeam: this.team,
            });
            self.node.dispatchEvent(eventsend);

        },this);
    },
    init:function(element,offset,team){
        this.team = team;
        this.node.x = offset + cc.director.getWinSize().width*globalConstant.sceneWidth/2;
        this.initElement(element);
    },
    initElement:function(element){
        var i;
        for(i = 0;i<3;i++){
            if(i !== element){
                this.element[i].active = false;
            }
        }
    },

    changeHealth:function(value){
        this.health += value;
        this.progressBar.progress = this.health / globalConstant.totalBaseHealth;
        this.healthLabel.string = this.health;
        if(this.health <= 0){
            this.death = true;
            this.releaseTarget();
            return 1;
        }
    },

    releaseTarget:function(){

        var eventsend = new cc.Event.EventCustom('isWin',true);

        eventsend.setUserData({
            //win: this.team / Math.abs(this.team),
            position: this.node.x,
            baseScript: this
        });

        this.node.dispatchEvent(eventsend);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
