cc.Class({
    extends: cc.Component,

    properties: {
        selectMenuKind:{
            default: null,
            type: cc.Label,
        },
        selectMenuList:{
            default: null,
            type: cc.Node,
        },
        selectMenuButton:{
            default: null,
            type: cc.Button,
        },
        //occupationList:{
        //    default: [],
        //    type: cc.Node,
        //},
        //occupationListName:{
        //    default: [],
        //    type: cc.Label,
        //},
    },
    callback:function(event, customEventData){
        switch(customEventData){
            case 'total':
                this.selectMenuList.active = false;
                this.selectMenuKind.string = "所有阵营";break;
            case 'science':
                this.selectMenuList.active = false;
                this.selectMenuKind.string = "科学";break;
            case 'fantasy':
                this.selectMenuList.active = false;
                this.selectMenuKind.string = "幻想";break;
            case 'chaos':
                this.selectMenuList.active = false;
                this.selectMenuKind.string = "混沌";break;
            case 'neutrality':
                this.selectMenuList.active = false;
                this.selectMenuKind.string = "中立";break;
            default: break;
        }
    },
    rareSelect:function(event, customEventData){
        switch(customEventData){
            case 'total':
                this.selectMenuList.active = false;
                this.selectMenuKind.string = "全部";break;
            case 'N':
                this.selectMenuList.active = false;
                this.selectMenuKind.string = "N";break;
            case 'R':
                this.selectMenuList.active = false;
                this.selectMenuKind.string = "R";break;
            case 'SR':
                this.selectMenuList.active = false;
                this.selectMenuKind.string = "SR";break;
            case 'SSR':
                this.selectMenuList.active = false;
                this.selectMenuKind.string = "SSR";break;
            default: break;
        }
    },
    consumeSelect:function(event, customEventData){
        if(customEventData === 'total')
        {
            this.selectMenuList.active = false;
            this.selectMenuKind.string = "所有消耗";
        }else {
            this.selectMenuList.active = false;
            this.selectMenuKind.string = "" + customEventData;
        }
    },
    // use this for initialization
    onLoad: function ()
    {
        this.selectMenuList.active = false;
    },
    showSelectMenuList: function(){
        this.selectMenuList.active = true;
        //this.selectMenuListOperation(this.occupationList);
        this.hideSelectMenuList(this.selectMenuList);
        //this.pickSelectMenuItem(this.occupationList);
    },
        //function stopAction() {
        //    this.selectMenuList.active = false;
        //}
    hideSelectMenuList: function(selectBoard){
        selectBoard.on(cc.Node.EventType.MOUSE_LEAVE,hideSelectBoard, this);
        function hideSelectBoard(){
            selectBoard.active = false;
        }
    },
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
