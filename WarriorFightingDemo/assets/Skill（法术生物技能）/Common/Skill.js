// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

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
        var script = this.releaseFunc[dat].getComponents(cc.Component);
        for(var i = 0;i < script.length; i++)
        {
            script[i].releaseFunction(target);
        }
    },
    releaseFunctionWithTarget:function(target){
        var script = this.releaseWithTarget.getComponents(cc.Component);
        for(var i = 0;i < script.length; i++)
        {
            script[i].releaseFunctionWithTarget(target);
        }
    },
    onLoad:function()
    {
        this.selfCreature = this.node.parent;
        this.selfCreatureScript = this.selfCreature.getComponent("Creature");
        if(this.selfCreatureScript === null) {
            this.selfCreatureScript = this.selfCreature.getComponent("AreaMagic");
            if(this.selfCreatureScript === null)
                this.selfCreatureScript = this.selfCreature.getComponent("DirectionMagic");
        }

        this.hero = this.selfCreatureScript.GameManager.heros;
        //基地层
        this.baseLayer = this.selfCreatureScript.GameManager.baseLayer,
        //生物层
        this.creatureLayer = this.selfCreatureScript.GameManager.creatureLayer;
        //魔法层
        this.magicLayer = this.selfCreatureScript.GameManager.magicLayer;
    },



    // update (dt) {},
});
