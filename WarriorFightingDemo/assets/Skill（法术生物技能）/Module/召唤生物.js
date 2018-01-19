// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var globalConstant = require("Constant");
cc.Class({
    extends: cc.Component,

    properties: {
        //召唤位置
        position:{
            type:cc.Enum({
                //场景中间
                mid:0,
                //初始位置
                origin:1,
                //当前生物的位置
                now:2,
                //当前英雄的位置
                selfHero:3
            }),
            default:0
        },

        //召唤生物的ID
        id:0,

        creaturePrefab:cc.Prefab

    },

    // LIFE-CYCLE CALLBACKS:

    //onLoad: function(){
    //},

    releaseFunction:function(){
        var script = this.node.parent.getComponent("Skill");
        var creatureScript = null;
        var selfCreatureScript = script.selfCreatureScript;
        var i = 0,x;
        var enumDat = cc.Enum({
                //场景中间
                mid:0,
                //初始位置
                origin:1,
                //当前生物的位置
                now:2,
                //当前英雄的位置
                selfHero:3
            });


        switch (this.position){
            case enumDat.mid:
                x = cc.director.getWinSize().width * globalConstant.sceneWidth / 2;
                this.summonCreature(x,selfCreatureScript.team,this.id);
                break;
            case enumDat.origin:
                x = cc.director.getWinSize().width * globalConstant.sceneWidth / 2 *
                    (1 + selfCreatureScript.team/Math.abs(selfCreatureScript.team));
                this.summonCreature(x,selfCreatureScript.team,this.id);
                break;
            case enumDat.now:
                x = selfCreatureScript.node.x;
                this.summonCreature(x,selfCreatureScript.team,this.id);
                break;
            case enumDat.selfHero:
                x = script.hero[0].x;
                this.summonCreature(x,selfCreatureScript.team,this.id);
                break;
        }
    },
    summonCreature:function(x,team,id){
        var eventsend = new cc.Event.EventCustom('creatureCreate',true);
        eventsend.setUserData({
            X:x,
            Y:null,
            team:team,
            id:id,
            network:false,
            prefab:this.creaturePrefab,
        });
        this.node.dispatchEvent(eventsend);
    }
    // update (dt) {},
});
