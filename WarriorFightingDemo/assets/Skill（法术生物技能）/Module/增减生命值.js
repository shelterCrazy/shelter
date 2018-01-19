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
                //英雄
                hero:3,
                //我方英雄
                selfHero:4,
                //敌方英雄
                enemyHero:5,
                //攻击此生物
                attackCreature:6,
                //此生物
                selfCreature:7
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
        var creatureScript = null,heroScript = null;
        var selfCreatureScript = script.selfCreatureScript;


        var i = 0;
        var enumDat = cc.Enum({
                //全部生物
                Creature:0,
                //我方生物
                myCreature:1,
                //敌方生物
                enemyCreature:2,
                //英雄
                hero:3,
                //我方英雄
                selfHero:4,
                //敌方英雄
                enemyHero:5,
                //攻击此生物
                attackCreature:6,
                //此生物
                selfCreature:7
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
                target.changeHealth(this.delta);
            } else {
                target.health = this.final;
            }
            return;
        }
        switch (this.target){
            case enumDat.Creature:
                for(i = 0;i < script.creatureLayer.children.length;i++) {
                    creatureScript = script.creatureLayer.children[i].getComponent("Creature");
                    if(this.adjustMode === adjustMode.by){
                        creatureScript.changeHealth(this.delta);
                    }else{
                        creatureScript.health = this.final;
                    }
                }
                break;
            case enumDat.myCreature:
                for(i = 0;i < script.creatureLayer.children.length;i++) {
                    creatureScript = script.creatureLayer.children[i].getComponent("Creature");
                    if(creatureScript.team * selfCreatureScript.team > 0) {
                        if (this.adjustMode === adjustMode.by) {
                            creatureScript.changeHealth(this.delta);
                        } else {
                            creatureScript.health = this.final;
                        }
                    }
                }
                break;
            case enumDat.enemyCreature:
                for(i = 0;i < script.creatureLayer.children.length;i++) {
                    creatureScript = script.creatureLayer.children[i].getComponent("Creature");
                    if(creatureScript.team * selfCreatureScript.team < 0) {
                        if (this.adjustMode === adjustMode.by) {
                            creatureScript.changeHealth(this.delta);
                        } else {
                            creatureScript.health = this.final;
                        }
                    }
                }
                break;
            case enumDat.selfCreature:
                if (this.adjustMode === adjustMode.by) {
                    selfCreatureScript.changeHealth(this.delta);
                } else {
                    selfCreatureScript.health = this.final;
                }
                break;
            case enumDat.hero:
                for(i = 0;i < script.hero.length;i++) {
                    heroScript = script.hero[i].getComponent("Player");
                    if (this.adjustMode === adjustMode.by) {
                        heroScript.changeHealth(this.delta);
                    } else {
                        heroScript.health = this.final;
                    }
                }
                break;
            case enumDat.selfHero:
                for(i = 0;i < script.hero.length;i++) {
                    heroScript = script.hero[i].getComponent("Player");
                    if(heroScript.team * selfCreatureScript.team > 0) {
                        if (this.adjustMode === adjustMode.by) {
                            heroScript.changeHealth(this.delta);
                        } else {
                            heroScript.health = this.final;
                        }
                    }
                }
                break;
            case enumDat.enemyHero:
                for(i = 0;i < script.hero.length;i++) {
                    heroScript = script.hero[i].getComponent("Player");
                    if(heroScript.team * selfCreatureScript.team < 0) {
                        if (this.adjustMode === adjustMode.by) {
                            heroScript.changeHealth(this.delta);
                        } else {
                            heroScript.health = this.final;
                        }
                    }
                }
                break;
        }
    },
    releaseFunctionWithTarget:function(target){
        var script = target.getComponents("Creature");
        if(script === null){
            script = target.getComponents("Hero");
        }
        if(script === null){
            script = target.getComponents("Base");
        }
        if(script === null){
            return;
        }
        var adjustMode = cc.Enum({
            //变化
            by:0,
            //变为
            to:1
        });
        if (this.adjustMode === adjustMode.by) {
            script.changeHealth(this.delta);
        } else {
            script.health = this.final;
        }
    }

    // update (dt) {},
});
