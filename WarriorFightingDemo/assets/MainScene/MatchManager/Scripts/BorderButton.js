/**
 * @主要功能 为按钮自身集成函数 包括选中与未选中
 * @author
 * @Date 2018/10/5
 * @parameters
 * @returns
 */
var Global = require("Global");
cc.Class({
    extends: cc.Component,

    properties: {
        //被选择的时候，会有金色边框，此边框的节点node
        selectedBorderNode:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    /**
     * @主要功能 实现被选中的时候的效果
     * @author
     * @Date 2018/10/5
     * @parameters
     * @returns
     */
    selected:function(){
        this.selectedBorderNode.stopAllActions();
        this.selectedBorderNode.runAction(cc.fadeIn(0.4).easing(cc.easeCubicActionOut()));
    },
    /**
     * @主要功能 实现失去选择的时候的效果
     * @author
     * @Date 2018/10/5
     * @parameters
     * @returns
     */
    unselected:function(){
        this.selectedBorderNode.stopAllActions();
        this.selectedBorderNode.runAction(cc.fadeOut(0.2).easing(cc.easeCubicActionOut()));
    }

    // update (dt) {},
});
