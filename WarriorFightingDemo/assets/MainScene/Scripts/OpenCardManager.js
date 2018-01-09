var Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {

        mainSceneManager:cc.Node,
        cardBagNumLabel:cc.Label,
        cardOutLayout:cc.Node
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
        this.mainSceneScript = this.mainSceneManager.getComponent("MainSceneManager");
        this.renewBags();
    },
    /**
     * @主要功能 打开一个卡包
     * @author C14
     * @Date 2017/12/21
     * @parameters
     * @returns
     */
    openBag:function(){
        var rand = 0;
        var card = null;
        var dat = 0;
        this.cardOutLayout.removeAllChildren();
        if(this.mainSceneScript.bags > 0){
            this.mainSceneScript.bags --;
            this.renewBags();
            for(var i = 0;i < 5;i++){
                rand = this.randomCard();
                if(rand < this.mainSceneScript.miniMagicPrefab.length){
                    this.mainSceneScript.myMCards[rand] ++;
                    card = cc.instantiate(this.mainSceneScript.miniMagicPrefab[rand]);
                    this.cardOutLayout.addChild(card);
                }else{

                    dat = rand - this.mainSceneScript.miniMagicPrefab.length;
                    cc.log(dat);
                    this.mainSceneScript.myCCards[dat] ++;
                    var card2 = cc.instantiate(this.mainSceneScript.miniCreaturePrefab[dat]);
                    this.cardOutLayout.addChild(card2);
                }
            }
        }
    },

    /**
     * @主要功能 创建一个随机数
     * @author C14
     * @Date 2017/12/21
     * @parameters
     * @returns
     */
    randomCard:function(){
        var num = 0;
        num =  Math.floor(Math.random() * (this.mainSceneScript.miniMagicPrefab.length
            + this.mainSceneScript.miniCreaturePrefab.length));
        return num;
    },
    /**
     * @主要功能 添加10包卡
     * @author C14
     * @Date 2017/12/21
     * @parameters
     * @returns
     */
    addBags:function(){
        this.mainSceneScript.bags += 10;
        this.renewBags();
    },
    renewBags:function(){
        this.cardBagNumLabel.string = 'bags:' + this.mainSceneScript.bags;
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
