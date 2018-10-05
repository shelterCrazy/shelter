

cc.Class({
    extends: cc.Component,

    properties: {
        _time:0,
        timeLabel:cc.Label
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
            this.node.runAction(cc.fadeIn(1).easing(cc.easeCubicActionOut()));
        }else{
            this.node.runAction(cc.sequence(
                cc.fadeOut(1).easing(cc.easeCubicActionOut()),
                cc.callFunc(function(){
                    this.node.active = false;
                }.bind(this))
            ));
        }
    }

    // update (dt) {},
});
