/**
 * @主要功能 用于处理生物的状态
 * @author C4
 * @Date 2017/12/10
 */
var globalConstant = require("Constant");
cc.Class({
    extends: cc.Component,

    properties: {
        statePrefab:cc.Prefab,
    },
    /**
     * @主要功能 添加一个状态并且处理逻辑
     * @author C14
     * @Date 2017/12/10
     * @param state
     * @param target
     * @param dat1
     * @param dat2
     * @param dat3
     * @param dat4
     * @returns
     */
    addState:function(state,target,dat1,dat2,dat3,dat4){
        var stateNode = cc.instantiate(this.statePrefab);
        var script = stateNode.getComponent("State");

        if(state === globalConstant.stateEnum.freeze){
            this.removeStateByState(globalConstant.stateEnum.burn);
        }
        if(state === globalConstant.stateEnum.burn){
            this.removeStateByState(globalConstant.stateEnum.freeze);
        }
        if(state === globalConstant.stateEnum.control){
            this.unitScript.changeTeam();
        }
        script.target = target;
        script.state = state;
        script.stateParam1 = dat1;
        script.stateParam2 = dat2;
        if(dat3 !== undefined && dat3 !== 0)
        script.stateParam3 = dat3;
        if(dat4 !== undefined)
        script.dat4 = dat4;
        this.node.addChild(stateNode);
    },

    /**
     * @主要功能 运行状态逻辑
     * @author C14
     * @Date 2017/12/10
     * @returns
     */
    removeStateByTarget:function(target){
        var stateNode = this.node.children.slice(0);
        for(var i = 0;i < stateNode.length; i++) {
            var script = stateNode[i].getComponent("State");
            if(script.target === target){
                script.endState();
                stateNode[i].removeFromParent(true);
            }
        }
    },
    removeStateByState:function(state){
        var stateNode = this.node.children.slice(0);
        for(var i = 0;i < stateNode.length; i++) {
            var script = stateNode[i].getComponent("State");
            if(script.state === state){
                script.endState();
                stateNode[i].removeFromParent(true);
            }
        }
    },
    // use this for initialization
    onLoad: function () {
        this.unitScript = this.node.parent.getComponent("Unit");
        //this.removeAllState();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
