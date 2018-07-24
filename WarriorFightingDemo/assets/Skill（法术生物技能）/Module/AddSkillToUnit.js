
cc.Class({
    extends: cc.Component,

    properties: {

        _thisChildren:[cc.Node],
        //使用的功能
        functions:0
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
        console.log("Add Skill1");
        if (target !== undefined && target !== null) {
            if(effectAbleScript !== null) {
                cc.log("effectAbleScript !== null");
                var targets = effectAbleScript.isEffectEnable([target]);
                if(targets.length === 0)return;
                var targetScript = targets[0].getComponent("Unit");
            }else{
                cc.log("effectAbleScript === null");
                targetScript = target.getComponent("Unit");
            }


            //*这个有待修改
            this._thisChildren = this.node.children.splice(0);
            //targetScript = targets[i].getComponent("Unit");
            var children0 = cc.instantiate(this._thisChildren[0]);
            children0.removeFromParent();
            targetScript.skillComponent.releaseFunc[this.functions].addChild(children0);

            return;
        }

        console.log("Add Skill2");

        targets = effectAbleScript.isEffectEnable(script.creatureLayer.children);
        var thisChildren = this.node.children.splice(0);
        for (i = 0; i < targets.length; i++) {
            targetScript = targets[i].getComponent("Unit");
            children0 = cc.instantiate(thisChildren[0]);
            children0.removeFromParent();
            targetScript.skillComponent.releaseFunc[this.functions].addChild(children0);
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
            children0 = cc.instantiate(thisChildren[0]);
            children0.removeFromParent();
            targetScript.skillComponent.releaseFunc[this.functions].addChild(children0);
        }
    }
    // update (dt) {},
});
