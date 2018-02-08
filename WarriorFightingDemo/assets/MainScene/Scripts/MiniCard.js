cc.Class({
    extends: cc.Component,

    properties: {
        //魔法消耗
        manaConsume: 0,
        //魔法消耗标签
        manaConsumeLabel: cc.Label, 
        
        //卡片类型
        cardType: 0,     //0法术牌；1生物牌
        //卡片ID
        cardId: 0,

        //稀有度
        rarity:{
            type: cc.Enum({
                N: 0,
                R: 1,
                SR: 2,
                SSR: 3
            }),
            default: 0
        },

        //张数
        num: 0,
        //张数标签
        numLabel: cc.Label,
        
        //卡片名称
        cName: {
            multiline:true,
            default:""
        },
        //卡片名称的标签
        cNameLabel: cc.Label,

        //详细的故事，描述什么的
        storyDescribe: {
            multiline:true,
            default:""
        }

    },

    // use this for initialization
    onLoad: function () {
        this.init();
    },
    
    init: function(){
        var self = this;
        self.manaConsumeLabel.string = self.manaConsume;
        self.numLabel.string = 'X' + self.num;
        self.cNameLabel.string = self.cName;
        //this.initData();
        this.initMouseEvent();        
    },
    //initData: function() {
    //    var self = this;
    //
    //    if(this.cardType === 0) {
    //        cc.loader.loadRes("Card/Normal/M" + this.cardType,this.findM);
    //    }else{
    //        cc.loader.loadRes("Card/Normal/C" + this.cardType,this.findC);
    //    }
    //},
    //
    //findC:function(err,prefab){
    //    var self = this;
    //    var newNode = cc.instantiate(prefab);
    //    var loadScript = newNode.getComponent("Card");
    //    cc.log(this.cardId + "号生物的法力消耗是" + this.manaConsume);
    //    cc.log(this.cardId + "号生物的名字是" + this.cName);
    //    self.manaConsume = loadScript.manaConsume;
    //    self.rarity = loadScript.rarity;
    //    self.cName = loadScript.cName;
    //
    //    self.manaConsumeLabel.string = self.manaConsume;
    //    self.numLabel.string = 'X' + self.num;
    //    self.cNameLabel.string = self.cName;
    //},
    //findM:function(err,prefab){
    //    var self = this;
    //    var newNode = cc.instantiate(prefab);
    //    var loadScript = newNode.getComponent("Card");
    //    self.manaConsume = loadScript.manaConsume;
    //    self.rarity = loadScript.rarity;
    //    self.cName = loadScript.cName;
    //    cc.log(indication + "号生物的法力消耗是" + this.manaConsume);
    //    cc.log(indication + "号生物的名字是" + this.cName);
    //    self.manaConsumeLabel.string = self.manaConsume;
    //    self.numLabel.string = 'X' + self.num;
    //    self.cNameLabel.string = self.cName;
    //},

    adjustCount: function(num){
        this.num = num;
        this.numLabel.string = 'X' + num;
    },
    
    initMouseEvent:function(){
        var newInfoBoard = null;
        this.node.on(cc.Node.EventType.MOUSE_ENTER,this.showInfo, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE,this.cleanInfo, this);
        this.node.on(cc.Node.EventType.MOUSE_UP,this.addCardtoDeck, this);
    },

    showInfo:function(){
        var eventsend = new cc.Event.EventCustom('whenMouseEnterTheMiniCard',true);
        eventsend.setUserData({id:(this.cardId),typeId:this.cardType,count:this.num,cardScript:this});
        this.node.dispatchEvent(eventsend);
    },

    cleanInfo:function(){
        var eventsend = new cc.Event.EventCustom('whenMouseLeaveTheMiniCard',true);
        this.node.dispatchEvent(eventsend);
    },

    addCardtoDeck:function(event){
        var eventsend = new cc.Event.EventCustom('whenMouseUpTheMiniCard',true);
        eventsend.setUserData({
            id:this.cardId,
            typeId:this.cardType,
            cName:this.cName,
            manaConsume:this.manaConsume,
            num:this.num,
            cardScript:this,
            button:event.getButton()
        });
        this.node.dispatchEvent(eventsend);
    }
// called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});