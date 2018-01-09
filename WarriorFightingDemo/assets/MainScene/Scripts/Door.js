cc.Class({
    extends: cc.Component,

    properties: {
        storeNode:cc.Node,
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
        this.inDoor = false;
        cc.director.getCollisionManager().enabled = true;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            //onKeyPressed: this.onKeyPressed.bind(this),
            onKeyReleased: this.onKeyReleased.bind(this),
        }, this.node);
    },

    onKeyReleased: function (keyCode, event) {
        if(this.inDoor === true) {
            switch (keyCode) {
                case cc.KEY.e:
                case cc.KEY.space:
                    this.inDoor = false;
                    this.storeNode.active = true;
                    break;
            }
        }
    },
    onCollisionEnter: function (other, self) {
        //µÿ√ÊΩ”¥•≈–∂œ
        if (other.node.group === "Hero") {
            console.log("touch the Hero");
            this.inDoor = true;
        }
    },
    onCollisionExit: function (other, self) {
        if (other.node.group === "Hero") {
            this.inDoor = false;
        }
    },
    battleScene: function(){
        cc.director.loadScene("game");
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
