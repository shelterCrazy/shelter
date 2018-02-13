/**
 * @主要功能 用于处理生物的状态
 * @author C4
 * @Date 2017/12/10
 */
var globalConstant = require("Constant");
cc.Class({
    extends: cc.Component,

    properties: {
        state:{
            type:[cc.Boolean],
            default:[],
        },
        stateParam1:{
            type:[cc.Integer],
            default:[],
        },
        stateParam2:{
            type:[cc.Integer],
            default:[],
        },
        velocity:0,
    },
    /**
     * @主要功能 添加一个状态并且处理逻辑
     * @author C14
     * @Date 2017/12/10
     * @param state,dat1,dat2
     * @returns
     */
    addState:function(state,dat1,dat2){
        if(this.state[globalConstant.stateEnum.speedDown] === false &&
            state === globalConstant.stateEnum.speedDown ){
            if(this.creatureScript.summon === false || this.creatureScript.summon === undefined) {
                if (this.creatureScript.velocity === undefined) {// && this.creatureScript.summon === false
                    this.velocity = this.creatureScript.maxMoveSpeed;
                    if (dat2 === -1) {
                        if (this.creatureScript.maxMoveSpeed - 1 >= 0) {
                            this.creatureScript.maxMoveSpeed -= 1;
                        }
                    } else {
                        this.creatureScript.maxMoveSpeed = dat2;
                    }
                } else {
                    this.velocity = this.creatureScript.velocity;
                    if (dat2 === -1) {
                        if (this.creatureScript.velocity - 1 >= 0) {
                            this.creatureScript.velocity -= 1;
                        }
                    } else {
                        this.creatureScript.velocity = dat2;
                    }
                }
            }else{
                this.velocity = this.creatureScript.saveVelocity;
                if (dat2 === -1) {
                    if (this.creatureScript.saveVelocity - 1 >= 0) {
                        this.creatureScript.saveVelocity -= 1;
                    }
                } else {
                    this.creatureScript.saveVelocity = dat2;
                }
            }
            this.state[globalConstant.stateEnum.speedDown] = true;
        }


        if(state !== globalConstant.stateEnum.speedDown) {
            this.state[state] = true;
        }
        this.stateParam1[state] = dat1 === null ? 0 : dat1;
        if(state === globalConstant.stateEnum.burn) {
            this.stateParam2[state] += dat2 === null ? 0 : dat2;
        }else{
            this.stateParam2[state] = dat2 === null ? 0 : dat2;
        }

        if(state === globalConstant.stateEnum.freeze){
            this.removeState(globalConstant.stateEnum.burn);
        }
        if(state === globalConstant.stateEnum.burn){
            this.removeState(globalConstant.stateEnum.freeze);
        }
        this.runState();
    },
    /**
     * @主要功能 清除一个状态并且处理逻辑
     * @author C14
     * @Date 2017/1/20
     * @param state
     * @returns
     */
    cleanState:function(state){
        if(this.state[state] === true) {
            if (state === globalConstant.stateEnum.freeze) {
                this.creatureScript.attackFreeze = false;
                this.creatureScript.moveFreeze = false;
            }
            if (state === globalConstant.stateEnum.confine) {
                this.creatureScript.moveFreeze = false;
            }
            if (state === globalConstant.stateEnum.burn) {

            }
            if (state === globalConstant.stateEnum.weak) {
                this.creatureScript.weekness = false;
            }
            if (state === globalConstant.stateEnum.speedDown) {
                if(this.creatureScript.velocity === undefined){
                    this.creatureScript.maxMoveSpeed = this.velocity;
                }else{
                    this.creatureScript.velocity = this.velocity;
                }
            }
            if (state === globalConstant.stateEnum.heal) {

            }
            this.removeState(state);
        }
    },
    /**
     * @主要功能 移除一个状态
     * @author C14
     * @Date 2017/12/10
     * @param state
     * @returns
     */
    removeState:function(state){
        this.state[state] = false;
        this.stateParam1[state] = 0;
        this.stateParam2[state] = 0;
    },
    /**
     * @主要功能 移除全部状态
     * @author C14
     * @Date 2017/12/10
     * @param void
     * @returns
     */
    removeAllState:function(){
        for(var i = 0;i < this.state.length;i++){
            this.state[i] = false;
            this.stateParam1[i] = 0;
            this.stateParam2[i] = 0;
        }
    },
    /**
     * @主要功能 每个单位时间调整逻辑，倒计时全部减一，为0的就解除状态
     * @author C14
     * @Date 2017/12/10
     * @param void
     * @returns
     */
    adjustLogic:function(){
        for(var i = 0;i < this.state.length;i++){
            //状态的参数1，用来倒计时的参数减一
            if(this.stateParam1[i] > 0){
                this.stateParam1[i] --;
            }
            //如果倒计时结束，解除相关的状态
            if(this.stateParam1[i] === 0 && this.state[i] === true){
                if(i === globalConstant.stateEnum.freeze){
                    this.creatureScript.attackFreeze = false;
                    this.creatureScript.moveFreeze = false;
                }
                if(i === globalConstant.stateEnum.confine){
                    this.creatureScript.moveFreeze = false;
                }
                if(i === globalConstant.stateEnum.burn){

                }
                if(i === globalConstant.stateEnum.weak){
                    this.creatureScript.weekness = false;
                }
                if(i === globalConstant.stateEnum.speedDown){
                    if(this.creatureScript.velocity === undefined){
                        this.creatureScript.maxMoveSpeed ++;
                    }else{
                        this.creatureScript.velocity ++;
                    }
                }
                if(i === globalConstant.stateEnum.heal){

                }
                this.removeState(i);
            }
        }
    },
    /**
     * @主要功能 运行状态逻辑
     * @author C14
     * @Date 2017/12/10
     * @param
     * @returns
     */
    runState:function(){
        if(this.state[globalConstant.stateEnum.freeze] === true){
            this.creatureScript.attackFreeze = true;
            this.creatureScript.moveFreeze = true;
        }
        if(this.state[globalConstant.stateEnum.confine] === true){
            this.creatureScript.moveFreeze = true;
        }
        if(this.state[globalConstant.stateEnum.burn] === true){

        }
        if(this.state[globalConstant.stateEnum.weak] === true){
            this.creatureScript.weakness = true;
        }
        if(this.state[globalConstant.stateEnum.healthAreAtk] === true){
            var k = this.creatureScript.health;
            this.creatureScript.health = this.creatureScript.attack;
            this.creatureScript.attack = k;
        }
    },
    // use this for initialization
    onLoad: function () {
        this.creatureScript = this.node.parent.getComponent("Creature");
        if(this.creatureScript === null){
            this.creatureScript = this.node.parent.getComponent("Player");
        }
        this.removeAllState();
        this.schedule(function() {
            var change = 0;
            if(this.state[globalConstant.stateEnum.burn] === true) {
                change += -this.stateParam2[globalConstant.stateEnum.burn];
                if (-- this.stateParam2[globalConstant.stateEnum.burn] === 0) {
                    this.removeState(this.stateParam2[globalConstant.stateEnum.burn])
                }
            }
            if(this.state[globalConstant.stateEnum.heal] === true) {
                change += this.stateParam2[globalConstant.stateEnum.heal];
            }
            if(this.state[globalConstant.stateEnum.healthAreAtk] === true){
                var k = this.creatureScript.health;
                this.creatureScript.health = this.creatureScript.attack;
                this.creatureScript.attack = k;
            }
            this.creatureScript.changeHealth(change);
            this.adjustLogic();
        },globalConstant.unitTime);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
