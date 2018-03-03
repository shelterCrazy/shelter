cc.Class({
    extends: cc.Component,

    properties: {
        creatureNode:cc.Node,
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
        this.creatureScript = this.creatureNode.getComponent("Creature");
    },
    onCollisionEnter: function (other, self) {
        var script = null;
        if(this.creatureScript.death === false) {
            //ÅÐ¶Ï
            if (other.node.group === "Creature") {
                //cc.log("touch the Creature");
                script = other.node.getComponent('Creature');
                if (script.team !== this.creatureScript.team && script.death === false) {
                    this.creatureScript.target.push(other.node);
                    this.creatureScript.targetType.push(0);
                    if (!this.creatureScript.ATKActionFlag) {
                        this.creatureScript.ATKActionFlag = 1; //ÉÏËø
                    }
                }
            }


            //ÅÐ¶Ï
            if (other.node.group === "Hero") {
                script = other.node.getComponent('Player');

                if (script.team !== this.creatureScript.team && script.death === false) {
                    this.creatureScript.target.push(other.node);
                    this.creatureScript.targetType.push(1);
                    if (!this.creatureScript.ATKActionFlag) {
                        this.creatureScript.ATKActionFlag = 1; //ÉÏËø
                    }
                }
            }

            //ÅÐ¶Ï
            if (other.node.group === "Base") {
                //console.log("touch the Base");
                script = other.node.getComponent('Base');
                if (script.team !== this.creatureScript.team) {
                    this.creatureScript.target.push(other.node);
                    this.creatureScript.targetType.push(2);
                    if (!this.creatureScript.ATKActionFlag) {
                        this.creatureScript.ATKActionFlag = 1; //ÉÏËø
                    }
                }
            }
        }
    },

    onCollisionExit: function (other, self) {
        var i = 0;
        //ÅÐ¶Ï
        if (other.node.group === "Creature" || other.node.group === "Hero" || other.node.group === "Base") {
            for(i;i<this.creatureScript.target.length;i++){
                if(other.node === this.creatureScript.target[i]){
                    this.creatureScript.target.splice(i,1);
                    this.creatureScript.targetType.splice(i,1);
                }
            }
        }
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
