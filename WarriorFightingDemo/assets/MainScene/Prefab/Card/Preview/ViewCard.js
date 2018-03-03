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
        this.initMouseEvent();
    },
    
    init: function(){
        var self = this;
        self.manaConsumeLabel.string = self.manaConsume;
        if(self.num > 1){
            self.numLabel.string = 'x' + self.num;
        }else{
            self.numLabel.string = '';   
        }
        
        if(self.cName.length <= 3 ){
            self.cNameLabel.string = self.cName;
        }else{
            self.cNameLabel.string = self.cName.slice(0,3) + '...';
        }
    },
    addViewCard: function(detail){
        var self = this;
        
        self.manaConsume = detail.manaConsume;
        self.cName = detail.cName;
             self.num = 1;     
        
        self.cardType = detail.typeId;
        self.cardId = detail.id;
        
        self.init();
    },
    addNumBy: function(num){
        var self = this;    
        self.num += num;
        self.numLabel.string = 'x' + self.num;
    },
    
    initMouseEvent:function(){
        this.node.on(cc.Node.EventType.MOUSE_DOWN,removeCard, this);

        function removeCard(){
            var eventsend = new cc.Event.EventCustom('mouseDownTheShowCard',true);
            eventsend.setUserData({object:this});
            this.node.dispatchEvent(eventsend);
        }
    },
    
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
