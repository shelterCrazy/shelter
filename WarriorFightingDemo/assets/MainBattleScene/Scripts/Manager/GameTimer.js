cc.Class({
    extends: cc.Component,

    properties: {
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
        this.processBar = this.node.getComponent(cc.ProgressBar);
        this.timer = 0;
        this.maxTimer = 800;
        cc.log(this.processBar.progress);
        this.processBar.progress = this.timer/this.maxTimer;
        this.schedule(function() {
            this.timer++;

            if(this.timer > this.maxTimer){
                this.timer = 0;
                var allChild = this.node.getChildren();
                    for(var i = 0;i < allChild.length;i++){
                        var chantScript = allChild[i].getComponent("Chant");
                        if(chantScript != null) {
                                chantScript.flag = false;
                        }
                    }
            }

            var allChild1 = this.node.getChildren();
            for(var j = 0;j < allChild1.length;j++){
                var chantScript1 = allChild1[j].getComponent("Chant");
                if(chantScript1 != null) {
                    if(chantScript1.percent <= this.timer/this.maxTimer && chantScript1.flag === false){
                        chantScript1.flag = true;
                        chantScript1.fnChangeRound(-1);
                    }
                }
            }
            //cc.log(j);
            this.processBar.progress = this.timer/this.maxTimer;

            //cc.eventManager.dispatchEvent(event);
        },0.01);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    //
    // },
});
