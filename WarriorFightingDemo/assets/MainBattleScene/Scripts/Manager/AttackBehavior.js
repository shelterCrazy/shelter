/**
 * @主要功能:   攻击行为
 * @author kenan
 * @Date 2017/7/23 2:41
 * @type {Function}
 */
var attackBehavior = cc.Class({
    extends: cc.Component,

    properties: {
        atk:0, //物理
		matk:1,  //魔法
        //伤害产生列表
        _attackList:[]
    },

    /** 攻击行为 1v1 单体
     * @param attackNode  攻击节点
     * @param node  被攻击节点
     * @param fn  返回函数
     */
    attack: function (attackNode, node, fn){

        //目标被销毁  或者为null  不执行
        if(node == null || !node.isValid){
            return ;
        }

        //申请脚本
        var script = null,attackScript = null;

        script = node.getComponent('Unit');
        //获取发起攻击者的脚本
    	attackScript = attackNode.getComponent('Unit');

        this._attackList.push({"attackedScript":script,"attackScript":attackScript,"fn":fn});

    	//1伤害计算
      	// var hitValue = hitTransform(attackScript.attack, attcNode.atkType, node.defValue);     //atk攻击力   攻击类型   node该类型防御值
        //if(script.bodyNode !== null)
        //    script.bodyNode.runAction(cc.sequence(cc.tintTo(0.1,255,0,0),cc.tintTo(0.06,255,255,255)));
        //return script.changeHealthBy(- attackScript.attack,this.node.parent);

        //2伤害反馈给node   kenan  如果被攻击对象已死亡 清空攻击对象的目标
        //var deadFlag =


        //if(deadFlag != null && deadFlag == 1){
        //    script.releaseTarget();
        //}
    },
    /**
     * @主要功能 效果计算，根据_attacklist计算伤害
     * @author C14
     * @Date 2018/8/30
     * @parameters
     * @returns
     */
    attackCalculation:function(){
        for(var i in this._attackList){
            //if(this._attackList[i].attackedScript.bodyNode !== null) {
            //    this._attackList[i].attackedScript.bodyNode.runAction(
            //        cc.sequence(
            //            cc.tintTo(0.1, 255, 0, 0),
            //            cc.tintTo(0.06, 255, 255, 255)
            //        )
            //    );
            //}
            this._attackList[i].fn(this._attackList[i].attackedScript.changeHealthBy(
                - this._attackList[i].attackScript.attack,
                this._attackList[i].attackScript.node
            ));
        }
        //计算完成后清空队列
        this._attackList = [];
    }
});
