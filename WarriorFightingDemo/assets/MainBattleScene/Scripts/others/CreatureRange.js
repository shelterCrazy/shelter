cc.Class({
    extends: cc.Component,

    properties: {
        unitNode:cc.Node,
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
        this.unitScript = this.node.parent.getComponent("Unit");
    },
    onCollisionEnter: function (other, self) {
        var script = null;
        if(this.unitScript.death === false) {
            //�ж�
            if (other.node.group === "Unit" || other.node.group === "ViewUnit") {
                //cc.log("touch the Creature");
                script = other.node.getComponent("Unit");
                if (script.death === false) {
                    if(script.team === this.unitScript.team){
                        this.unitScript.friendlyTarget.push(other.node);
                    }else{
                        this.unitScript.enemyTarget.push(other.node);
                    }
                }
            }


            //�ж�
            //if (other.node.group === "Hero") {
            //    script = other.node.getComponent('Hero');
            //
            //    if (script.team !== this.unitScript.team && script.death === false) {
            //        this.unitScript.target.push(other.node);
            //        this.unitScript.targetType.push(1);
            //        if (!this.unitScript.ATKActionFlag) {
            //            this.unitScript.ATKActionFlag = 1; //����
            //        }
            //    }
            //}

            //�ж�
            //if (other.node.group === "Base") {
            //    //console.log("touch the Base");
            //    script = other.node.getComponent('Base');
            //    if (script.team !== this.unitScript.team) {
            //        this.unitScript.target.push(other.node);
            //        this.unitScript.targetType.push(2);
            //        if (!this.unitScript.ATKActionFlag) {
            //            this.unitScript.ATKActionFlag = 1; //����
            //        }
            //    }
            //}
        }
    },

    onCollisionExit: function (other, self) {
        var i = 0;
        //�ж�
        if (other.node.group === "Unit" || other.node.group === "ViewUnit") {
            var script = other.node.getComponent("Unit");

            for(i = 0;i<this.unitScript.friendlyTarget.length;i++){
                if(other.node === this.unitScript.friendlyTarget[i]){
                    this.unitScript.friendlyTarget.splice(i,1);
                    //this.unitScript.targetType.splice(i,1);
                }
            }
            for(i = 0;i<this.unitScript.enemyTarget.length;i++){
                if(other.node === this.unitScript.enemyTarget[i]){
                    this.unitScript.enemyTarget.splice(i,1);
                }
            }
        }
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
