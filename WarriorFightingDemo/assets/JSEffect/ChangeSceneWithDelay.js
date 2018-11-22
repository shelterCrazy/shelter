/**
 * @主要功能 用于实现按钮触发的延迟场景切换
 * @author C14
 * @Date 2018/7/26
 */
cc.Class({
    extends: cc.Component,
    properties: {
        sceneName:""
    },
    /**
     * @主要功能 延迟加载场景
     * @author C14
     * @Date 2018/10/25
     * @parameters customEventData（时间，单位毫秒）
     * @returns
     */
    changeScene:function(targetNum,customEventData){
        Number(customEventData);
        setTimeout(function(){
            cc.director.loadScene(this.sceneName);
        }.bind(this),customEventData);
    }
});
