//增加单位的状态
var globalConstant = require("Constant");
cc.Class({
    extends: cc.Component,

    properties: {
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
                healthAreAtk: 7,
                speedDownTo: 8,
                infect:9
            }),
            default:0
        },
        dat1:0,
        dat2:-1,
        dat3:0
    },

    // LIFE-CYCLE CALLBACKS:

    //onLoad: function(){
    //},

    releaseFunction:function(target){
        var script = this.node.parent.parent.getComponent("Skill");
        var creatureScript = null;
        var selfCreatureScript = script.selfObjectScript;

        var effectAbleScript = this.node.getComponent("usable");
        var i = 0;

        //处理target对于输入了具体目标的情况
        console.log("Add State1");
        if (target !== undefined && target !== null) {
            if(effectAbleScript !== null) {
                var targets = effectAbleScript.isEffectEnable([target]);
                if(targets.length === 0){
                    return;
                }else{
                    var targetScript = targets[0].getComponent("Unit");
                }
            }else{
                targetScript = target.getComponent("Unit");
            }
            var stateScript = targetScript.stateNode.getComponent("StateManager");
            stateScript.addState(
                this.state,
                script.selfObjectScript.node,
                this.dat1,
                this.dat2,
                this.dat3,
                script.selfObjectScript.team
            );
            return;
        }

        console.log("Add State2");

        targets = effectAbleScript.isEffectEnable(script.creatureLayer.children);
        for (i = 0; i < targets.length; i++) {
            targetScript = targets[i].getComponent("Unit");
            stateScript = targetScript.stateNode.getComponent("StateManager");
            stateScript.addState(
                this.state,
                script.selfObjectScript.node,
                this.dat1,
                this.dat2,
                this.dat3,
                script.selfObjectScript.team
            );
        }
        //targets = effectAbleScript.isEffectEnable(script.baseLayer.children);
        //for (i = 0; i < targets.length; i++) {
        //    targetScript = targets[i].getComponent("Unit");
        //    if (this.adjustMode === adjustMode.by) {
        //        targetScript.changeAttackBy(this.delta);
        //    } else {
        //        targetScript.changeAttackTo(this.final);
        //    }
        //}

        targets = effectAbleScript.isEffectEnable(script.hero);
        for (i = 0; i < targets.length; i++) {
            targetScript = targets[i].getComponent("Unit");
            stateScript = targetScript.stateNode.getComponent("StateManager");
            stateScript.addState(this.state,script.selfObjectScript.node,this.dat1,this.dat2,this.dat3,script.selfObjectScript.team);
        }
    }
    // update (dt) {},
});
