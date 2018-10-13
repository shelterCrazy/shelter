

cc.Class({
    extends: cc.Component,

    properties: {
        _time:0,
        timeLabel:cc.Label,
        mainSceneManager:cc.Node,
        selectNode:cc.Node,
        deckViewNode:cc.Node
    },
    onLoad:function(){
        this.schedule(function(){
            this._time ++;
            this.timeLabel.string = this._time;
        }.bind(this),1);
    },
    changeActive:function(){
        if(this.node.active === false){
            this._time = 0;
            this.timeLabel.string = this._time;
            this.node.active = true;
            this.selectNode.getComponent("SelectManager")._route = 2;
            this.node.runAction(cc.fadeIn(1).easing(cc.easeCubicActionOut()));
            this.mainSceneManager.getComponent("MainSceneManager").match();
        }else{
            this.node.runAction(cc.sequence(
                cc.fadeOut(1).easing(cc.easeCubicActionOut()),
                cc.callFunc(function(){
                    this.node.active = false;
                }.bind(this))
            ));
            this.selectNode.getComponent("SelectManager")._route = 1;
            this.deckViewNode.getComponent("DeckSelectManager").selectEnable(true);
        }
    }

    // update (dt) {},
});
