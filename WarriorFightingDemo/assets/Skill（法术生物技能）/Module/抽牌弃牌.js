
cc.Class({
    extends: cc.Component,

    properties: {
        //目标单位
        target:{
            type:cc.Enum({
                //英雄
                hero:0,
                //我方英雄
                selfHero:1,
                //敌方英雄
                enemyHero:2,
            }),
            default:0
        },
        //抽牌
        draw:0,
        //弃牌
        throw:0,

    },

    // LIFE-CYCLE CALLBACKS:

    //onLoad: function(){
    //},
//抽牌弃牌以及添加到手牌有重要的BUG，只能更加注意，只对己方英雄有好的效果
    releaseFunction:function(target){
        //获取技能的脚本
        var script = this.node.parent.parent.getComponent("Skill");
        var creatureScript = null,heroScript = null;
        //获取creature的脚本
        var selfObjectScript = script.selfObjectScript;
        var i = 0;
        var enumDat = cc.Enum({
                //英雄
                hero:10,
                //我方英雄
                selfHero:1,
                //敌方英雄
                enemyHero:12,
            });


        switch (this.target){
            case enumDat.hero:
                for(i = 0;i < script.hero.length;i++) {
                    heroScript = script.hero[i].getComponent("Hero");
                    heroScript.drawCard(this.draw);
                    heroScript.throwCard(this.throw);
                }
                break;
            case enumDat.selfHero:
                for(i = 0;i < script.hero.length;i++) {
                    heroScript = script.hero[i].getComponent("Hero");
                    if(heroScript.team * selfObjectScript.team > 0) {
                        heroScript.drawCard(this.draw);
                        heroScript.throwCard(this.throw);
                    }
                }
                break;
            case enumDat.enemyHero:
                for(i = 0;i < script.hero.length;i++) {
                    heroScript = script.hero[i].getComponent("Hero");
                    if(heroScript.team * selfObjectScript.team < 0) {
                        heroScript.drawCard(this.draw);
                        heroScript.throwCard(this.throw);
                    }
                }
                break;
        }


    }
    // update (dt) {},
});
