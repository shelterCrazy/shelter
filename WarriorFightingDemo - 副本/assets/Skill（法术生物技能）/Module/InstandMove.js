// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        //移动调整模式
        adjustMode: {
            type: cc.Enum({
                //变化
                by: 0,
                //变为
                to: 1
            }),
            default: 0
        },
        //增量
        delta: 0,
        //变为量
        final: 0,
        // 消耗时间
        duration: 0

    },

    // LIFE-CYCLE CALLBACKS:

    //onLoad: function(){
    //},

    releaseFunction: function (target) {
        var script = this.node.parent.parent.getComponent("Skill");
        var creatureScript = null;
        var selfCreatureScript = script.selfObjectScript;

        var effectAbleScript = this.node.getComponent("usable");
        var i = 0;
        var adjustMode = cc.Enum({
            //变化
            by: 0,
            //变为
            to: 1
        });
        //处理target对于输入了具体目标的情况
        console.log("Instand move1");
        if (target !== undefined && target !== null) {
            var targetScript = target.getComponent("Unit");
            if (this.adjustMode === adjustMode.by) {
                targetScript.node.runAction(cc.moveBy(this.duration,
                    cc.p(- targetScript.team * this.delta, 0)));
            } else {
                targetScript.node.runAction(cc.moveBy(this.duration,
                    cc.p(this.final - this.node.parent.parent.x, 0)));
            }
            return;
        }

        console.log("Instand move2");

        var targets = effectAbleScript.isEffectEnable(script.creatureLayer.children);
        for (i = 0; i < targets.length; i++) {
            targetScript = targets[i].getComponent("Unit");
            if (this.adjustMode === adjustMode.by) {
                targetScript.node.runAction(cc.moveBy(this.duration,
                    cc.p(- targetScript.team * this.delta, 0)));
            } else {
                targetScript.node.runAction(cc.moveBy(this.duration,
                    cc.p(this.final - this.node.parent.parent.x, 0)));
            }
        }
        //targets = effectAbleScript.isEffectEnable(script.baseLayer.children);
        //for (i = 0; i < targets.length; i++) {
        //    targetScript = targets[i].getComponent("Unit");
        //    if (this.adjustMode === adjustMode.by) {
        //        targetScript.node.runAction(cc.moveBy(this.duration,
        //            cc.p(- targetScript.team * this.delta, 0)));
        //    } else {
        //        targetScript.node.runAction(cc.moveBy(this.duration,
        //            cc.p(this.final - this.node.parent.parent.x, 0)));
        //    }
        //}
        targets = effectAbleScript.isEffectEnable(script.hero);
        for (i = 0; i < targets.length; i++) {
            targetScript = targets[i].getComponent("Unit");
            if (this.adjustMode === adjustMode.by) {
                targetScript.node.runAction(cc.moveBy(this.duration,
                    cc.p(- targetScript.team * this.delta, 0)));
            } else {
                targetScript.node.runAction(cc.moveBy(this.duration,
                    cc.p(this.final - this.node.parent.parent.x, 0)));
            }
        }
    }
    // update (dt) {},
});