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
                selfHero:3,
                //作用单位的坐标
                target:4,
            }),
            default:0
        },

        //动画的ID
        id:0,
        //在召唤位置上偏移，偏移的像素为(可正可负),（我方，敌方坐标是对称的，以我方基地为后方，以敌方基地为前方）
        offset:0,
        //需要召唤生物的召唤预制
        //如果使用这种方式，则会忽略之前的召唤ID方法
        //如果召唤衍生物推荐使用这种方法
        animationPrefab:cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    //onLoad: function(){
    //},

    releaseFunction:function(target){
        var i = 0,x;
        var script = this.node.parent.parent.getComponent("Skill");
        var creatureScript = null;
        this.selfObjectScript = script.selfObjectScript;

        var effectAbleScript = this.node.getComponent("usable");

        var enumDat = cc.Enum({
            //场景中间
            mid:0,
            //初始位置
            origin:1,
            //当前生物的位置
            now:2,
            //当前英雄的位置
            selfHero:3,
            target:4
        });
        if (this.position === enumDat.target && target !== undefined && target !== null) {
            if(effectAbleScript !== null) {
                var targets = [];
                targets = effectAbleScript.isEffectEnable([target]);
                if(targets.length === 0 || targets === undefined) {
                    return;
                }else{
                    var targetScript = targets[0].getComponent("Unit");
                }
            }else{
                targetScript = target.getComponent("Unit");
            }
        }

        switch (this.position){
            case enumDat.mid:
                x = cc.director.getWinSize().width * globalConstant.sceneWidth / 2;
                this.summonCreature(x,this.id);
                break;
            case enumDat.origin:
                x = cc.director.getWinSize().width * globalConstant.sceneWidth / 2 *
                    (1 + this.selfObjectScript.team/Math.abs(this.selfObjectScript.team));
                this.summonCreature(x,this.id);
                break;
            case enumDat.now:
                x = this.selfObjectScript.node.x;
                this.summonCreature(x,this.id);
                break;
            case enumDat.selfHero:
                x = script.hero[0].x;
                this.summonCreature(x,this.id);
                break;
            case enumDat.target:
                x = target.x;
                cc.log(target.x + "x y 是" + target.y);
                this.summonCreature(x,this.id,target.y);
                break;
        }
    },
    summonCreature:function(x,id,y){
        var eventsend = new cc.Event.EventCustom('animationCreate',true);
        if(y === undefined){
            y = null;
        }
        eventsend.setUserData({
            X:x - this.offset * this.selfObjectScript.team / Math.abs(this.selfObjectScript.team),
            Y:y,
            id:id,
            network:false,
            prefab:this.animationPrefab
        });
        this.node.dispatchEvent(eventsend);
    }
    // update (dt) {},
});
