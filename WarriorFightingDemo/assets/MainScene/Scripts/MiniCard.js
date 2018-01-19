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
        cardID: 0,

        //稀有度
        rarity:{
            type: cc.Enum({
                N: 0,
                R: 1,
                SR: 2,
                SSR: 3,
            }),
            default: 0,
        },

        //张数
        num: 0,
        //张数标签
        numLabel: cc.Label,
        
        //卡片名称
        cName: cc.String,
        //卡片名称的标签
        cNameLabel: cc.Label,
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
        this.initMouseEvent();        
    },
    
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
        eventsend.setUserData({id:(this.cardID),typeId:this.cardType,count:this.num,cardScript:this});
        this.node.dispatchEvent(eventsend);
        cc.log('MouseEnterTheMiniCard');
    },
    cleanInfo:function(){
        var eventsend = new cc.Event.EventCustom('whenMouseLeaveTheMiniCard',true);
        this.node.dispatchEvent(eventsend);
        cc.log('MouseLeaveTheMiniCard');
    },
    addCardtoDeck:function(event){
        var eventsend = new cc.Event.EventCustom('whenMouseUpTheMiniCard',true);
        eventsend.setUserData({
            id:this.cardID,
            typeId:this.cardType,
            cName:this.cName,
            manaConsume:this.manaConsume,
            num:this.num,
            cardScript:this,
            button:event.getButton()
        });
        cc.log('MouseUpTheMiniCard');
        this.node.dispatchEvent(eventsend);
    }
// called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});