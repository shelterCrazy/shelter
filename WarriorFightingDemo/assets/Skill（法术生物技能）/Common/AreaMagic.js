var globalConstant = require("Constant");
cc.Class({
    extends: cc.Component,

    properties: {
        //魔法创建成功的音乐
        loadEffect:cc.AudioClip,
        //命中时的音乐
        hitEffect:cc.AudioClip,

        skillNode:cc.Node,

        GameManager:cc.Component,

    },

    // use this for initialization
    onLoad: function () {

        var animation = this.node.getComponent(cc.Animation);
        this.team = 0;

        //传递创建法术成功时音效的事件
        if(this.loadEffect !== null)
            this.sendEvent(this.loadEffect);

        animation.on('finished',  this.onFinished,    this);

        cc.director.getCollisionManager().enabled = true;
        //cc.director.getCollisionManager().enabledDebugDraw = true;

    },

    onCollisionEnter: function (other, self) {

        if (other.node.group === "Ground") {

        }

        if (other.node.group === "Creature") {
            var script1 = other.node.getComponent('Creature');
            var stateScript = script1.stateNode.getComponent('CreatureState');

            if(script1.team === this.team){

                this.magicSkill.releaseFunction(2,script1);
                ////传递播放音效的事件
                //if(this.hitEffect !== null)
                //    this.sendEvent(this.hitEffect);
            }else{
                this.magicSkill.releaseFunction(3,script1);
            }
        }

        if (other.node.group === "Hero") {
            var script2 = other.node.getComponent('Player');
            if(script2.team === this.team){
                //传递播放音效的事件
                //if(this.hitEffect !== null)
                //    this.sendEvent(this.hitEffect);
                this.magicSkill.releaseFunction(4,script2);
            }else{
                this.magicSkill.releaseFunction(5,script2);
            }
        }
        if (other.node.group === "Base") {
            var script3 = other.node.getComponent('Base');
            if(script3.team === this.team){
                //传递播放音效的事件
                //if(this.hitEffect !== null)
                //    this.sendEvent(this.hitEffect);
                this.magicSkill.releaseFunction(6,script3);
            }else{
                this.magicSkill.releaseFunction(7,script3);
            }
        }
    },

    onCollisionExit: function (other, self) {
        if (other.node.group === "Ground") {

        }

        if (other.node.group === "Creature") {

        }
    },
    onFinished: function(){
        this.magicSkill.releaseFunction(1);
        this.node.removeFromParent();
    },
    initMagic:function(detail){
        var box = this.node.getComponent(cc.BoxCollider);
        box.size.width = detail.area;
        this.magicSkill = this.skillNode.getComponent("Skill");
        this.team = detail.team;
        this.node.width = detail.area;

        this.magicSkill.releaseFunction(0);
    },
    /**
     * @主要功能 向上级节点传递消息，使之播放音效
     * @author C14
     * @Date 2017/12/12
     * @parameters audioChip volume
     * @returns null
     */
    sendEvent:function(audioChip,fullVolume,volume) {
        var eventsend = new cc.Event.EventCustom("playEffect", true);
        if(volume === undefined || volume === null){
            volume = 1;
        }
        if(fullVolume === undefined || fullVolume === null || fullVolume === false){
            fullVolume = false;
        }else{
            fullVolume = true;
        }
        eventsend.setUserData({
            effect:audioChip,
            volume:volume,
            fullVolume:fullVolume,
            target:this.node,
        });
        this.node.dispatchEvent(eventsend);
    },

    /**
     * @主要功能:   初始化注入管理类
     * @parameters Manager
     */
    fnGetManager:function(Manager){
        this.GameManager = Manager;
    },
    // called every frame, uncomment this function to activate update callback
    //update: function (dt) {
    //},
});

