
var globalConstant = require("Constant");
cc.Class({
    extends: cc.Component,

    properties: {
        //召唤位置,只确定X坐标
        position:{
            type:cc.Enum({
                //场景中间
                mid:0,
                //初始位置
                origin:1,
                //当前生物的位置
                now:2,
                //当前英雄的位置
                selfHero:3,
                //随机位置
                random:4
            }),
            default:0
        },
        ////法术类型
        //magicType: {
        //    type: cc.Enum({
        //        NoTarget: 0,
        //        AreaTarget: 1,
        //        DirectionTarget: 2
        //    }),
        //    default: 0
        //},

        //召唤法术的ID
        id:0,
        //在召唤位置上偏移，偏移的像素为(可正可负),（我方，敌方坐标是对称的，以我方基地为后方，以敌方基地为前方）
        offset:0,
        //需要召唤生物的召唤预制
        //如果使用这种方式，则会忽略之前的召唤ID方法
        //如果召唤衍生物推荐使用这种方法
        magicPrefab:cc.Prefab,
        //如果是随机的，那么给一个范围
        areaA:0,
        areaB:0,

        //角度，角度对称
        angel:0,
        y:0,
        area:0,
        //法术释放的延迟
        delay:0,

        network:false
    },

    // LIFE-CYCLE CALLBACKS:

    //onLoad: function(){
    //},

    releaseFunction:function(){
        var script = this.node.parent.parent.getComponent("Skill");
        var creatureScript = null;
        var selfObjectScript = script.selfObjectScript;
        var i = 0,x;
        var self = this;
        var enumDat = cc.Enum({
            //场景中间
            mid:0,
            //初始位置
            origin:1,
            //当前生物的位置
            now:2,
            //当前英雄的位置
            selfHero:3,
            //随机位置
            random:4
        });

        //setTimeout(function(){
            switch (self.position){
                case enumDat.mid:
                    x = cc.director.getWinSize().width * globalConstant.sceneWidth / 2;
                    self.summonMagic(x,selfObjectScript.team);
                    break;
                case enumDat.origin:
                    x = cc.director.getWinSize().width * globalConstant.sceneWidth / 2 *
                        (1 + selfObjectScript.team/Math.abs(selfObjectScript.team));
                    self.summonMagic(x,selfObjectScript.team);
                    break;
                case enumDat.now:
                    x = selfObjectScript.node.x;
                    self.summonMagic(x,selfObjectScript.team);
                    break;
                case enumDat.selfHero:
                    x = script.hero[0].x;
                    self.summonMagic(x,selfObjectScript.team);
                    break;
                case enumDat.random:
                    x = (Math.seededRandom(0,1) * (self.areaB - self.areaA) + self.areaA) *
                        (- selfObjectScript.team/Math.abs(selfObjectScript.team)) +
                        cc.director.getWinSize().width * globalConstant.sceneWidth / 2 *
                        (1 + selfObjectScript.team/Math.abs(selfObjectScript.team));

                    self.summonMagic(x,selfObjectScript.team);
                    break;
            }
        //},this.delay);
    },
    summonMagic:function(x,team){
        var eventsend;
        eventsend = new cc.Event.EventCustom('magicCreate',true);
        cc.log("send a magic init");
        eventsend.setUserData({
            position: x - this.offset * team / Math.abs(team),
            y: this.y,
            angel: 90 * (1 + team/Math.abs(team)) -
                    this.angel * team / Math.abs(team),
            area: this.area,
            team: team,
            network:this.network,
            prefab:this.magicPrefab,
            id: this.id
        });
        this.node.dispatchEvent(eventsend);
    }
    // update (dt) {},
});
