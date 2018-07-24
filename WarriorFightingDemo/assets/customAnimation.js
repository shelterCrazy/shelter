
var anims = cc.Class({
    name: "Clips",
    properties:{
        animtionName: {
            default: "",
            displayName: "动画名称",
        },
        prefix: {
            default: "",
            displayName: "帧名称前缀",
            tooltip: "帧名称里编号前面的字符串"
        },
        suffix: {
            default: "",
            displayName: "帧名称后缀",
            tooltip: "帧名称里编号后的字符串"
        },
        startNumber:　{
            default: 0,
            displayName: "起始帧编号"
        },
        endNumber:　{
            default: 0,
            displayName: "结束帧编号"
        },
        interval: {
            default: 0,
            displayName: "帧间隔时间",
            tooltip: "大于或者等于1则为动画播放总时间"
        },
        loops: {
            default: 0,
            displayName: "动画重复次数",
            tooltip: "重复次数为-1时则一直重复"
        },
        speed: {
            default: 1,
            displayName: "动画播放速度",
        }
    }

})

cc.Class({
    extends: cc.Component,

    properties: {
        atlas: {
            default: null,
            type: cc.SpriteAtlas,
            displayName: "图集"
        },
        animations: {
            default: [],
            type: anims
        },
        defaultAnimName: {
            default: "",
            displayName: "默认播放",
            tooltip: "勾选Play On Load情况下默认播放的动画名称，如不填则默认播放animations[0]"
        },
        speed: {
            default: null,
            type: cc.Label
        },
        playOnLoad:false,
        backOriginFrame: {
            default: false,
            displayName: "回到起始帧",
            tooltip: "动画播放完毕或者停止时，是否回到起始帧（起始帧默认为Sprite组件上的SpriteFrame）"
        } ,
        //当前动画索引
        _curAnimIdx: 0,
        //当前播放帧的编号
        _curFramesNum: 0,
        //当前动画的总帧数（结束编号 - 开始编号 + 1）
        _frameAmount: 0,
        //播放结束
        _isDone: true,
        //正在播放
        _isPlaying: false,
        //已重复次数
        _curLoops: 0,
        //Sprite组件上的SpriteFrame
        _originFrame: null
    },

    // use this for initialization
    onLoad: function () {
        //如果默认播放的动画不为空
        if(this.defaultAnimName !== ""){
            //获取默认播放动画的索引，并赋给当前动画索引
            this._curAnimIdx = this.getIndexByName(this.defaultAnimName);
            //获取当前动画的起始帧，赋给当前播放帧编号
            this._curFramesNum = this.animations[this._curAnimIdx].startNumber;
            //获取动画的总帧数
            this._frameAmount = this.animations[this._curAnimIdx].endNumber - this.animations[this._curAnimIdx].startNumber + 1;
            cc.log("defaultName !== null");
        }else {
            //获取当前动画的起始帧，赋给当前播放帧编号
            this._curFramesNum = this.animations[this._curAnimIdx].startNumber;
            cc.log("defaultName === null");
        }
        //保存起始帧
        this._originFrame = this.node.getComponent(cc.Sprite).spriteFrame;
        //是否play on load
        this.playOnLoad? this.play() : null
    },
    //播放
    play: function(name){
        cc.log("name = " + name);
        //如果没有动画正在播放
        if(!this._isPlaying){

            this._isPlaying = true;
            this._isDone = false;

            //检查是否传有name参数
            if(typeof(name) === "string"){
                //根据name获取到动画的索引
                this._curAnimIdx = this.getIndexByName(name);
                //获取当前动画的起始帧，赋给当前播放帧编号
                this._curFramesNum = this.animations[this._curAnimIdx].startNumber;
                //获取动画的总帧数
                this._frameAmount = this.animations[this._curAnimIdx].endNumber - this.animations[this._curAnimIdx].startNumber + 1;
            }

            var curAnim = this._curAnimIdx;
            var interval = this.animations[curAnim].interval;
            var loops = this.animations[curAnim].loops;
            var speed = this.animations[curAnim].speed;
            //this.speed.string = "速度:" + speed;
            this._curLoops = 0;
            //如果动画的loops为-1则一直重复
            if(loops === -1){
                //如果interval大于或者等于1，则interval不再是帧间隔，而是动画播放一次所需的时间
                //开启计时器更换spriteFrame模拟动画播放效果
                if(interval >=　1){
                    this.schedule(this.updateFrame,  interval / this._frameAmount / speed);
                }else{
                    this.schedule(this.updateFrame,  interval);
                }
                //不为-1并且大于0，就根据动画的间隔时间、重复次数、播放速度开始播放动画
                //loops * this._frameAmount - 1 代表总共需要重绘的次数，因为调用一次相当于播放一帧，
                //假设有10帧就需要调用十次，并且这只是播放一次动画，如果动画需要重复5次，则需要再乘5,最后的 -1是因为计时器马上会调用一次，
                //比如计时器的重复次数为10次，计时器会马上调用一次，并重复10次，总共调用11次
            }else if(loops > 0){
                if(interval >=　1){
                    this.schedule(this.updateFrame,  interval / this._frameAmount / speed, loops * this._frameAmount - 1);
                }else{
                    this.schedule(this.updateFrame,  interval / speed, loops * this._frameAmount -1);
                }
                //cc.log("_curLoops = ?" +  (loops * this._frameAmount - 1));
            }
            cc.log("play if");
            //如果有动画正在播放
        }else {
            cc.log("play else");
            //停止播放当前动画
            this.stop();
            //开始播放
            this.play(name);
        }
    },
    //停止播放
    stop: function(){
        //取消定时器
        this.unschedule(this.updateFrame);
        //当前播放帧重置为当前动画的起始帧
        this._curFramesNum = this.animations[this._curAnimIdx].startNumber;
        //检查是否需要恢复到默认的spriteFrame
        this.backOriginFrame ? this.node.getComponent(cc.Sprite).spriteFrame = this._originFrame : null;
        //播放结束
        this._isDone = true;
        //没有正在播放的动画
        this._isPlaying = false;
        //重置已重复的次数
        this._curLoops = 0;
        cc.log("stop");
    },
    //暂停播放
    pause: function(){
        //这里unschedule实现暂停的原理是只取消了计时器，没有重置当前播放帧和已重复的次数，
        this.unschedule(this.updateFrame);
        //没有正在播放的动画
        this._isPlaying = false;
        cc.log("pause");
    },
    //恢复播放
    resume: function(){
        //播放动画，因为暂停播放时没有重置当前播放帧和已重复次数，所以能继续播放
        this.play();
        cc.log("resume");
    },
    //更新帧，模拟动画效果
    updateFrame: function(dt){
        //更新帧
        //cc.log("setFrame");
        //获取当前播放帧编号，获取后当前播放帧编号+1
        var idx = this._curFramesNum++;
        //已重复次数+1
        this._curLoops++;
        var curAnim = this._curAnimIdx;
        var anim = this.animations[curAnim];

        if(idx < 10){
            var str = "00";
        }else if(idx < 100){
            str = "0";
        }else if(idx < 1000){
            str = "";
        }else{
            str = "";
        }
        //获取Sprite组件，更换spriteFrame
        this.node.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame(anim.prefix + str + idx + anim.suffix);
        //如果当前播放帧编号大于结束帧编号，则当前播放帧编号重置为起始播放帧编号
        this._curFramesNum > this.animations[curAnim].endNumber ? this._curFramesNum = this.animations[curAnim].startNumber : null;
        //如果动画不是一直重复的，并且已经重复的次数在本次设置spriteFrame之后大于总重复次数，
        //代表动画已经播放完成（虽然计时器会停止调用，但这里是为了重置一些配置信息而调用stop）
        if(this.animations[curAnim].loops > 0 && this._curLoops > (this.animations[curAnim].loops * this._frameAmount - 1)){
            //var eventsend = new cc.Event.EventCustom(this.animations[curAnim].animtionName, true);
            //停止播放
            this.stop();
            //this.node.dispatchEvent(eventsend);
            //this._curAnimIdx ++;
            //this.play(this.animations[this._curAnimIdx]);
            //停止播放
            //this.stop();
        }
    },
    //播放速度加快
    speedUp: function(){
        //如果有动画正在播放
        if(this._isPlaying){
            //暂停正在播放的动画
            this.pause();
            //增加速度
            this.animations[this._curAnimIdx].speed += 0.1;
            //this.speed.string = "速度:" + this.animations[this._curAnimIdx].speed;
            //恢复播放
            this.resume();
        }
    },
    //播放速度减慢
    speedCut: function(){
        if(this._isPlaying){
            this.pause();
            this.animations[this._curAnimIdx].speed -= 0.1;
            this.animations[this._curAnimIdx].speed < 0.1 ? this.animations[this._curAnimIdx].speed = 0.1 : null;
            //this.speed.string = "速度:" + this.animations[this._curAnimIdx].speed;
            this.resume();
        }
    },
    //获取动画是否播放完成
    isDone: function(){
        return this._isDone;
    },
    //根据动画名字获得动画在animations数组里的索引
    getIndexByName: function(name){
        if(name != undefined){
            for(var i = 0; i < this.animations.length; i++){
                if(this.animations[i].animtionName == name){
                    return i;
                }
            }
        }
    },
    //切换动画，这里是button的回调，button.node.name必须是动画数组里某一个动画的name，这里是根据button所在的节点的name来播放相应的动画
    replace: function(event){
        var sender = event.target;
        //var button = sender.getComponent(cc.Button);
        this.play(sender.name);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
