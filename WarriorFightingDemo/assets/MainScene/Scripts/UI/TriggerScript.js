cc.Class({
    extends: cc.Component,

    properties: {
        //�˽ڵ���ƵĽڵ�
        controlNode:cc.Node,
        //��Ч������
        effectNode:cc.Node,
        //���ֽڵ�
        tipNode:cc.Node,
        //�Ƿ�ʹ�ó���ת��
        changeSceneSwitch:false,
        //����
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
        this.fadeOut = cc.fadeOut(1.2).easing(cc.easeSineIn());
        //��ʼ���������ڣ���ײ������������
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
    onCollisionEnter: function (other) {
        var self = this;
        //����ҵĽӴ��ж�
        if (other.node.group === "Hero") {

            this.effectNode.stopAllActions();
            this.tipNode.stopAction(this.fadeIn);
            this.tipNode.stopAction(this.fadeOut);
            //Ч���ڵ����
            this.effectNode.runAction(cc.fadeIn(0.2).easing(cc.easeSineOut()));
            //Ч���ڵ����
            this.tipNode.runAction(this.fadeIn);

            cc.log("touch the Hero");
            this.inDoor = true;
        }
    },
    onCollisionExit: function (other) {
        var self = this;
        //����ҵĽӴ��ж�
        if (other.node.group === "Hero") {
            var fadeOut = cc.fadeOut(1.2).easing(cc.easeSineIn());
            this.effectNode.stopAllActions();
            this.tipNode.stopAction(this.fadeIn);
            this.tipNode.stopAction(this.fadeOut);
            //Ч���ڵ�䰵
            this.effectNode.runAction(cc.fadeOut(1.2).easing(cc.easeSineIn()));
            //��ʾ�ڵ�䰵
            this.tipNode.runAction(this.fadeOut);
            this.inDoor = false;
        }
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
