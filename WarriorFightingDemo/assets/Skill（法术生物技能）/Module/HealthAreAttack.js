//用于交换生命值与攻击力的模块
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    //onLoad: function(){
    //},
    //如果已经有了目标，放弃其他的操作
    releaseFunction:function(target){
        var script = this.node.parent.parent.getComponent("Skill");
        var creatureScript = null;
        var selfObjectScript = script.selfObjectScript;

        var effectAbleScript = this.node.getComponent("usable");

        var i = 0,k;

        //处理target对于输入了具体目标的情况
        console.log("ChangeATKHp1");
        if (target !== undefined && target !== null) {
            var targets = effectAbleScript.isEffectEnable([target]);
            var targetScript = targets[0].getComponent("Unit");
            k = targetScript.attack;
            targetScript.changeAttackTo(targetScript.health);
            targetScript.changeHealthTo(k);
            return;
        }

        console.log("ChangeATKHp2");
        //处理需要应对的各种情况
        targets = effectAbleScript.isEffectEnable(script.creatureLayer.children);
        for (i = 0; i < targets.length; i++) {
            targetScript = targets[i].getComponent("Unit");
            k = targetScript.attack;
            targetScript.changeAttackTo(targetScript.health);
            targetScript.changeHealthTo(k);
        }
        targets = effectAbleScript.isEffectEnable(script.hero);
        for (i = 0; i < targets.length; i++) {
            targetScript = targets[i].getComponent("Unit");
            k = targetScript.attack;
            targetScript.changeAttackTo(targetScript.health);
            targetScript.changeHealthTo(k);
        }
    },

    //releaseFunctionWithTarget:function(target){
    //    var script = target.getComponents("Creature");
    //    var k = 0;
    //    if(script === null){
    //        return;
    //    }
    //    k = script.attack;
    //    script.attack = script.health;
    //    script.health = k;
    //}
    // update (dt) {},
});
