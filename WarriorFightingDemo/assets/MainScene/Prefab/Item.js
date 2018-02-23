cc.Class({
    extends: cc.Component,

    properties: {
        purchaseButton:cc.Node,

        folded:false,

        id:0,
        //名称
        iName:"",
        //名称的标签
        iNameLabel:cc.Label,

        detail:{
            multiline:true,
            default:""
        },
        //描述
        detailLabel:cc.Label,
        //所需的金币
        money:0,

        moneyLabel:cc.Label,

        clickable:true,
        type:{
            type:cc.Enum({
                bag:0,
                story:1
            }),
            default:0
        }
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
    },

    // use this for initialization
    onLoad: function () {

        this.iNameLabel.string = this.iName;
        this.node.on(cc.Node.EventType.MOUSE_ENTER,this.enterBag, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE,this.leaveBag, this);
        this.node.on(cc.Node.EventType.MOUSE_UP,this.clickBag, this);
    },
    init:function(){
        this.folded = false;
        this.node.y = 0;
    },
    enterBag:function(){
        if(this.folded === false){
            var action = cc.scaleTo(0.7,1.4);
            //this.node.runAction(action.easing(cc.easeCircleActionInOut()));
            this.node.runAction(action.easing(cc.easeBackInOut()));
        }
    },
    leaveBag:function(){
        if(this.folded === false){
            var action = cc.scaleTo(0.7,1);
            //this.node.runAction(action.easing(cc.easeCircleActionInOut()));
            this.node.runAction(action.easing(cc.easeBackInOut()));
        }
    },
    clickBag:function(){
        if(this.clickable === true) {
            //this.clickable = false;
            var children = this.node.parent.children;
            var finished = cc.callFunc(function () {
                this.folded = false;
                for (var i = 0; i < children.length; i++) {
                    children[i].getComponent("Item").clickable = true;
                }
            }, this);
            var action1 = cc.sequence(cc.moveTo(0.7, 0, 0).easing(cc.easeCircleActionInOut()), cc.scaleTo(0.5, 1).easing(
                cc.easeCircleActionInOut()
            ), finished);

            this.node.runAction(action1);
            //this.purchaseButton.runAction(cc.moveTo(0.7,this.node.x).easing(cc.easeBackInOut()));
            for (var i = 0; i < children.length; i++) {
                if (children[i] !== this.node) {
                    var action = cc.spawn(cc.scaleTo(0.7, 0.3), cc.moveTo(0.7, 0, -100));
                    children[i].runAction(action.easing(cc.easeCircleActionInOut()));
                    children[i].getComponent("Item").folded = true;
                }
                children[i].getComponent("Item").clickable = false;
            }

            var eventsend = new cc.Event.EventCustom('purchaseId', true);
            eventsend.setUserData({id: this.id, script: this,text:this.detail});
            this.node.dispatchEvent(eventsend);
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
