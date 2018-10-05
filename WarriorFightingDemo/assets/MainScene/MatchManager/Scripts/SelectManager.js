/**
 * @主要功能 选择英雄和卡组的管理器
 * @author C14
 * @Date 2018/10/5
 * @parameters
 * @returns
 */
var Global = require("Global");
cc.Class({
    extends: cc.Component,

    properties: {
        //现在所处的位置
        nowLayer:{
            type:cc.Enum({
                HeroSelect:0,
                DeckSelect:1
            }),
            default:0
        },
        //英雄查看选择节点
        heroViewNode:cc.Node,

        deckViewNode:cc.Node,
    },

    onLoad :function(){
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },

    onKeyDown: function (event) {
        switch (event.keyCode) {
            case cc.KEY.escape:
                cc.log("escape");
                if(this.nowLayer === 0){
                    this.node.parent.active = false;
                    this.heroViewNode.getComponent("HeroSelectManager").selectEnable(false);
                }else if(this.nowLayer === 1){
                    this.changePosition(null, 0);
                }break
        }
    },

    changePosition:function(event, customEventData) {
        var num = Number(customEventData);
        //如果不是现在所在的位置
        if(num !== this.nowLayer){
            //只有选择了英雄，并且点击下一步才能够实现后面的选择
            if(Global.heroNum === - 1 && this.nowLayer === 0){
                this.node.getComponent("PlayEffect").playReleaseEffect();
                return;
            }
            this.node.getComponent("PlayEffect").playPressEffect();
            //使得英雄选择层的文字消失，此外无法点选，失去交互能力
            this.heroViewNode.getComponent("HeroSelectManager").selectEnable((num === 0));
            this.heroViewNode.getComponent("HeroSelectManager").changeTextVisible((num === 0));
            //移动到新的位置
            this.node.stopAllActions();
            this.node.runAction(cc.moveTo(0.6,- num * 950,0).easing(cc.easeCubicActionOut()));

            this.nowLayer = num;
        }else{
            this.node.getComponent("PlayEffect").playReleaseEffect();
        }

    }

    // update (dt) {},
});
