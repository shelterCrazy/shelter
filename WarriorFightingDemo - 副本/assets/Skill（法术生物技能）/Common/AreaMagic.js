var globalConstant = require("Constant");
cc.Class({
    extends: cc.Component,

    properties: {
        //ħ�������ɹ�������
        loadEffect:cc.AudioClip,
        //����ʱ������
        hitEffect:cc.AudioClip,

        skillNode:cc.Node,

        GameManager:cc.Component,

        area:0,

        team:0,

        _interval:[]
    },

    // use this for initialization
    onLoad: function () {

        var self = this;

        this.animation = this.node.getComponent("customAnimation");
        this.team = 0;

        //���ݴ��������ɹ�ʱ��Ч���¼�
        if(this.loadEffect !== null)
            this.sendEvent(this.loadEffect);

        this.schedule(function(){
            this.magicSkill.releaseFunction(7);
        }, globalConstant.unitTime, cc.macro.REPEAT_FOREVER);
        //animation.on('finished',  this.onFinished,    this);
        //cc.director.getCollisionManager().enabled = true;
        for(var i = 0;i < 3; i++)
        {
            this._interval[i] = (this.animation.animations[i].endNumber -
                this.animation.animations[i].startNumber) * 1000 / 60 * this.animation.animations[i].loops;
        }
        this.animation.play("start");

        if(this._interval[0] !== this._interval[1]) {
            setTimeout(function () {
                self.animation.play("loop");
                self.magicSkill.releaseFunction(8);
                //e.stopPropagation();
            },this._interval[0]);
        }

        setTimeout(function(){
            self.animation.play("end");
            self.magicSkill.releaseFunction(9);
            //e.stopPropagation();
        },this._interval[0] + this._interval[1]);

        setTimeout(function(){
            self.onFinished();
            //e.stopPropagation();
        },this._interval[0] + this._interval[1] + this._interval[2]);
        //cc.director.getCollisionManager().enabledDebugDraw = true;
        //this.node.on('start',this.magicStart,this);
        //this.node.on('loop',this.magicLoop,this);
        //this.node.on('end',this.magicStop,this);

    },

    onCollisionEnter: function (other, self) {

        if (other.node.group === "Unit") {
            var script1 = other.node.getComponent('Unit');
            var stateScript = script1.stateNode.getComponent('CreatureState');

            this.magicSkill.releaseFunction(2,other.node);
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
        //box.size.width = this.area;
        this.magicSkill = this.skillNode.getComponent("Skill");
        this.team = detail.team;
        //this.node.width = this.area;
        //this.magicSkill.releaseFunction(0);
    },

    /**
     * @��Ҫ���� ���ϼ��ڵ㴫����Ϣ��ʹ֮������Ч
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
     * @��Ҫ����:   ��ʼ��ע�������
     * @parameters Manager
     */
    fnGetManager:function(Manager){
        this.GameManager = Manager;
    },
    // called every frame, uncomment this function to activate update callback
    //update: function (dt) {
    //},
});

