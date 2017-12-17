cc.Class({
    extends: cc.Component,

    properties: {
        pageUp:{
            default: null,
            type: cc.Button
        },
        pageDown:{
            default: null,
            type: cc.Button
        },
        // allCardBoard:{
        //     default: null,
        //     type: cc.PageView,
        // },
    },

    // use this for initialization
    nextPage: function () {
        this.allCardBoard.scrollToBottom(0.1);
    },
    lastPage: function(){
        this.allCardBoard.scrollToTop(0.1);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
