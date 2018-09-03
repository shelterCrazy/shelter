cc.Class({
    extends: cc.Component,

    properties: {
        progressBar: cc.Node,
        magicNum: cc.Label,
        mainGameManager: cc.Node
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
    start: function () {
        var mainGameManagerScript = this.mainGameManager.getComponent("MainGameManager");
        this.heroScript = mainGameManagerScript.heros[0].getComponent("UnitRouter").getLogicTypeScript();
    },
    // use this for initialization
    lateUpdate: function () {
        this.magicNum.string = (Math.floor(this.heroScript.mana)).toFixed(0) + '/' + this.heroScript.maxMana.toFixed(0);
        this.progressBar.scaleX = this.heroScript.mana / 10;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
