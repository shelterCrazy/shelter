var Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        //卡包层
        packageLayer:cc.Node,

        packageUseLayer:cc.Node,
        //卡包预支
        packagePrefab:[cc.Prefab],
        //卡包Layout控制盒
        packageBox:cc.Prefab,

        //卡包数据
        packageNumData:[cc.Integer],

        packageData:[],
        //数量标签
        numLabel:[cc.Node],

        numLabelPrefab:cc.Prefab,

        connectionSuccess:false,

        useAreaLayer:cc.Node,
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
        //this.renewBags();
        //this.login();
        var self = this;
        this.getPackageNum();

        this.initPrefab();

        setTimeout(function(){
            if(self.connectionSuccess === true) {
                self.initNumLabel();
                self.initPackage();
                self.node.on("packageSelect", self.packageSelect, self);
                self.node.on("usePackage", self.usePackage, self);
                self.node.on("unusePackage", self.unusePackage, self);

                self.node.on("enterArea", self.enterArea, self);
                self.node.on("leaveArea", self.leaveArea, self);
            }
        },1000);
    },
    packageSelect:function(e){
        if(-- this.packageNumData[e.detail.packageType] === 0){
            this.renewNumLabel();
        }else{
            this.renewNumLabel();
        }
    },


    enterArea:function(e) {
        this.useAreaLayer.active = true;
    },
    leaveArea:function(e) {
        this.useAreaLayer.active = false;
    },
    /**
     * @主要功能 使用，不使用卡包
     * @author C14
     * @Date 2018/2/22
     * @parameters
     * @returns
     */
    usePackage:function(e){

    },
    unusePackage:function(e){
        this.packageNumData[e.detail.packageType] ++;
        this.renewNumLabel();
    },


    initNumLabel:function(){
        for(var i = 0; i < this.numLabel.length ; i++) {
            this.numLabel[i] = cc.instantiate(this.numLabelPrefab);
            var numLabel = this.numLabel[i].getComponent(cc.Label);
            numLabel.string = this.packageNumData[i];
        }
    },
    renewNumLabel:function(){
        for(var i = 0; i < this.numLabel.length ; i++) {
            var numLabel = this.numLabel[i].getComponent(cc.Label);
            if(numLabel != undefined)
            numLabel.string = this.packageNumData[i];

            this.numLabel[i].active = !(this.packageNumData[i] <= 0);
        }
    },
    initPackage:function(){
        var j;
        this.packageLayer.removeAllChildren();
        for(var i = 0; i < this.packageNumData.length ; i++){
            if(this.packageNumData[i] !== 0){
                var packageBoxNode = cc.instantiate(this.packageBox);
                this.packageLayer.addChild(packageBoxNode);

                for(j = 0; j < this.packageNumData[i] ; j++){
                    var packageNode = cc.instantiate(this.packagePrefab[i]);
                    packageBoxNode.addChild(packageNode);
                    //packageNode.x = j*2;
                }
                packageBoxNode.addChild(this.numLabel[i]);
                this.numLabel[i].string = this.packageNumData[i];
            }
        }
    },
    getPackageNum:function(){
        var self = this;
        $.ajax({
            url: "/areadly/userCrad",
            type: "GET",
            dataType: "json",
            data: {"token":18},
            success: function(rs){
                if(rs.status === "200") {
                    cc.log("登录成功");
                    self.connectionSuccess = true;
                    self.packageData = rs.userCardList;
                    self.packageDataToNum();
                }else{
                    cc.log("登录失败");
                }
            },
            error: function(){
                cc.log("登录错误");
            }
        });
    },
    packageDataToNum:function(){
        var self = this,i;
        for(i = 0; i < self.packageNumData.length ; i++) {
            self.packageNumData[i] = 0;
        }
        for(i = 0; i < self.packageData.length ; i++) {
            if(self.packageData[i].status === 0) {
                self.packageNumData[self.packageData[i].package_type]++;
            }
        }
    },
    /**
     * @主要功能 动态加载牌库资源
     * @author
     * @Date 2018/2/7
     * @parameters
     * @returns
     */
    initPrefab:function(){
        var self = this;
        cc.loader.loadResDir("Card/Normal/", cc.Prefab, function (err, prefab) {
            for (var i = 0; i < prefab.length; i++) {
                var newNode = cc.instantiate(prefab[i]);
                var loadScript = newNode.getComponent("Card");
                //Global.cardPrefab[loadScript.cardId] = cc.instantiate(prefab[i]);
                if(loadScript.cardType === 0) {
                    Global.magicCardPrefab[loadScript.cardId] = cc.instantiate(prefab[i]);
                }else{
                    Global.creatureCardPrefab[loadScript.cardId] = cc.instantiate(prefab[i]);
                }
            }
        })
    },
    /**
     * @主要功能 打开一个卡包
     * @author C14
     * @Date 2017/12/21
     * @parameters
     * @returns
     */
    openBag:function(){
        var rand = 0;
        var card = null;
        var dat = 0;
        this.cardOutLayout.removeAllChildren();
        if(Global.bagNum[0] > 0){
            Global.bagNum[0] --;
            this.renewBags();
            for(var i = 0;i < 5;i++){
                rand = this.randomCard();
                if(rand < this.mainSceneScript.miniMagicPrefab.length){
                    this.mainSceneScript.myMCards[rand] ++;
                    card = cc.instantiate(this.mainSceneScript.miniMagicPrefab[rand]);
                    this.cardOutLayout.addChild(card);
                }else{

                    dat = rand - this.mainSceneScript.miniMagicPrefab.length;
                    this.mainSceneScript.myCCards[dat] ++;
                    var card2 = cc.instantiate(this.mainSceneScript.miniCreaturePrefab[dat]);
                    this.cardOutLayout.addChild(card2);
                }
            }
        }
    },

    /**
     * @主要功能 创建一个随机数
     * @author C14
     * @Date 2017/12/21
     * @parameters
     * @returns
     */
    randomCard:function(){
        var num = 0;
        num =  Math.floor(Math.random() * (this.mainSceneScript.miniMagicPrefab.length
            + this.mainSceneScript.miniCreaturePrefab.length));
        return num;
    },
    /**
     * @主要功能 添加10包卡
     * @author C14
     * @Date 2017/12/21
     * @parameters
     * @returns
     */
    addBags:function(){
        Global.bagNum[0] += 10;
        this.renewBags();
    },
    //renewBags:function(){
    //    this.cardBagNumLabel.string = '就第一种包，数量是:' + Global.bagNum[0];
    //},

    mainScene:function(){
        setTimeout(function(){
            cc.director.loadScene('MainScene');
        },1000);

    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});