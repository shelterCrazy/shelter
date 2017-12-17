cc.Class({
    extends: cc.Component,

    properties: {
        num:0,
        //���������
        type: {
            type: cc.Enum({
                //��ѧ
                Science: 0,
                //����
                Fantasy: 1,
                //����
                Chaos: 2,
                }),
            default: 0,
        },
        //�Ƿ����ʹ�ã���ʼΪ��
        usable:true,

        nameLabel:cc.Label,
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
        this.initMouseEvent();
    },
    initMouseEvent:function(){
        this.node.on(cc.Node.EventType.MOUSE_DOWN,removeCard, this);

        function removeCard(){
            var eventsend = new cc.Event.EventCustom('mouseDownTheDeck',true);
            eventsend.setUserData({object:this});
            this.node.dispatchEvent(eventsend);
        }
    },
    removeThisDeck:function(){
    var eventsend = new cc.Event.EventCustom('removeTheDeck',true);
    eventsend.setUserData({object:this});
    this.node.dispatchEvent(eventsend);
    },
    changeType:function(type){
        this.type = type;
    },
    changeName:function(name){
        this.nameLabel.string = name;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
