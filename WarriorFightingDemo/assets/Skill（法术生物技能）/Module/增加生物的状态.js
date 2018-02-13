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
        //目标单位
        target:{
            type:cc.Enum({
                //全部生物
                Creature:0,
                //我方生物
                myCreature:1,
                //敌方生物
                enemyCreature:2,
                //此生物
                selfCreature:3,
                //此生物攻击的生物
                attackCreature:4
            }),
            default:0
        },
        state: {
            type: cc.Enum({
                none: 0,
                freeze: 1,
                confine: 2,
                burn: 3,
                weak: 4,
                speedDown: 5,
                heal: 6,
                //互换生命值与攻击力
                healthAreAtk: 7
            }),
            default:0
        },
        dat1:0,
        dat2:-1
    },

    // LIFE-CYCLE CALLBACKS:

    //onLoad: function(){
    //},

    releaseFunction:function(target){
        var script = this.node.parent.getComponent("Skill");
        var creatureScript = null;
        var selfCreatureScript = script.selfCreatureScript;
        var stateScript = null;
        //获取判断可否使用的组件
        var effectAbleScript = this.node.getComponent("usable");

        var i = 0;
        var enumDat = cc.Enum({
            //全部生物
            Creature:0,
            //我方生物
            myCreature:1,
            //敌方生物
            enemyCreature:2,
            //此生物
            selfCreature:3,
            //此生物攻击的生物
            attackCreature:4
        });
        //处理target
        if(target !== undefined && target !== null){
            stateScript = target.stateNode.getComponent("State");
            stateScript.addState(this.state,this.dat1,this.dat2);
            return;
        }
        switch (this.target) {
            case enumDat.Creature:
                for (i = 0; i < script.creatureLayer.children.length; i++) {
                    creatureScript = script.creatureLayer.children[i].getComponent("Creature");
                    if(effectAbleScript === null || effectAbleScript.isEffectEnable(creatureScript)) {
                        if(creatureScript !== selfCreatureScript) {
                            stateScript = creatureScript.stateNode.getComponent("State");
                            stateScript.addState(this.state, this.dat1, this.dat2);
                        }
                    }
                }
                break;
            case enumDat.myCreature:
                for (i = 0; i < script.creatureLayer.children.length; i++) {
                    creatureScript = script.creatureLayer.children[i].getComponent("Creature");
                    if (creatureScript.team * selfCreatureScript.team > 0) {
                        if(effectAbleScript === null || effectAbleScript.isEffectEnable(creatureScript)) {
                            if(creatureScript !== selfCreatureScript) {
                                stateScript = creatureScript.stateNode.getComponent("State");
                                stateScript.addState(this.state, this.dat1, this.dat2);
                            }
                        }
                    }
                }
                break;
            case enumDat.enemyCreature:
                for (i = 0; i < script.creatureLayer.children.length; i++) {
                    creatureScript = script.creatureLayer.children[i].getComponent("Creature");
                    if (creatureScript.team * selfCreatureScript.team < 0) {
                        if(effectAbleScript === null || effectAbleScript.isEffectEnable(creatureScript)) {

                            stateScript = creatureScript.stateNode.getComponent("State");
                            stateScript.addState(this.state, this.dat1, this.dat2);
                        }
                    }
                }
                break;
            case enumDat.selfCreature:
                if(effectAbleScript === null || effectAbleScript.isEffectEnable(selfCreatureScript)) {
                    stateScript = creatureScript.stateNode.getComponent("State");
                    stateScript.addState(this.state,this.dat1,this.dat2);
                }
                break;
            case enumDat.attackCreature:
                if (selfCreatureScript.targetType.length > 0 && selfCreatureScript.targetType[0] === 0) {
                    creatureScript = selfCreatureScript.target[i].getComponent("Creature");
                    if(effectAbleScript === null || effectAbleScript.isEffectEnable(creatureScript)) {
                        stateScript = creatureScript.stateNode.getComponent("State");
                        stateScript.addState(this.state,this.dat1,this.dat2);
                    }
                }
        }
    }
    // update (dt) {},
});
