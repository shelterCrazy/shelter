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
        //牌本身的预制
        card:cc.Prefab,
        //或者用牌的序号与类型
        cardType:0,
        cardId:0,
        //添加的张数
        num:1,
    },

    // LIFE-CYCLE CALLBACKS:

    //onLoad: function(){
    //},
//抽牌弃牌以及添加到手牌有重要的BUG，只能更加注意，只对己方英雄有好的效果
    releaseFunction:function(){
        //获取技能的脚本
        var script = this.node.parent.getComponent("Skill");
        var creatureScript = null,heroScript = null;
        //获取creature的脚本
        var selfCreatureScript = script.selfCreatureScript;
        var i = 0,j = 0;
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
                    heroScript = script.hero[i].getComponent("Player");
                    if(this.card === null||this.card === undefined){
                        for(j = 0;j < this.num;j++)
                        heroScript.getCertainCard(this.cardType.this.cardId);
                    }else{
                        for(j = 0;j < this.num;j++)
                        heroScript.getCertainCard(0,0,this.card);
                    }
                }
                break;
            case enumDat.selfHero:
                for(i = 0;i < script.hero.length;i++) {
                    heroScript = script.hero[i].getComponent("Player");
                    if(heroScript.team * selfCreatureScript.team > 0) {
                        if(this.card === null||this.card === undefined){
                            for(j = 0;j < this.num;j++)
                            heroScript.getCertainCard(this.cardType.this.cardId);
                        }else{
                            for(j = 0;j < this.num;j++)
                            heroScript.getCertainCard(0,0,this.card);
                        }
                    }
                }
                break;
            case enumDat.enemyHero:
                for(i = 0;i < script.hero.length;i++) {
                    heroScript = script.hero[i].getComponent("Player");
                    if(heroScript.team * selfCreatureScript.team < 0) {
                        if(this.card === null||this.card === undefined){
                            for(j = 0;j < this.num;j++)
                            heroScript.getCertainCard(this.cardType.this.cardId);
                        }else{
                            for(j = 0;j < this.num;j++)
                            heroScript.getCertainCard(0,0,this.card);
                        }
                    }
                }
                break;
        }


    }
    // update (dt) {},
});
