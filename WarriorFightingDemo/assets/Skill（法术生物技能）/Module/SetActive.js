cc.Class({
    extends: cc.Component,

    properties: {
        active:true,
        delay:0,
    },

    // LIFE-CYCLE CALLBACKS:

    //onLoad: function(){
    //},

    releaseFunction:function(target) {
        var script = this.node.parent.parent.getComponent("Skill");
        var creatureScript = null;
        var selfCreatureScript = script.selfObjectScript;
        var self = this;
        var effectAbleScript = this.node.getComponent("usable");
        var i = 0;


            //处理target对于输入了具体目标的情况
            console.log("Set Active1");
            if (target !== undefined && target !== null) {
                if (effectAbleScript !== null) {
                    var targets = effectAbleScript.isEffectEnable([target]);
                    if (targets.length === 0) {
                        return;
                    } else {
                        var targetScript = targets[0].getComponent("Unit");
                    }
                } else {
                    targetScript = target.getComponent("Unit");
                }
                setTimeout(function () {
                targetScript.node.active = self.active;
                }, this.delay);
                return;
            }

            console.log("Set Active2");

            targets = effectAbleScript.isEffectEnable(script.creatureLayer.children);
        setTimeout(function () {
            for (i = 0; i < targets.length; i++) {
                targets[i].active = self.active;
            }
        }, this.delay);
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
        setTimeout(function () {
            for (i = 0; i < targets.length; i++) {
                targets[i].active = self.active;
            }
        }, this.delay);



    }
    // update (dt) {},
});
