/**
 * @��Ҫ���� ���ڴ��������״̬
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
    },
    /**
     * @��Ҫ���� ���һ��״̬���Ҵ����߼�
     * @author C14
     * @Date 2017/12/10
     * @param state,dat1,dat2
     * @returns
     */
    addState:function(state,dat1,dat2){
        this.state[state] = true;
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
     * @��Ҫ���� �Ƴ�һ��״̬
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
     * @��Ҫ���� �Ƴ�ȫ��״̬
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
     * @��Ҫ���� ÿ����λʱ������߼�������ʱȫ����һ��Ϊ0�ľͽ��״̬
     * @author C14
     * @Date 2017/12/10
     * @param void
     * @returns
     */
    adjustLogic:function(){
        for(var i = 0;i < this.state.length;i++){
            //״̬�Ĳ���1����������ʱ�Ĳ�����һ
            if(this.stateParam1[i] > 0){
                this.stateParam1[i] --;
            }
            //�������ʱ�����������ص�״̬
            if(this.stateParam1[i] === 0){
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
                    this.creatureScript.speed ++;
                }
                if(i === globalConstant.stateEnum.heal){

                }
                this.removeState(i);
            }
        }
    },
    /**
     * @��Ҫ���� ����״̬�߼�
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
        if(this.state[globalConstant.stateEnum.speedDown] === true){
            this.creatureScript.speed --;
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
        this.removeAllState();
        this.schedule(function() {
            var change = 0;
            cc.log(this.stateParam2[globalConstant.stateEnum.burn]);
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
