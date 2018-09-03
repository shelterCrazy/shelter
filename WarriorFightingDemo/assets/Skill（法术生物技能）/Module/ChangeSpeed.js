cc.Class({
    extends: cc.Component,

    properties: {
        //攻击力调整模式
        adjustMode:{
            type:cc.Enum({
                //变化
                by:0,
                //变为
                to:1,
                //百分比
                percent:2
            }),
            default:0
        },
        //参数
        dat:0
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
        var adjustMode = cc.Enum({
            //变化
            by: 0,
            //变为
            to: 1,
            //百分比
            percent:2
        });
        //处理target对于输入了具体目标的情况
        console.log("Change Speed1");
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
            if (this.adjustMode === adjustMode.by) {
                targetScript.changeSpeedBy(this.dat);
            } else if(this.adjustMode === adjustMode.to){
                targetScript.changeSpeedTo(this.dat);
            } else {
                targetScript.changeSpeedBy(targetScript.speed * this.dat);
            }
            return;
        }

        console.log("Change Speed2");

        targets = effectAbleScript.isEffectEnable(script.creatureLayer.children);
        for (i = 0; i < targets.length; i++) {
            targetScript = targets[i].getComponent("Unit");
            if (this.adjustMode === adjustMode.by) {
                targetScript.changeSpeedBy(this.dat);
            } else if(this.adjustMode === adjustMode.to){
                targetScript.changeSpeedTo(this.dat);
            } else {
                targetScript.changeSpeedBy(targetScript.speed * this.dat);
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
            if (this.adjustMode === adjustMode.by) {
                targetScript.changeSpeedBy(this.dat);
            } else if(this.adjustMode === adjustMode.to){
                targetScript.changeSpeedTo(this.dat);
            } else {
                targetScript.changeSpeedBy(targetScript.speed * this.dat);
            }
        }
    }

    // update (dt) {},
});
