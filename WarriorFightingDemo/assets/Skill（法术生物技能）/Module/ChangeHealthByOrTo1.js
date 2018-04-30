cc.Class({
    extends: cc.Component,

    properties: {
        //增量
        delta:0
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
        console.log("Change Health1");
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

            if(targetScript.health > Math.abs(this.delta)){
                targetScript.changeHealthBy(this.delta);
            }else {
                targetScript.changeHealthTo(1);
            }

            return;
        }

        console.log("Change Health2");

        targets = effectAbleScript.isEffectEnable(script.creatureLayer.children);
        for (i = 0; i < targets.length; i++) {
            targetScript = targets[i].getComponent("Unit");
            if(targetScript.health > Math.abs(this.delta)){
                targetScript.changeHealthBy(this.delta);
            }else {
                targetScript.changeHealthTo(1);
            }
        }
        //targets = effectAbleScript.isEffectEnable(script.baseLayer.children);
        //for (i = 0; i < targets.length; i++) {
        //    targetScript = targets[i].getComponent("Unit");
        //    if (this.adjustMode === adjustMode.by) {
        //        targetScript.changeHealthBy(this.delta);
        //    } else {
        //        targetScript.changeHealthTo(this.final);
        //    }
        //}
        targets = effectAbleScript.isEffectEnable(script.hero);
        for (i = 0; i < targets.length; i++) {
            targetScript = targets[i].getComponent("Unit");
            if(targetScript.health > Math.abs(this.delta)){
                targetScript.changeHealthBy(this.delta);
            }else {
                targetScript.changeHealthTo(1);
            }
        }
    }

    // update (dt) {},
});
