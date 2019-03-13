var globalConstant = require("Constant");

cc.Class({
    extends: cc.Component,

    properties: {

        rarity:{
            type: cc.Enum({
                N: 0,
                R: 1,
                SR: 2,
                SSR: 3
            }),
            default: 0
        },
        race:{
            type: cc.Enum({
                none: 0,
                human: 1,
                dragon: 2,
                sprite: 3
            }),
            default: 0
        }
    },
    onLoad: function(){
        var i;
        this.unitScript = this.node.getComponent("Unit");
    },

    /**
     * @主要功能 刷新生物单位
     * @author C14
     * @Date 2018/8/23
     * @parameters fps：此刷新的帧率
     * @returns
     */
    refresh:function(fps){
        //获得当前帧率下应当推进的速率
        var frameSpeed = globalConstant.frameRate / fps;

        if (this.unitScript.ATKActionFlag === false) {
            for(var i = 0;i < this.unitScript.enemyTarget.length; i++){
                var script = this.unitScript.enemyTarget[i].getComponent("Unit");
                if(script.death === false){
                    this.unitScript.ATKActionFlag = true;
                    break;
                }
            }
        }
        if(this.unitScript.enemyTarget.length == 0)
        {
            this.unitScript.ATKActionFlag = false;
        }
        /**
         * @主要功能 按照队伍调整移动
         */
        //if (this.unitScript.team > 0) {
        //    this.unitScript.moveAction(- this.unitScript.speed);
        //} else {
        //    this.unitScript.moveAction(this.unitScript.speed);
        //}
        /**
         * @主要功能 按照移动目标
         */
        //自身移动判定  存在目标+非攻击+可以移动标记+自己没死
        if(this.unitScript.ATKActionFlag === false){
            if (this.unitScript.node.x > this.unitScript.focusTarget.x) {
                this.unitScript.moveAction(- this.unitScript.speed * frameSpeed,fps);
            } else {
                this.unitScript.moveAction(this.unitScript.speed * frameSpeed,fps);
            }
        }


        if(this.unitScript.death === false) {
            //if (this.unitScript.enemyTarget.length === 0) {
            //    //cc.log("this.unitScript.enemyTarget.length === 0");
            //    this.unitScript.ATKActionFlag = false;
            //    return;
            //} else {
            //    this.unitScript.ATKActionFlag = true;
            //}
            if(this.unitScript.ATKActionFlag === false)
            {
                return;
            }

            if (this.unitScript.coolTimer === this.unitScript.coolTime &&
                this.unitScript.attackFreeze === false && this.unitScript.enemyTarget.length !== 0)
            {
                //目标为空 或者被销毁  不执行
                script = this.unitScript.enemyTarget[0].getComponent("Unit");
                //cc.log(this.enemyTarget.length);
                while(script.death === true)
                {
                    this.unitScript.enemyTarget.splice(0,1);
                    if (this.unitScript.enemyTarget.length === 0)
                    {
                        this.unitScript.ATKActionFlag = false;
                        this.unitScript.bodyNode.scaleX = - this.unitScript.team;
                        return;
                    }
                    script = this.unitScript.enemyTarget[0].getComponent("Unit");
                }
                if(this.unitScript.enemyTarget[0].x < this.unitScript.node.x){
                    this.unitScript.bodyNode.scaleX = - 1;
                }else{
                    this.unitScript.bodyNode.scaleX = 1;
                }
                this.unitScript.attackAction();
            }
        }


    }
});
