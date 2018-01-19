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
        //Ŀ�굥λ
        target:{
            type:cc.Enum({
                //Ӣ��
                hero:0,
                //�ҷ�Ӣ��
                selfHero:1,
                //�з�Ӣ��
                enemyHero:2,
            }),
            default:0
        },
        //�Ʊ����Ԥ��
        card:cc.Prefab,
        //�������Ƶ����������
        cardType:0,
        cardId:0,
        //��ӵ�����
        num:1,
    },

    // LIFE-CYCLE CALLBACKS:

    //onLoad: function(){
    //},
//���������Լ���ӵ���������Ҫ��BUG��ֻ�ܸ���ע�⣬ֻ�Լ���Ӣ���кõ�Ч��
    releaseFunction:function(){
        //��ȡ���ܵĽű�
        var script = this.node.parent.getComponent("Skill");
        var creatureScript = null,heroScript = null;
        //��ȡcreature�Ľű�
        var selfCreatureScript = script.selfCreatureScript;
        var i = 0,j = 0;
        var enumDat = cc.Enum({
            //Ӣ��
            hero:10,
            //�ҷ�Ӣ��
            selfHero:1,
            //�з�Ӣ��
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
