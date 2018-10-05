/**
 * @主要功能 用于预览英雄图片，文字的脚本
 * @author C14
 * @Date 2018/10/4
 * @parameters
 * @returns
 */
var Global = require("Global");
cc.Class({
    extends: cc.Component,

    properties: {
        //英雄的显示节点
        heroNode:{
            type:cc.Node,
            default:[]
        },

        heroLabelNode:{
            type:cc.Node,
            default:[]
        },
        //英雄选择的按钮节点
        heroSelectButtonNode:{
            type:cc.Node,
            default:[]
        },

        selectManager:cc.Node,
        _select:true,
    },

    onLoad :function(){
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },

    onKeyDown: function (event) {
        if(this._select) {
            switch (event.keyCode) {
                case cc.KEY.a:
                case cc.KEY.left:
                    if (Global.heroNum > 0) {
                        this.changeHeroSelect(null, Global.heroNum - 1);
                    }
                    break;
                case cc.KEY.d:
                case cc.KEY.right:
                    if (Global.heroNum < Global.maxHeroNum - 1) {
                        this.changeHeroSelect(null, Global.heroNum + 1);
                    }
                    break;
                case cc.KEY.z:
                case cc.KEY.enter:
                    if(Global.heroNum === -1){
                        this.node.getComponent("PlayEffect").playReleaseEffect();
                    }else{
                        this.node.getComponent("PlayEffect").playPressEffect();
                    }
                    this.selectManager.getComponent("SelectManager").changePosition(null,1);
                    break;
            }
        }
    },
    /**
     * @主要功能 关闭开启人物选择功能
     * @author C14
     * @Date 2018/10/5
     * @parameters enable
     * @returns
     */
    selectEnable:function(enable){
        this._select = enable;
    },
    /**
     * @主要功能 调整文字的可见性
     * @author C14
     * @Date 2018/10/5
     * @parameters enable
     * @returns
     */
    changeTextVisible:function(enable){
        if(enable){
            //for(var i in this.heroLabelNode){
            //    cc.log(i + " " + Global.heroNum);
            //    if(i == Global.heroNum){
            this.heroLabelNode[Global.heroNum].stopAllActions();
            this.heroLabelNode[Global.heroNum].runAction(cc.fadeIn(0.7).easing(cc.easeCubicActionOut()));
                //}else{
                //    this.heroLabelNode[i].opacity = 0;
                //}
            //}
        }else{
            //for(i in this.heroLabelNode){
                this.heroLabelNode[Global.heroNum].runAction(cc.fadeTo(0.7, 0).easing(cc.easeCubicActionOut()));
            //}
        }
    },
    /**
     * @主要功能 改变英雄的选择
     * @author C14
     * @Date 2018/10/5
     * @parameters
     * @returns
     */
    changeHeroSelect:function(event, customEventData) {
        var num = Number(customEventData);
        //是否能够调整选择
        if(this._select) {
            //如果英雄已经选择过了的话,并且两者不是同一个的话
            if (Global.heroNum !== -1 && Global.heroNum !== num) {
                this.heroLabelNode[Global.heroNum].stopAllActions();
                this.heroNode[Global.heroNum].opacity = 0;
                this.heroLabelNode[Global.heroNum].opacity = 0;
                this.heroSelectButtonNode[Global.heroNum].getComponent("BorderButton").unselected();
            }
            this.heroSelectButtonNode[num].getComponent("BorderButton").selected();
            this.heroSelectButtonNode[num].getComponent("PlayEffect").playPressEffect();
            if (Global.heroNum !== num) {
                //一套移动操作
                this.heroNode[num].x -= 80;
                this.heroLabelNode[num].x -= 10;
                this.heroLabelNode[num].y -= 40;
                this.heroNode[num].active = true;
                this.heroNode[num].opacity = 255;
                this.heroLabelNode[num].opacity = 255;
                this.heroNode[num].runAction(cc.moveBy(0.5, 80, 0).easing(cc.easeCubicActionOut()));
                this.heroLabelNode[num].runAction(cc.moveBy(0.5, 10, 40).easing(cc.easeCubicActionOut()));
            }
            Global.heroNum = num;
        }
    }
    // onLoad () {},

    // update (dt) {},
});
