var globalConstant = require("Constant");
cc.Class({
    extends: cc.Component,

    properties: {
        //技能范围
        skillRange:0,
        //是否允许范围技能
        rangeSkillEnable:true,
        //范围指示器
        skillIndicatorL:cc.Node,
        skillIndicatorR:cc.Node,

        indicatorPrefab:cc.Prefab,
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
        if(this.rangeSkillEnable === false){
            this.node.active = false;
        }else{
            this.creatureScript = this.node.parent.getComponent("Creature");
            var box = this.node.getComponent(cc.BoxCollider);
            box.size.width = this.skillRange * globalConstant.unitLength;

            this.skillIndicatorL = cc.instantiate(this.indicatorPrefab);
            this.skillIndicatorR = cc.instantiate(this.indicatorPrefab);
            this.skillIndicatorL.x = - this.skillRange * globalConstant.unitLength / 2;
            this.skillIndicatorR.x = this.skillRange * globalConstant.unitLength / 2;
            this.node.addChild(this.skillIndicatorL);
            this.node.addChild(this.skillIndicatorR);
        }
    },
    onCollisionEnter: function (other, self) {
        var script = null;
        if(this.creatureScript.death === false) {
            //判断
            if (other.node.group === "Creature") {
                script = other.node.getComponent('Creature');
                if(script !== this.creatureScript){
                    this.creatureScript.CreatureSkill.releaseFunction(7,script);
                }
            }
            //判断
            if (other.node.group === "Hero") {
                script = other.node.getComponent('Player');
                this.creatureScript.CreatureSkill.releaseFunction(7,script);
            }

            //判断
            if (other.node.group === "Base") {
                //console.log("touch the Base");
                script = other.node.getComponent('Base');
                this.creatureScript.CreatureSkill.releaseFunction(7,script);
            }
        }
    },

    onCollisionExit: function (other, self) {
        var script = null;
        if (this.creatureScript.death === false) {
            //判断
            if (other.node.group === "Creature") {
                //cc.log("touch the Creature");
                script = other.node.getComponent('Creature');
                this.creatureScript.CreatureSkill.releaseFunction(8, script);
            }


            //判断
            if (other.node.group === "Hero") {
                script = other.node.getComponent('Player');
                this.creatureScript.CreatureSkill.releaseFunction(8, script);
            }

            //判断
            if (other.node.group === "Base") {
                //console.log("touch the Base");
                script = other.node.getComponent('Base');
                this.creatureScript.CreatureSkill.releaseFunction(8, script);
            }
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
