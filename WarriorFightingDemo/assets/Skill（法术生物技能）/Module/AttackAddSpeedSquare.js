
cc.Class({
    extends: cc.Component,

    properties: {

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
        console.log("Change Attack1");
        if (target !== undefined && target !== null) {
            if(effectAbleScript !== null) {
                var targets = effectAbleScript.isEffectEnable([target]);
                var targetScript = targets[0].getComponent("Unit");
            }else{
                targetScript = target.getComponent("Unit");
            }
            targetScript.changeAttackBy(targetScript.speed*targetScript.speed);
            return;
        }

        console.log("Change Attack2");

        targets = effectAbleScript.isEffectEnable(script.creatureLayer.children);
        for (i = 0; i < targets.length; i++) {
            targetScript = targets[i].getComponent("Unit");
            targetScript.changeAttackBy(targetScript.speed*targetScript.speed);
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
            targetScript.changeAttackBy(targetScript.speed*targetScript.speed);
        }
    }
    // update (dt) {},
});
