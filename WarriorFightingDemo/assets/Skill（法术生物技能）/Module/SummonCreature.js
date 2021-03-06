
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
                selfHero:3,
            }),
            default:0
        },

        //召唤生物的ID
        id:0,
        //在召唤位置上偏移，偏移的像素为(可正可负),（我方，敌方坐标是对称的，以我方基地为后方，以敌方基地为前方）
        offset:0,

        delay:0,
        //需要召唤生物的召唤预制
        //如果使用这种方式，则会忽略之前的召唤ID方法
        //如果召唤衍生物推荐使用这种方法
        creaturePrefab:cc.Prefab,

        battleCry:false,
    },

    // LIFE-CYCLE CALLBACKS:

    //onLoad: function(){
    //},

    releaseFunction:function(){
        var script = this.node.parent.parent.getComponent("Skill");
        var creatureScript = null;
        var selfObjectScript = this.selfObjectScript = script.selfObjectScript;
        this.selfObject = this.selfObjectScript.node;
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
                this.summonCreature(x,selfObjectScript.team,this.id);
                break;
            case enumDat.origin:
                x = cc.director.getWinSize().width * globalConstant.sceneWidth / 2 *
                    (1 + selfObjectScript.team/Math.abs(selfObjectScript.team));
                this.summonCreature(x,selfObjectScript.team,this.id);
                break;
            case enumDat.now:
                x = selfObjectScript.node.x;
                this.summonCreature(x,selfObjectScript.team,this.id);
                break;
            case enumDat.selfHero:
                x = script.hero[0].x;
                this.summonCreature(x,selfObjectScript.team,this.id);
                break;
        }
    },
    summonCreature:function(x,team,id){
        var eventsend = new cc.Event.EventCustom('creatureCreate',true);
        eventsend.setUserData({
            summonLayer:(this.selfObjectScript.logicNode === this.selfObject) ? "View" : "Logic",
            X:x - this.offset * team / Math.abs(team),
            Y:null,
            team:team,
            id:id,
            network:false,
            prefab:this.creaturePrefab,
            battleCry:this.battleCry,
            delay:this.delay
        });
        this.node.dispatchEvent(eventsend);
    }
    // update (dt) {},
});
