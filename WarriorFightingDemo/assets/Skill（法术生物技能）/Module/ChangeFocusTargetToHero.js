cc.Class({
    extends: cc.Component,

    properties: {

    },

    releaseFunction:function(target){
        var script = this.node.parent.parent.getComponent("Skill");
        var creatureScript = null;
        var selfCreatureScript = script.selfObjectScript;

        var self = this;

        var effectAbleScript = this.node.getComponent("usable");
        var i = 0;

        //处理target对于输入了具体目标的情况
        console.log("Change Target1");
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
            if(targetScript.team < 0) {
                targetScript.focusTarget = script.hero[0];
            }else{
                targetScript.focusTarget = script.hero[1];
            }
            return;
        }

        console.log("Change Target2");

        if(selfCreatureScript.team < 0) {
            selfCreatureScript.focusTarget = script.hero[0];
        }else{
            selfCreatureScript.focusTarget = script.hero[1];
        }
    }

    // update (dt) {},
});
