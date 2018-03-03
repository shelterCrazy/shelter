cc.Class({
    extends: cc.Component,

    properties: {
        follow:cc.Node,

        hero: cc.Node,
        camera:cc.Node,
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
        this.follow = this.hero;
    },
    update: function(){
        if(this.follow.x < cc.director.getWinSize().width / 2)
        {
            this.node.x = - cc.director.getWinSize().width / 2;
        }else if(this.follow.x > cc.director.getWinSize().width * 2.5){
            this.node.x = - cc.director.getWinSize().width * 2.5;
        }else{
            this.node.x = - this.follow.x;
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
