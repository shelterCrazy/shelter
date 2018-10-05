// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
cc.Class({
    extends: cc.Component,

    properties: {

        //释放功能的节点们
        releaseFunc:[cc.Node],

        hero: [cc.Node],
        //基地层
        baseLayer: cc.Node,
        //生物层
        creatureLayer: cc.Node,
        //魔法层

        magicLayer: cc.Node
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:
    /**
     * @主要功能 释放生物的效果
     * @author C14
     * @Date 2018/1/16
     * @parameters
     * @returns
     */
    releaseFunction:function(dat,target){
        //如果是逻辑层的话
        if(this.selfObjectScript.logicNode === this.selfObject) {
            this.switchLayer("Logic");
        }else{
            this.switchLayer("View");
        }
        for (var i = 0; i < this.releaseFunc[dat].children.length; i++) {
            var script = this.releaseFunc[dat].children[i].getComponents(cc.Component);
            for (var j = 0; j < script.length; j++) {
                script[j].releaseFunction(target);
            }
        }
    },
    releaseFunctionWithTarget:function(target){
        //如果是逻辑层的话
        if(this.selfObjectScript.logicNode === this.selfObject) {
            this.switchLayer("Logic");
        }else{
            this.switchLayer("View");
        }

        var script = this.releaseWithTarget.getComponents(cc.Component);
        for (var i = 0; i < script.length; i++) {
            script[i].releaseFunctionWithTarget(target);
        }
    },
    onLoad:function()
    {
        this.selfObject = this.node.parent;
        this.selfObjectScript = this.selfObject.getComponent("Unit");
        if(this.selfObjectScript === null) {
            this.selfObjectScript = this.selfObject.getComponent("Magic");
        }

        this.switchLayer("Logic");
    },
    /**
     * @主要功能 切换当前产生效果的层
     * @author C14
     * @Date 2018/10/3
     * @parameters
     * @returns
     */
    switchLayer:function(value){
        switch(value){
            case "View":
                this.hero = this.selfObjectScript.GameManager.viewHero;
                //基地层
                this.baseLayer = this.selfObjectScript.GameManager.baseLayer;
                //生物层
                this.creatureLayer = this.selfObjectScript.GameManager.viewCreatureLayer;
                //魔法层
                this.magicLayer = this.selfObjectScript.GameManager.viewMagicLayer;
                break;
            case "Logic":
                this.hero = this.selfObjectScript.GameManager.heros;
                //基地层
                this.baseLayer = this.selfObjectScript.GameManager.baseLayer;
                //生物层
                this.creatureLayer = this.selfObjectScript.GameManager.creatureLayer;
                //魔法层
                this.magicLayer = this.selfObjectScript.GameManager.magicLayer;
                break;
        }
    }



    // update (dt) {},
});
