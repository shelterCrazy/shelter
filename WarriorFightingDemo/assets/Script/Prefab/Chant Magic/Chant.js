cc.Class({
    extends: cc.Component,

    properties: {
        //剩余的回合数标签
        roundLabel:cc.Label,
        //剩余的回合数
        round:0,
        //吟唱魔法的名字
        chantName:cc.Label,
        //法术的序号
        id:0,
        //该法术的百分比
        percent:0,
        //队伍
        team:0,
        //范围
        area:0,
        //角度
        angel:0,
        //速度
        speed:0,

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
    fnInitChant:function(detail){
        this.chantName.string = detail.name;
        this.round = detail.round;
        this.roundLabel.string = this.round;
        this.team = detail.team;
        //这里的position y是指发动后的魔法应该的位置
        this.position = detail.position != null ? detail.position : 0;
        this.y = detail.y !== null ? detail.y : null;
        this.angel = detail.angel != null ? detail.angel : 0;
        this.speed = detail.speed != null ? detail.speed : 0;

        this.id = detail.id;
        this.area = detail.area != null ? detail.area : 0;

        this.node.x = Math.cos(- this.percent*2*Math.PI)*this.r;
        this.node.y = Math.sin(- this.percent*2*Math.PI)*this.r;

        if(this.node.x > 0) {
            this.chantName.anchor = 0;
            this.chantName.node.x = 320;
        }else{
            this.chantName.anchor = 1;
            this.chantName.node.x = - 320;
        }
    },
    fnChangeRound:function(num){
        this.round += num;
        this.roundLabel.string = this.round;
        if(this.round <= 0){
            var eventsend = new cc.Event.EventCustom('magicCreate',true);
            eventsend.setUserData({
                team:this.team,
                id:this.id,
                position:this.position,
                y:this.y,
                area:this.area,
                angel:this.angel,
                speed:this.speed,
            });
            this.node.dispatchEvent(eventsend);

            this.node.removeFromParent();
        }else{
            var eventsend = new cc.Event.EventCustom('magicCreate',true);
            eventsend.setUserData({
                team:this.team,
                id:this.id,
                position:this.position,
                y:this.y,
                area:this.area,
                angel:this.angel,
                speed:this.speed,
            });
            this.node.dispatchEvent(eventsend);
        }
    },
    // use this for initialization
    onLoad: function () {
        this.position = 0;
        this.y = 0;
        this.r = 90;
        this.flag = true;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
