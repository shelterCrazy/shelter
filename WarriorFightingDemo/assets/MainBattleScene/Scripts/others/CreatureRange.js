cc.Class({
    extends: cc.Component,

    properties: {
        unitNode:cc.Node,
        //攻击总范围，从左到右
        attackRange:0
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
        this.GameManager = this.unitScript.GameManager;
    },
    judgeCreature:function(){
        this.unitScript.friendlyTarget = [];
        this.unitScript.enemyTarget = [];
        if(this.unitScript.death === false)
        {
            //判断全部的节点
            for (var i in this.GameManager.creatureLayer.children) {
                var otherNode = this.GameManager.creatureLayer.children[i];
                //如果是自身的话，跳过
                if (otherNode === this.node.parent) {
                    continue;
                }
                //如果在范围以外的话，跳过
                if (Math.abs(otherNode.x - this.node.parent.x) > (otherNode.width + this.attackRange) / 2) {
                    continue;
                }
                if (otherNode.group === "Unit" && this.node.parent.group === "Unit") {
                    var script = otherNode.getComponent("Unit");
                    if (script.death === false) {
                        if (script.team === this.unitScript.team) {
                            this.unitScript.friendlyTarget.push(otherNode);
                        } else {
                            this.unitScript.enemyTarget.push(otherNode);
                        }
                    }
                }
            }
        }
    },


    onCollisionEnter: function (other, self) {
        var script = null;
        if(this.unitScript.death === false) {
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
