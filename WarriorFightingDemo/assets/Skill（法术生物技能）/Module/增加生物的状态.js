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
        //Ŀ�굥λ
        target:{
            type:cc.Enum({
                //ȫ������
                Creature:0,
                //�ҷ�����
                myCreature:1,
                //�з�����
                enemyCreature:2,
                //������
                selfCreature:3,
                //�����﹥��������
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
                //��������ֵ�빥����
                healthAreAtk: 7
            }),
            default:0,
        },
        dat1:0,
        dat2:0,
    },

    // LIFE-CYCLE CALLBACKS:

    //onLoad: function(){
    //},

    releaseFunction:function(target){
        var script = this.node.parent.getComponent("Skill");
        var creatureScript = null;
        var selfCreatureScript = script.selfCreatureScript;
        var stateScript = null;
        //��ȡ�жϿɷ�ʹ�õ����
        var effectAbleScript = this.node.getComponent("usable");

        var i = 0;
        var enumDat = cc.Enum({
            //ȫ������
            Creature:0,
            //�ҷ�����
            myCreature:1,
            //�з�����
            enemyCreature:2,
            //������
            selfCreature:3,
            //�����﹥��������
            attackCreature:4
        });
        //����target
        if(target !== undefined && target !== null){
            target.addState(this.state,this.dat1,this.dat2);
            return;
        }
        switch (this.target) {
            case enumDat.Creature:
                for (i = 0; i < script.creatureLayer.children.length; i++) {
                    creatureScript = script.creatureLayer.children[i].getComponent("Creature");
                    if(effectAbleScript === null || effectAbleScript.isEffectEnable(creatureScript)) {
                        stateScript = creatureScript.stateNode.getComponent("CreatureState");
                        cc.log(this.dat2);
                        stateScript.addState(this.state,this.dat1,this.dat2);
                    }
                }
                break;
            case enumDat.myCreature:
                for (i = 0; i < script.creatureLayer.children.length; i++) {
                    creatureScript = script.creatureLayer.children[i].getComponent("Creature");
                    if (creatureScript.team * selfCreatureScript.team > 0) {
                        if(effectAbleScript === null || effectAbleScript.isEffectEnable(creatureScript)) {
                            stateScript = creatureScript.stateNode.getComponent("CreatureState");
                            stateScript.addState(this.state,this.dat1,this.dat2);
                        }
                    }
                }
                break;
            case enumDat.enemyCreature:
                for (i = 0; i < script.creatureLayer.children.length; i++) {
                    creatureScript = script.creatureLayer.children[i].getComponent("Creature");
                    if (creatureScript.team * selfCreatureScript.team < 0) {
                        if(effectAbleScript === null || effectAbleScript.isEffectEnable(creatureScript)) {
                            stateScript = creatureScript.stateNode.getComponent("CreatureState");
                            stateScript.addState(this.state,this.dat1,this.dat2);
                        }
                    }
                }
                break;
            case enumDat.selfCreature:
                if(effectAbleScript === null || effectAbleScript.isEffectEnable(selfCreatureScript)) {
                    stateScript = creatureScript.stateNode.getComponent("CreatureState");
                    stateScript.addState(this.state,this.dat1,this.dat2);
                }
                break;
            case enumDat.attackCreature:
                if (selfCreatureScript.targetType.length > 0 && selfCreatureScript.targetType[0] === 0) {
                    creatureScript = selfCreatureScript.target[i].getComponent("Creature");
                    if(effectAbleScript === null || effectAbleScript.isEffectEnable(creatureScript)) {
                        stateScript = creatureScript.stateNode.getComponent("CreatureState");
                        stateScript.addState(this.state,this.dat1,this.dat2);
                    }
                }
        }
    }
    // update (dt) {},
});
