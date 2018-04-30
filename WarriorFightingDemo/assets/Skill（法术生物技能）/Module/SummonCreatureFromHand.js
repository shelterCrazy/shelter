
var globalConstant = require("Constant");
cc.Class({
    extends: cc.Component,

    properties: {
        //召唤位置
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
            }),
            default:0
        },
        offset:0,
        //召唤时的像素间隔
        interval:0,

        battleCry:false,
    },

    // LIFE-CYCLE CALLBACKS:

    //onLoad: function(){
    //},

    releaseFunction:function(){
        var script = this.node.parent.parent.getComponent("Skill");
        var creatureScript = null,heroScript,cardScript;
        var selfObjectScript = script.selfObjectScript;
        var i = 0, x,intervalNum = 0,intervalMaxNum = 0;
        var enumDat = cc.Enum({
            //场景中间
            mid:0,
            //初始位置
            origin:1,
            //当前生物的位置
            now:2,
            //当前英雄的位置
            selfHero:3
        });


        switch (this.position){
            case enumDat.mid:
                x = cc.director.getWinSize().width * globalConstant.sceneWidth / 2;
                heroScript = script.hero[0].getComponent("Hero");
                for(i = 0;i < heroScript.handCard.length; i++) {
                    if (heroScript.handCard[i].getComponent("Card").cardType === 1){
                        intervalMaxNum++;
                    }
                }
                for(i = 0;i < heroScript.handCard.length; i++) {
                    cardScript = heroScript.handCard[i].getComponent("Card");
                    if(cardScript.cardType === 1) {
                        this.summonCreature(
                            x  - selfObjectScript.team / Math.abs(selfObjectScript.team) * (intervalNum - intervalMaxNum/2) * this.interval,
                            selfObjectScript.team,
                            cardScript.cardId
                        );
                        intervalNum++;
                    }
                }
                break;
            case enumDat.origin:
                x = cc.director.getWinSize().width * globalConstant.sceneWidth / 2 *
                    (1 + selfObjectScript.team/Math.abs(selfObjectScript.team));
                heroScript = script.hero[0].getComponent("Hero");
                for(i = 0;i < heroScript.handCard.length; i++) {
                    if (heroScript.handCard[i].getComponent("Card").cardType === 1){
                        intervalMaxNum++;
                    }
                }
                for(i = 0;i < heroScript.handCard.length; i++) {
                    cardScript = heroScript.handCard[i].getComponent("Card");
                    if(cardScript.cardType === 1) {
                        this.summonCreature(
                            x  - selfObjectScript.team / Math.abs(selfObjectScript.team) * (intervalNum - intervalMaxNum/2) * this.interval,
                            selfObjectScript.team,
                            cardScript.cardId
                        );
                        intervalNum++;
                    }
                }
                break;
            case enumDat.now:
                x = selfObjectScript.node.x;
                heroScript = script.hero[0].getComponent("Hero");
                for(i = 0;i < heroScript.handCard.length; i++) {
                    if (heroScript.handCard[i].getComponent("Card").cardType === 1){
                        intervalMaxNum++;
                    }
                }
                for(i = 0;i < heroScript.handCard.length; i++) {
                    cardScript = heroScript.handCard[i].getComponent("Card");
                    if(cardScript.cardType === 1) {
                        this.summonCreature(
                            x  - selfObjectScript.team / Math.abs(selfObjectScript.team) * (intervalNum - intervalMaxNum/2) * this.interval,
                            selfObjectScript.team,
                            cardScript.cardId
                        );
                        intervalNum++;
                    }
                }
                break;
            case enumDat.selfHero:
                x = script.hero[0].x;
                heroScript = script.hero[0].getComponent("Hero");

                for(i = 0;i < heroScript.handCard.length; i++) {
                    if (heroScript.handCard[i].getComponent("Card").cardType === 1){
                        intervalMaxNum++;
                    }
                }
                for(i = 0;i < heroScript.handCard.length; i++) {
                    cardScript = heroScript.handCard[i].getComponent("Card");
                    if(cardScript.cardType === 1) {
                        this.summonCreature(
                            x  - selfObjectScript.team / Math.abs(selfObjectScript.team) * (intervalNum - intervalMaxNum/2) * this.interval,
                            selfObjectScript.team,
                            cardScript.cardId
                        );
                        intervalNum++;
                    }
                }
                break;
        }
    },
    summonCreature:function(x,team,id){
        var eventsend = new cc.Event.EventCustom('creatureCreate',true);
        eventsend.setUserData({
            X:x - this.offset * team / Math.abs(team),
            Y:null,
            team:team,
            id:id,
            network:false,
            battleCry:this.battleCry
        });
        this.node.dispatchEvent(eventsend);
    }
    // update (dt) {},
});
