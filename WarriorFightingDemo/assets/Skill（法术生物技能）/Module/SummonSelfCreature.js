
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
        //在召唤位置上偏移，偏移的像素为(可正可负),（我方，敌方坐标是对称的，以我方基地为后方，以敌方基地为前方）
        offset:0,
        //召唤数量
        num:1,
        //召唤时的像素间隔
        interval:0,

        battleCry:false,
    },

    // LIFE-CYCLE CALLBACKS:

    //onLoad: function(){
    //},

    releaseFunction:function(){
        var script = this.node.parent.parent.getComponent("Skill");
        var creatureScript = null;
        var selfObjectScript = script.selfObjectScript;
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

        var teamDat = - selfObjectScript.team / Math.abs(selfObjectScript.team);
        switch (this.position){
            case enumDat.mid:
                x = cc.director.getWinSize().width * globalConstant.sceneWidth / 2;
                for(i = 0;i < this.num;i++){
                    this.summonCreature(x + i * this.interval * teamDat,selfObjectScript.team,selfObjectScript.id);
                }
                break;
            case enumDat.origin:
                x = cc.director.getWinSize().width * globalConstant.sceneWidth / 2 *
                    (1 + selfObjectScript.team/Math.abs(selfObjectScript.team));
                for(i = 0;i < this.num;i++){
                    this.summonCreature(x + i * this.interval * teamDat,selfObjectScript.team,selfObjectScript.id);
                }
                break;
            case enumDat.now:
                x = selfObjectScript.node.x;
                for(i = 0;i < this.num;i++){
                    this.summonCreature(x + i * this.interval * teamDat,selfObjectScript.team,selfObjectScript.id);
                }
                break;
            case enumDat.selfHero:
                x = script.hero[0].x;
                for(i = 0;i < this.num;i++){
                    this.summonCreature(x + i * this.interval * teamDat,selfObjectScript.team,selfObjectScript.id);
                }
                break;
        }
    },

    summonCreature:function(x,team,id){
        var eventsend = new cc.Event.EventCustom('creatureCreate',true);
        eventsend.setUserData({
            X:x - this.offset * team / Math.abs(team),
            Y:null,
            team:team,
            id:id,
            network:false,
            battleCry:this.battleCry
        });
        this.node.dispatchEvent(eventsend);
    }
    // update (dt) {},
});
