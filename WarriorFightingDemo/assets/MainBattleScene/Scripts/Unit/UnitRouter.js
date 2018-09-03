cc.Class({
    extends: cc.Component,

    properties: {
        //逻辑层节点
        logicNode:cc.Node,
        //显示层节点
        viewNode:cc.Node,

        GameManager:cc.Component
    },

    // LIFE-CYCLE CALLBACKS:

    setMapSign:function(mapSign){
        this.logicNode.getComponent("Unit")._mapSign = mapSign;
        //this.viewNode.getComponent("Unit")._mapSign = mapSign;
    },
    getLogicNode:function(){
        return this.logicNode;
    },
    getViewNode:function(){
        return this.viewNode;
    },
    getLogicTypeScript:function(){
        return this.logicNode.getComponent("Unit").typeComponent;
    },
    getLogicUnitScript:function(){
        return this.logicNode.getComponent("Unit");
    },
    getViewUnitNode:function(){
        return this.viewNode;
    },
    getTeam:function(){
        return this.logicNode.getComponent("Unit").team;
    },
    setFocusTarget:function(target){
        this.logicNode.getComponent("Unit").focusTarget = target;
        this.viewNode.getComponent("Unit").focusTarget = target;
    },

    updateByNet: function (fps) {
        this.logicNode.getComponent("Unit").updateByNet(fps);
    },
    updateView: function (fps) {
        this.viewNode.getComponent("Unit").updateByNet(fps);
    },

    moveAction:function(value){
        this.logicNode.getComponent("Unit").moveAction(value);
    },
    jumpAction:function(){
        this.logicNode.getComponent("Unit").jumpAction();
    },
    changeHealthBy: function(value,enemyTarget){
        return this.logicNode.getComponent("Unit").changeHealthBy(value,enemyTarget);
    },
    changeHealthTo: function(value,enemyTarget){
        this.logicNode.getComponent("Unit").changeHealthTo(value,enemyTarget);
    },
    changeAttackBy: function(value){
        this.logicNode.getComponent("Unit").changeAttackBy(value);
    },
    changeAttackTo: function(value){
        this.logicNode.getComponent("Unit").changeAttackTo(value);
    },
    changeSpeedBy: function(value){
        this.logicNode.getComponent("Unit").changeSpeedBy(value);
    },
    changeSpeedTo: function(value){
        this.logicNode.getComponent("Unit").changeSpeedTo(value);
    },
    initUnit: function(data){
        this.logicNode.getComponent("Unit").initUnit(data);
        this.viewNode.getComponent("Unit").initUnit(data);
    },
    fnGetManager: function(Manager){
        this.GameManager = Manager;
        this.logicNode.getComponent("Unit").fnGetManager(Manager);
        this.viewNode.getComponent("Unit").fnGetManager(Manager);
    }
    // update (dt) {},
});
