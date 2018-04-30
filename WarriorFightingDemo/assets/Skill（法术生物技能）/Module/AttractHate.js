
var globalConstant = require("Constant");
cc.Class({
    extends: cc.Component,

    properties: {
        //吸引在前面的生物
        before:true,
        //吸引在后面的生物
        after:true
    },

    // LIFE-CYCLE CALLBACKS:

    //onLoad: function(){
    //},

    releaseFunction:function(target){
        var script = this.node.parent.parent.getComponent("Skill");
        var creatureScript = null;
        var selfCreatureScript = script.selfObjectScript;

        var self = this;

        var effectAbleScript = this.node.getComponent("usable");
        var i = 0,j;

        setTimeout(function(){
            //处理target对于输入了具体目标的情况
            console.log("attract hate1");
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
                for(j = 0;j < targetScript.enemyTarget.length;j++){
                    if(targetScript.enemyTarget[j] === selfCreatureScript.node){
                        if(self.before === true) {
                            if(selfCreatureScript.team * targetScript.node.x <=
                                selfCreatureScript.team * selfCreatureScript.node.x){
                                var theTarget = targetScript.enemyTarget[j];
                                targetScript.enemyTarget[j] = targetScript.enemyTarget[0];
                                targetScript.enemyTarget[0] = theTarget;
                            }
                        }
                        if(self.after === true) {
                            if(selfCreatureScript.team * targetScript.node.x >=
                                selfCreatureScript.team * selfCreatureScript.node.x){
                                theTarget = targetScript.enemyTarget[j];
                                targetScript.enemyTarget[j] = targetScript.enemyTarget[0];
                                targetScript.enemyTarget[0] = theTarget;
                            }
                        }
                    }
                }
                return;
            }

            console.log("attract hate2");

            targets = effectAbleScript.isEffectEnable(script.creatureLayer.children);
            for (i = 0; i < targets.length; i++) {
                targetScript = targets[i].getComponent("Unit");
                for(j = 0;j < targetScript.enemyTarget.length;j++){
                    if(targetScript.enemyTarget[j] === selfCreatureScript.node){
                        if(self.before === true) {
                            if(selfCreatureScript.team * targetScript.node.x <=
                                selfCreatureScript.team * selfCreatureScript.node.x){
                                theTarget = targetScript.enemyTarget[j];
                                targetScript.enemyTarget[j] = targetScript.enemyTarget[0];
                                targetScript.enemyTarget[0] = theTarget;
                            }
                        }
                        if(self.after === true) {
                            if(selfCreatureScript.team * targetScript.node.x >=
                                selfCreatureScript.team * selfCreatureScript.node.x){
                                theTarget = targetScript.enemyTarget[j];
                                targetScript.enemyTarget[j] = targetScript.enemyTarget[0];
                                targetScript.enemyTarget[0] = theTarget;
                            }
                        }
                    }
                }
            }
            targets = effectAbleScript.isEffectEnable(script.baseLayer.children);
            for (i = 0; i < targets.length; i++) {
                targetScript = targets[i].getComponent("Unit");
                for(j = 0;j < targetScript.enemyTarget.length;j++){
                    if(targetScript.enemyTarget[j] === selfCreatureScript.node){
                        if(self.before === true) {
                            if(selfCreatureScript.team * targetScript.node.x <=
                                selfCreatureScript.team * selfCreatureScript.node.x){
                                theTarget = targetScript.enemyTarget[j];
                                targetScript.enemyTarget[j] = targetScript.enemyTarget[0];
                                targetScript.enemyTarget[0] = theTarget;
                            }
                        }
                        if(self.after === true) {
                            if(selfCreatureScript.team * targetScript.node.x >=
                                selfCreatureScript.team * selfCreatureScript.node.x){
                                theTarget = targetScript.enemyTarget[j];
                                targetScript.enemyTarget[j] = targetScript.enemyTarget[0];
                                targetScript.enemyTarget[0] = theTarget;
                            }
                        }
                    }
                }
            }
            targets = effectAbleScript.isEffectEnable(script.hero);
            for (i = 0; i < targets.length; i++) {
                targetScript = targets[i].getComponent("Unit");
                for(j = 0;j < targetScript.enemyTarget.length;j++){
                    if(targetScript.enemyTarget[j] === selfCreatureScript.node){
                        if(self.before === true) {
                            if(selfCreatureScript.team * targetScript.node.x <=
                                selfCreatureScript.team * selfCreatureScript.node.x){
                                theTarget = targetScript.enemyTarget[j];
                                targetScript.enemyTarget[j] = targetScript.enemyTarget[0];
                                targetScript.enemyTarget[0] = theTarget;
                            }
                        }
                        if(self.after === true) {
                            if(selfCreatureScript.team * targetScript.node.x >=
                                selfCreatureScript.team * selfCreatureScript.node.x){
                                theTarget = targetScript.enemyTarget[j];
                                targetScript.enemyTarget[j] = targetScript.enemyTarget[0];
                                targetScript.enemyTarget[0] = theTarget;
                            }
                        }
                    }
                }
            }
        },40);

    }
    // update (dt) {},
});
