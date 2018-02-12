// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

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
                selfCreature:3
            }),
            default:0
        },
        //攻击力调整模式
        adjustMode:{
            type:cc.Enum({
                //变化
                by:0,
                //变为
                to:1
            }),
            default:0
        },
        //增量
        delta:0,
        //变为量
        final:0,

    },

    // LIFE-CYCLE CALLBACKS:

    //onLoad: function(){
    //},

    releaseFunction:function(target){
        var script = this.node.parent.getComponent("Skill");
        var creatureScript = null;
        var selfCreatureScript = script.selfCreatureScript;

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
                selfCreature:3
            });
        var adjustMode = cc.Enum({
            //变化
            by:0,
            //变为
            to:1
        });
        //处理target
        if(target !== undefined && target !== null){
            if (this.adjustMode === adjustMode.by) {
                if (target.attack + this.delta < 0) {
                    target.attack = 0;
                } else {
                    target.attack += this.delta;
                }
            } else {
                target.attack = this.final;
            }
            return;
        }
        switch (this.target){
            case enumDat.Creature:
                for(i = 0;i < script.creatureLayer.children.length;i++) {
                    creatureScript = script.creatureLayer.children[i].getComponent("Creature");
                    if(effectAbleScript === null || effectAbleScript.isEffectEnable(creatureScript)) {
                        if (creatureScript !== selfCreatureScript) {
                            if (this.adjustMode === adjustMode.by) {
                                if (creatureScript.attack + this.delta < 0) {
                                    creatureScript.attack = 0;
                                } else {
                                    creatureScript.attack += this.delta;
                                }
                            } else {
                                creatureScript.attack = this.final;
                            }
                        }
                    }
                }
                break;
            case enumDat.myCreature:
                for(i = 0;i < script.creatureLayer.children.length;i++) {
                    creatureScript = script.creatureLayer.children[i].getComponent("Creature");
                    if(creatureScript.team * selfCreatureScript.team > 0) {
                        if(effectAbleScript === null || effectAbleScript.isEffectEnable(creatureScript)) {
                            if (creatureScript !== selfCreatureScript) {
                                if (this.adjustMode === adjustMode.by) {
                                    if (creatureScript.attack + this.delta < 0) {
                                        creatureScript.attack = 0;
                                    } else {
                                        creatureScript.attack += this.delta;
                                    }
                                } else {
                                    creatureScript.attack = this.final;
                                }
                            }
                        }
                    }
                }
                break;
            case enumDat.enemyCreature:
                for(i = 0;i < script.creatureLayer.children.length;i++) {
                    creatureScript = script.creatureLayer.children[i].getComponent("Creature");
                    if(creatureScript.team * selfCreatureScript.team < 0) {
                        if(effectAbleScript === null || effectAbleScript.isEffectEnable(creatureScript)) {
                            if (this.adjustMode === adjustMode.by) {
                                if (creatureScript.attack + this.delta < 0) {
                                    creatureScript.attack = 0;
                                } else {
                                    creatureScript.attack += this.delta;
                                }
                            } else {
                                creatureScript.attack = this.final;
                            }
                        }
                    }
                }
                break;
            case enumDat.selfCreature:
                if(effectAbleScript === null || effectAbleScript.isEffectEnable(selfCreatureScript)) {
                    if (this.adjustMode === adjustMode.by) {
                        if (selfCreatureScript.attack + this.delta < 0) {
                            selfCreatureScript.attack = 0;
                        } else {
                            selfCreatureScript.attack += this.delta;
                        }
                    } else {
                        selfCreatureScript.attack = this.final;
                    }
                }
                break;
        }
    }
    // update (dt) {},
});
