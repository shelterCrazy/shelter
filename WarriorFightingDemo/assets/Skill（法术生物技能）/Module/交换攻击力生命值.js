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
    },

    // LIFE-CYCLE CALLBACKS:

    //onLoad: function(){
    //},
    //如果已经有了目标，放弃其他的操作
    releaseFunction:function(target){
        var script = this.node.parent.getComponent("Skill");
        var creatureScript = null;
        var selfCreatureScript = script.selfCreatureScript;

        var effectAbleScript = this.node.getComponent("usable");

        var i = 0,k;
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
        //处理target
        if(target !== undefined && target !== null){
            k = target.attack;
            target.attack = target.health;
            target.health = k;
            return;
        }
        //处理需要应对的各种情况
        switch (this.target){
            case enumDat.Creature:
                for(i = 0;i < script.creatureLayer.children.length;i++) {
                    creatureScript = script.creatureLayer.children[i].getComponent("Creature");
                    if(effectAbleScript === null || effectAbleScript.isEffectEnable(creatureScript)) {
                        if(creatureScript !== selfCreatureScript) {
                            k = creatureScript.attack;
                            creatureScript.attack = creatureScript.health;
                            creatureScript.health = k;
                        }
                    }
                }
                break;
            case enumDat.myCreature:
                for(i = 0;i < script.creatureLayer.children.length;i++) {
                    creatureScript = script.creatureLayer.children[i].getComponent("Creature");
                    if(creatureScript.team * selfCreatureScript.team > 0) {
                        if(effectAbleScript === null || effectAbleScript.isEffectEnable(creatureScript)) {
                            if(creatureScript !== selfCreatureScript) {
                                k = creatureScript.attack;
                                creatureScript.attack = creatureScript.health;
                                creatureScript.health = k;
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
                            k = creatureScript.attack;
                            creatureScript.attack = creatureScript.health;
                            creatureScript.health = k;
                        }
                    }
                }
                break;
            case enumDat.selfCreature:
                if(effectAbleScript === null || effectAbleScript.isEffectEnable(selfCreatureScript)) {
                    k = selfCreatureScript.attack;
                    selfCreatureScript.attack = selfCreatureScript.health;
                    selfCreatureScript.health = k;
                }
                break;
        }
    },

    releaseFunctionWithTarget:function(target){
        var script = target.getComponents("Creature");
        var k = 0;
        if(script === null){
            return;
        }
        k = script.attack;
        script.attack = script.health;
        script.health = k;
    }
    // update (dt) {},
});
