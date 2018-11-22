/**
 * @主要功能 选择英雄和卡组的管理器
 * @author C14
 * @Date 2018/10/5
 * @parameters
 * @returns
 */
var Global = require("Global");
cc.Class({
    extends: cc.Component,

    properties: {
        //现在所处的位置
        nowLayer:{
            type:cc.Enum({
                HeroSelect:0,
                DeckSelect:1
            }),
            default:0
        },
        //英雄查看选择节点
        heroViewNode:cc.Node,

        deckViewNode:cc.Node,

        matchManager:cc.Node,

        mainSceneManager:cc.Node,

        heroSelectButtonLayer:cc.Node,

        background:cc.Node,

        _route:-1
    },

    onLoad :function(){

        //cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        //this.node.active = false;
    },

    reloadHero:function(){
        var script = this.heroViewNode.getComponent("HeroSelectManager");
        var temp = script._select;
        if(Global.heroNum !== -1){
            script._select = true;
            script.changeHeroSelect(null, Global.heroNum);
            script._select = temp;
        }
    },
    reloadDeck:function(){
        var script = this.deckViewNode.getComponent("DeckSelectManager");
        var temp = script._select;
        if(Global.nowDeckNum !== -1){
            script._select = true;
            script.selectDeck(null, Global.nowDeckNum);
            script._select = temp;
        }
    },

    onKeyDown: function (event) {
        cc.log(this._route);
        if(this._route === 0){
            switch (event.keyCode) {
                case cc.KEY.a:
                case cc.KEY.left:
                    if (Global.heroNum > 0) {
                        this.heroViewNode.getComponent("HeroSelectManager").changeHeroSelect(null, Global.heroNum - 1);
                    }
                    break;
                case cc.KEY.d:
                case cc.KEY.right:
                    if (Global.heroNum < Global.maxHeroNum - 1) {
                        this.heroViewNode.getComponent("HeroSelectManager").changeHeroSelect(null, Global.heroNum + 1);
                    }
                    break;
                case cc.KEY.z:
                case cc.KEY.e:
                case cc.KEY.enter:
                    if(Global.heroNum === -1){
                        this.heroViewNode.getComponent("PlayEffect").playReleaseEffect();
                    }else{
                        this._route = 1;
                        this.heroViewNode.getComponent("PlayEffect").playPressEffect();
                        this.changePosition(null, 1);
                    }
                    break;
                case cc.KEY.escape:
                    this._route = -1;
                    this.changeActive(false);
                    break;
            }
        }else if(this._route === 1){
            switch (event.keyCode) {
                case cc.KEY.w:
                case cc.KEY.up:
                    for(var i = Global.nowDeckNum - 1;i >= 0; i--){
                        if(this.deckViewNode.getComponent("DeckSelectManager").
                                deckButtonNode[i].getComponent("ViewDeck").usable)break;
                    }
                    if (i >= 0) {
                        this.deckViewNode.getComponent("DeckSelectManager").selectDeck(null, i);
                    }
                    break;
                case cc.KEY.s:
                case cc.KEY.down:
                    for(i = Global.nowDeckNum + 1;i < this.deckViewNode.getComponent("DeckSelectManager").
                        deckButtonNode.length; i++){
                        if(this.deckViewNode.getComponent("DeckSelectManager").
                                deckButtonNode[i].getComponent("ViewDeck").usable)break;
                    }
                    if (i < this.deckViewNode.getComponent("DeckSelectManager").deckButtonNode.length) {
                        this.deckViewNode.getComponent("DeckSelectManager").selectDeck(null, i);
                    }
                    break;
                case cc.KEY.z:
                case cc.KEY.e:
                case cc.KEY.enter:
                    if(this.deckViewNode.getComponent("DeckSelectManager").openMatchManager()){
                        this._route = 2;
                    }
                    break;
                case cc.KEY.escape:
                    this._route = 0;
                    this.changePosition(null, 0);
                    break;
            }
        }else if(this._route === 2){
            switch (event.keyCode) {
                case cc.KEY.escape:
                    this.matchManager.getComponent("MatchManager").changeActive();
                    break;
            }
        }
    },
    changeActive:function(active){
        this.heroViewNode.getComponent("HeroSelectManager").selectEnable(active);
        this.mainSceneManager.getComponent("MainSceneManager").lockHero(active);
        this.node.stopAllActions();
        if(active){

            this.node.active = true;
            this.node.runAction(
                cc.sequence(
                    cc.fadeIn(0.7).easing(cc.easeCubicActionOut()),
                    cc.callFunc(function(){
                        this._route = 0;
                    }.bind(this))
                )
            );
        }else{
            this.node.runAction(
                cc.sequence(
                    cc.fadeOut(0.7).easing(cc.easeCubicActionOut()),
                    cc.callFunc(function(){
                        this._route = -1;
                        this.node.active = false;
                    }.bind(this))
                )
            );
        }
    },

    antiActive:function(){
        this.heroViewNode.getComponent("HeroSelectManager").selectEnable(!this.node.active);
        this.mainSceneManager.getComponent("MainSceneManager").lockHero(!this.node.active);
        this.node.stopAllActions();

        if(!this.node.active){
            //循环并且播放按钮的动画效果
            for(var i in this.heroSelectButtonLayer.children){
                this.heroSelectButtonLayer.children[i].opacity = 0;
                this.heroSelectButtonLayer.children[i].x += 70;
                this.heroSelectButtonLayer.children[i].runAction(
                    cc.sequence(
                        cc.delayTime(i * 0.06),
                        cc.fadeIn(0.1),
                        cc.moveTo(
                            0.5,
                            this.heroSelectButtonLayer.children[i].x - 70,
                            this.heroSelectButtonLayer.children[i].y).easing(cc.easeQuadraticActionOut())
                    )
                );
            }
            //如果是未显示的状态的话，那么使其显示出来
            this.node.active = !this.node.active;
            this.node.opacity = 255;

            if(Global.heroNum === - 1) {
                //如果是完全未选择的状态下，那么帮忙选为第一个角色
                this.heroViewNode.getComponent("HeroSelectManager").changeHeroSelect(null, 0);
            }else{
                //重新的更新一次英雄的显示
                this.heroViewNode.getComponent("HeroSelectManager").renewHeroView();
            }
            this.background.runAction(
                cc.sequence(
                    cc.fadeIn(1).easing(cc.easeCubicActionOut()),
                    cc.callFunc(function(){
                        this._route = 0;
                    }.bind(this))
                )
            );
        }else{
            this.node.runAction(
                cc.sequence(
                    cc.fadeOut(0.7).easing(cc.easeCubicActionOut()),
                    cc.callFunc(function(){
                        this._route = -1;
                        this.node.active = !this.node.active;
                    }.bind(this))
                )
            );
        }
    },

    changePosition:function(event, customEventData) {
        var num = Number(customEventData);
        //如果不是现在所在的位置
        if(num !== this.nowLayer){
            //只有选择了英雄，并且点击下一步才能够实现后面的选择
            if(Global.heroNum === - 1 && this.nowLayer === 0){
                this.node.getComponent("PlayEffect").playReleaseEffect();
                return;
            }
            this.node.getComponent("PlayEffect").playPressEffect();
            //使得英雄选择层的文字消失，此外无法点选，失去交互能力
            this.heroViewNode.getComponent("HeroSelectManager").selectEnable(num === 0);
            this.heroViewNode.getComponent("HeroSelectManager").changeTextVisible(num === 0);
            this.deckViewNode.getComponent("DeckSelectManager").selectEnable(num === 1);
            this._route = num;
            //移动到新的位置
            this.node.stopAllActions();
            this.node.runAction(cc.moveTo(0.6,- num * 950,0).easing(cc.easeCubicActionOut()));
            this.nowLayer = num;
        }else{
            this.node.getComponent("PlayEffect").playReleaseEffect();
        }
    }

    // update (dt) {},
});
