
var globalConstant = require("Constant");
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
        console.log("kill Unit & get health1");
        if (target !== undefined && target !== null) {
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
            script.hero[0].getComponent("Unit").changeHealthBy(targetScript.health);
            targetScript.release();
            return;
        }

        console.log("kill Unit & get health2");

        targets = effectAbleScript.isEffectEnable(script.creatureLayer.children);
        for (i = 0; i < targets.length; i++) {
            targetScript = targets[i].getComponent("Unit");
            script.hero[0].getComponent("Unit").changeHealthBy(targetScript.health);
            targetScript.release();
        }
        //targets = effectAbleScript.isEffectEnable(script.baseLayer.children);
        //for (i = 0; i < targets.length; i++) {
        //    targetScript = targets[i].getComponent("Unit");
        //    targetScript.release();
        //}
        targets = effectAbleScript.isEffectEnable(script.hero);
        for (i = 0; i < targets.length; i++) {
            targetScript = targets[i].getComponent("Unit");
            script.hero[0].getComponent("Unit").changeHealthBy(targetScript.health);
            targetScript.release();
        }
    }
    // update (dt) {},
});
