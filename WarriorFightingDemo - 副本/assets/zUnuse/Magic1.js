cc.Class({
    extends: cc.Component,

    properties: {
        //魔法创建成功的音乐
        loadEffect:cc.AudioClip,
        //命中时的音乐
        hitEffect:cc.AudioClip,
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        skillNode:cc.Node,

        GameManager:cc.Component
    },

    // use this for initialization
    onLoad: function () {
        this.speed = cc.v2(0,0);
        this.team = 0;
        this.area = 0;
        this.collisionTime = 0;

        //传递创建法术成功时音效的事件
        if(this.loadEffect !== null)
        this.sendEvent(this.loadEffect);

        var animation = this.node.getComponent(cc.Animation);
        var animState = animation.play();
        animState.repeatCount = Infinity;

        //animation.on('finished',  this.onFinished,    this);

        //������ײ
        cc.director.getCollisionManager().enabled = true;
        //cc.director.getCollisionManager().enabledDebugDraw = true;

    },

    onCollisionEnter: function (other, self) {
        //�����Ӵ��ж�
        if (other.node.group === "Ground") {
            this.collisionTime ++;
            if(this.collisionTime >= 14)
            {
                var eventsend = new cc.Event.EventCustom('magicCreate',true);
                eventsend.setUserData({
                    position:this.node.x,
                    y:null,
                    area:this.area,
                    team:this.team,
                    id:0,
                    network:false,
                });
                this.node.dispatchEvent(eventsend);
                this.node.removeFromParent();
            }
            this.speed.y = - this.speed.y;
            //this.node.removeFromParent();
        }
        if (other.node.group === "Sky") {
            this.collisionTime ++;
            this.speed.y = - this.speed.y;
        }
        if (other.node.group === "LBound") {
            this.speed.x = - this.speed.x;
        }
        if (other.node.group === "RBound") {
            this.speed.x = - this.speed.x;
        }
        //�����Ӵ��ж�
        if (other.node.group === "Creature") {
            this.magicSkill.releaseFunction(2);
            var script = other.node.getComponent('Creature');
            if(script.team !== this.team){
                //传递播放音效的事件
                if(this.hitEffect !== null)
                this.sendEvent(this.hitEffect);
                //script.changeHealthBy(-10);

                var eventsend = new cc.Event.EventCustom('magicCreate',true);
                eventsend.setUserData({
                    position:this.node.x,
                    y:null,
                    area:this.area,
                    team:this.team,
                    id:0,
                    network:false,
                });
                this.node.dispatchEvent(eventsend);

                this.node.removeFromParent();
            }
        }
        //if (other.node.group === "Base") {
        //    var script2 = other.node.getComponent('Base');
        //    if(script2.team !== this.team){
        //        //传递播放音效的事件
        //        if(this.hitEffect !== null)
        //            this.sendEvent(this.hitEffect);
        //        //script.changeHealthBy(-10);
        //
        //        var eventsend2 = new cc.Event.EventCustom('magicCreate',true);
        //        eventsend2.setUserData({
        //            position:this.node.x,
        //            y:null,
        //            area:this.area,
        //            team:this.team,
        //            id:0,
        //            network:false,
        //        });
        //        this.node.dispatchEvent(eventsend2);
        //
        //        this.node.removeFromParent();
        //    }
        //}
        if (other.node.group === "Hero") {
            var script3 = other.node.getComponent('Player');
            if(script3.team !== this.team){
                //传递播放音效的事件
                if(this.hitEffect !== null)
                    this.sendEvent(this.hitEffect);
                //script.changeHealthBy(-10);

                var eventsend3 = new cc.Event.EventCustom('magicCreate',true);
                eventsend3.setUserData({
                    position:this.node.x,
                    y:null,
                    area:this.area,
                    team:this.team,
                    id:0,
                    network:false,
                });
                this.node.dispatchEvent(eventsend3);

                this.node.removeFromParent();
            }
        }
    },

    onCollisionExit: function (other, self) {
        if (other.node.group === "Ground") {

        }

        if (other.node.group === "Creature") {

        }
    },

    changeTeam: function(team){
        //this.node.removeFromParent();
    },
    initMagic:function(detail){
        this.team = detail.team;
        this.area = detail.area;
        this.magicSkill = this.skillNode.getComponent("Skill");
        this.speed.x = Math.sin((detail.angel + 90)*Math.PI/180)*detail.speed;
        this.speed.y = Math.cos((detail.angel + 90)*Math.PI/180)*detail.speed;
    },
     //called every frame, uncomment this function to activate update callback
    update: function (dt) {
        //delayTime(1);
        this.node.x += this.speed.x * dt;
        this.node.y += this.speed.y * dt;
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
});

