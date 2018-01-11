/**
 * @主要功能 游戏时间记，实现自动转圈释放法术等功能
 * @author C14
 * @Date 2017/12/3
 * @parameters
 * @returns
 */
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        //获取该节点下的进度条
        this.processBar = this.node.getComponent(cc.ProgressBar);
        //现在的时间点为0
        this.timer = 0;
        //转一圈的时间点为800
        this.maxTimer = 800;

        //进度条的进度为 this.timer/this.maxTimer
        this.processBar.progress = this.timer/this.maxTimer;

        //开启一个定时器，无限循环
        this.schedule(function() {
            //时间加一
            this.timer++;

            //现在的时间记录大于最大值，清零
            if(this.timer > this.maxTimer){
                this.timer = 0;
                //获取时间记的所有子节点（咏唱记录器）
                var allChild = this.node.getChildren();
                    for(var i = 0;i < allChild.length;i++){
                        //获取咏唱记录器的脚本
                        var chantScript = allChild[i].getComponent("Chant");
                        if(chantScript != null) {
                            //将其flag置为false，即，下一次可以触发了
                            chantScript.flag = false;
                        }
                    }
            }

            //获取时间记的所有子节点（咏唱记录器）
            var allChild1 = this.node.getChildren();
            for(var j = 0;j < allChild1.length;j++){
                //获取咏唱记录器的脚本
                var chantScript1 = allChild1[j].getComponent("Chant");
                if(chantScript1 != null) {
                    //如果达到了所占的百分比，而且已经是可触发的状态
                    if(chantScript1.percent <= this.timer/this.maxTimer && chantScript1.flag === false){
                        //现在不可触发了
                        chantScript1.flag = true;
                        //回合数减一
                        chantScript1.fnChangeRound(-1);
                    }
                }
            }
            //更新进度条的进度
            this.processBar.progress = this.timer/this.maxTimer;
        },0.01);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    //
    // },
});
