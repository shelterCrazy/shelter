/**
 * @主要功能 用于实现鼠标移动上去就显示或者使得特效显示或者消失
 * @author C14
 * @Date 2018/7/26
 */
cc.Class({
    extends: cc.Component,
    properties: {
        controlNode:cc.Node,
        inOpacity:255,
        outOpacity:0,
        time1:0,
        time2:0,
        onLoadFadeOut:false,
        onLoadFadeIn:false,
        onLoadFadeOutTime:0,
        onLoadFadeInTime:0,
    },
    onLoad:function(){
        //一进入就淡出的开关存在时
        if(this.onLoadFadeOut){
            //先使得透明度为255
            this.controlNode.opacity = 255;
            //逐渐的到淡出透明度
            this.controlNode.runAction(cc.fadeTo(this.time2, this.outOpacity).easing(cc.easeCubicActionIn()));
            //一进入就淡入的开关存在时
        }else if(this.onLoadFadeIn){
            //先使得透明度为0
            this.controlNode.opacity = 0;
            //逐渐的到淡入透明度
            this.controlNode.runAction(cc.fadeTo(this.time1, this.inOpacity).easing(cc.easeCubicActionOut()));
        }
    },

    /**
     * @主要功能 节点出现
     * @author
     * @Date 2018/10/25
     * @parameters customEventData
     * @returns
     */
    nodeIn:function(targetNum,customEventData){
        Number(customEventData);
        setTimeout(function(){
            this.controlNode.runAction(cc.fadeTo(this.time1, this.inOpacity).easing(cc.easeCubicActionOut()));
        }.bind(this),customEventData);
    },
    /**
     * @主要功能 节点消失
     * @author
     * @Date 2018/10/25
     * @parameters customEventData
     * @returns
     */
    nodeOut:function(targetNum,customEventData){
        Number(customEventData);
        setTimeout(function(){
            this.controlNode.runAction(cc.fadeTo(this.time2, this.outOpacity).easing(cc.easeCubicActionOut()));
        }.bind(this),customEventData);
    }
    // update (dt) {},
});
