cc.Class({
    extends: cc.Component,

    properties: {
        //此节点控制的节点
        controlNode:{
            type:cc.Node,
            default:null
        },
        //特效动画层
        effectNode:{
            type:cc.Node,
            default:null
        },
        //文字节点
        tipNode:cc.Node,
        //是否使用场景转换
        changeSceneSwitch:false,
        //场景
        sceneName:""
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        this.fadeIn = cc.fadeIn(0.2).easing(cc.easeSineIn());
        this.fadeIn.setTag(1);
        this.fadeOut = cc.fadeOut(1.2).easing(cc.easeSineIn());
        this.fadeOut.setTag(2);
        //初始化不在门内，碰撞允许，监听键盘
        this.inDoor = false;
        cc.director.getCollisionManager().enabled = true;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.onKeyPressed.bind(this),
            //onKeyReleased: this.onKeyReleased.bind(this),
        }, this.node);
    },

    onKeyPressed: function (keyCode, event) {
        if(this.inDoor === true) {
            switch (keyCode) {
                case cc.KEY.e:
                case cc.KEY.space:
                    if(this.changeSceneSwitch === true){
                        cc.director.loadScene(this.sceneName);
                    }else {
                        if (this.controlNode.active === false && this.controlNode.opacity <= 170) {
                            var script = this.controlNode.getComponents(cc.Component);
                            script[0].changeActive(true);
                        }
                    }
                    break;
                case cc.KEY.q:
                    if(this.changeSceneSwitch === true){
                        cc.director.loadScene(this.sceneName);
                    }else {
                        if (this.controlNode.active === true && this.controlNode.opacity >= 85) {
                            script = this.controlNode.getComponents(cc.Component);
                            script[0].changeActive(false);
                        }
                    }
                    break;
            }
        }
    },
    onCollisionEnter: function (other, self) {
        //于玩家的接触判断
        if (other.node.group === "Hero") {

            this.effectNode.stopAllActions();
            this.tipNode.stopActionByTag(1);
            this.tipNode.stopActionByTag(2);
            //效果节点变亮
            this.effectNode.runAction(cc.fadeIn(0.2).easing(cc.easeSineOut()));
            //效果节点变亮
            this.tipNode.runAction(this.fadeIn);
            this.inDoor = true;
        }
    },
    onCollisionExit: function (other, self) {
        //于玩家的接触判断
        if (other.node.group === "Hero") {

            this.effectNode.stopAllActions();
            this.tipNode.stopActionByTag(1);
            this.tipNode.stopActionByTag(2);
            //效果节点变暗
            this.effectNode.runAction(cc.fadeOut(1.2).easing(cc.easeSineIn()));
            //提示节点变暗
            this.tipNode.runAction(this.fadeOut);
            this.inDoor = false;

                if (this.controlNode !== null && this.controlNode.active === true
                    && this.controlNode.opacity >= 70) {
                    var script = this.controlNode.getComponents(cc.Component);
                    script[0].changeActive(false);
                }
        }
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
