cc.Class({
    extends: cc.Component,

    properties: {
        rotateNode:{
            type:[cc.Node],
            default:[]
        },
        defaultRotation:{
            type:cc.Integer,
            default:[]
        },
        //旋转方向
        position:{
            type:cc.Integer,
            default:[]
        },
        //耗时
        time:{
            type:cc.Integer,
            default:[]
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad:function(){
        this.rotationLock = false;
        this.node.on(cc.Node.EventType.MOUSE_ENTER,function(){
            for(var i in this.rotateNode) {
                this.rotateNode[i].stopAllActions();
                this.rotateNode[i].runAction(
                    cc.repeatForever(
                        cc.sequence(
                            cc.rotateBy(this.time[i], 360 * this.position[i]),
                            cc.rotateBy(0, - 360 * this.position[i])
                        )
                    )
                )
            }
        }.bind(this), this);

        this.node.on(cc.Node.EventType.MOUSE_LEAVE,function(){
            if(this.rotationLock === false) {
                for (var i in this.rotateNode) {
                    this.rotateNode[i].stopAllActions();
                    var min = Math.abs(this.rotateNode[i].rotation - this.defaultRotation[i]);
                    var m = 0;
                    for (var j = 1; j < 5; j++) {
                        var now = Math.abs(this.rotateNode[i].rotation - this.defaultRotation[i] - j * 90);
                        if (min > now) {
                            m = j;
                            min = now;
                        }
                    }
                    this.rotateNode[i].runAction(
                        cc.rotateTo(0.7, this.defaultRotation[i] + m * 90).easing(cc.easeCubicActionOut())
                    )
                }
            }
        }.bind(this), this);

        this.node.on(cc.Node.EventType.MOUSE_DOWN,function(){
            this.rotationLock = true;
        }.bind(this), this);

    },

    rotationStop:function(){
        for (var i in this.rotateNode) {
            this.rotateNode[i].stopAllActions();
            var min = Math.abs(this.rotateNode[i].rotation - this.defaultRotation[i]);
            var m = 0;
            for(var j = 1;j < 5;j ++){
                var now = Math.abs(this.rotateNode[i].rotation - this.defaultRotation[i] - j * 90);
                if(min > now){
                    m = j;
                    min = now;
                }
            }
            this.rotateNode[i].runAction(
                cc.rotateTo(0.7, this.defaultRotation[i] + m * 90).easing(cc.easeCubicActionOut())
            )
        }
    },

    unlockRotation:function(){
        this.rotationLock = false;
        this.rotationStop();
    }


    // update (dt) {},
});
