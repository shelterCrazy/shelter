/**
 * @主要功能 用于处理生物的状态
 * @author C4
 * @Date 2017/12/10
 */
var globalConstant = require("Constant");
cc.Class({
    extends: cc.Component,

    properties: {
        state:0,
        //类型
        stateParam1:0,
        //数值
        stateParam2:0,
        //间隔
        stateParam3:0,

        team:0,

        dat4:0,
        //效果的产生对象
        target:cc.Node
    },

    /**
     * @主要功能 运行状态逻辑
     * @author C14
     * @Date 2017/12/10
     * @returns
     */
    runState:function(){
        if(this.state === globalConstant.stateEnum.freeze){
            this.unitScript.attackFreeze = true;
            this.unitScript.moveFreeze = true;
        }
        if(this.state === globalConstant.stateEnum.confine){
            this.unitScript.moveFreeze = true;
        }
        if(this.state === globalConstant.stateEnum.burn){

        }
        if(this.state === globalConstant.stateEnum.weak){
            this.unitScript.weakness = true;
        }
        if(this.state === globalConstant.stateEnum.speedDown){
            this.unitScript.speed -= this.stateParam2;
        }
        if(this.state === globalConstant.stateEnum.speedDownTo){
            this.save = this.unitScript.speed;
            this.unitScript.speed = this.stateParam2;
        }
    },
    adjustLogic:function(){
        var flag = false;

        for(var i = 0;i < this.node.parent.children.length; i++) {
            var script = this.node.parent.children[i].getComponent("State");
            if(script.state === this.state && this.node.parent.children[i] !== this.node){
                flag = true;
            }
        }
        if(flag === false){
            if(this.state === globalConstant.stateEnum.freeze){
                this.unitScript.attackFreeze = false;
                this.unitScript.moveFreeze = false;
            }
            if(this.state === globalConstant.stateEnum.confine){
                this.unitScript.moveFreeze = false;
            }
            if(this.state === globalConstant.stateEnum.weak){
                this.unitScript.weakness = false;
            }
            if(this.state === globalConstant.stateEnum.speedDownTo){
                this.unitScript.speed = this.save;
            }
        }
        if(this.state === globalConstant.stateEnum.speedDown){
            this.unitScript.speed += this.stateParam2;
        }
    },
    endState:function(){
        this.adjustLogic();
    },
    // use this for initialization
    onLoad: function () {
        this.stateScript = this.node.parent.getComponent("StateManager");
        this.unitScript = this.stateScript.unitScript;

        var self = this,death = false;
        this.runState();

        var interval = 1;
        if(this.stateParam3 !== 0){
            interval = this.stateParam3;
        }

        this.schedule(function() {
            var change = 0;
            if(this.state === globalConstant.stateEnum.burn) {
                change += this.stateParam2;
            }else if(this.state === globalConstant.stateEnum.heal) {
                change += this.stateParam2;
            }else if(this.state === globalConstant.stateEnum.infect) {
                change += this.stateParam2;
            }
            death = this.unitScript.changeHealthBy(change);
            //如果死于感染，则再次释放感染法术
            if(this.state === globalConstant.stateEnum.infect && death === true) {
                var eventsend;
                eventsend = new cc.Event.EventCustom('magicCreate',true);
                eventsend.setUserData({
                    y:null,
                    position:this.unitScript.node.x,
                    //area:area,
                    team:this.dat4,
                    id:1
                });
                this.node.dispatchEvent(eventsend);
            }
            if (-- this.stateParam1 === 0) {
                self.adjustLogic();
                self.node.removeFromParent();
            }
        },interval);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
