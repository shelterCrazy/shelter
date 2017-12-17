cc.Class({
    extends: cc.Component,

    properties: {
        progressBar: cc.Node,
        magicNum: cc.Label,
        hero: cc.Node,
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
    update: function () {
        var script = this.hero.getComponent("Player");  
        this.magicNum.string = (Math.floor(script.mana)).toFixed(0) + '/' + script.maxMana.toFixed(0);
        // this.magicNum.node.x = 90*script.mana - 440;
        // this.progressBar.scaleX = 90*script.mana/744;
        this.progressBar.scaleX = script.mana / 10;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
