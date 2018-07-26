var Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        //卡包层
        packageLayer: cc.Node,

        packageUseLayer: cc.Node,
        //卡包预制
        packagePrefab: [cc.Prefab],
        //卡包收容盒
        packageBox: cc.Prefab,

        //卡包数据
        packageNumData: [cc.Integer],
        //卡包数据
        packageData: [],
        //数量标签
        numLabel: [cc.Node],

        numLabelPrefab: cc.Prefab,

        connectionSuccess: false,

        useAreaLayer: cc.Node,
        //卡包开启后的卡牌预制
        packageCardPrefab:cc.Prefab,
        //用户开启卡包成功后的展示节点
        packageCardListNode:cc.Node,
        //结束卡牌的按钮
        endButton:cc.Node
    },

    // use this for initialization
    onLoad: function () {
        //this.renewBags();
        //this.login();
        var self = this;
        this.getPackageNum();

        this.clickNum = 0;

        setTimeout(function () {
            if (self.connectionSuccess === true) {
                self.initNumLabel();
                self.initPackage();
                self.node.on("packageSelect", self.packageSelect, self);
                self.node.on("usePackage", self.usePackage, self);
                self.node.on("unusePackage", self.unusePackage, self);

                self.node.on("enterArea", self.enterArea, self);
                self.node.on("leaveArea", self.leaveArea, self);

                self.node.on("rotateCard", function(){
                    this.clickNum ++;
                    cc.log(this.clickNum);
                    if(this.clickNum === 5){
                        this.clickNum = 0;
                        this.endButton.active = true;
                    }
                }.bind(this), self);
            }
        }.bind(this), 1000);
    },
    closePackageCardList:function(){
        this.packageCardListNode.removeAllChildren();
    },
    packageSelect: function (e) {
        if (--this.packageNumData[e.detail.packageType] === 0) {
            this.renewNumLabel();
        } else {
            this.renewNumLabel();
        }
    },


    enterArea: function (e) {
        this.useAreaLayer.active = true;
    },
    leaveArea: function (e) {
        this.useAreaLayer.active = false;
    },
    /**
     * @主要功能 使用，不使用卡包
     * @author C14
     * @Date 2018/2/22
     * @parameters
     * @returns
     */
    usePackage: function (e) {
        cc.log(e.detail.packageType);
        this.useCardPackage(e.detail.packageType);
    },
    unusePackage: function (e) {
        this.packageNumData[e.detail.packageType]++;
        this.renewNumLabel();
    },


    initNumLabel: function () {
        for (var i = 0; i < this.numLabel.length; i++) {
            this.numLabel[i] = cc.instantiate(this.numLabelPrefab);
            var numLabel = this.numLabel[i].getComponent(cc.Label);
            numLabel.string = this.packageNumData[i];
        }
    },
    renewNumLabel: function () {
        for (var i = 0; i < this.numLabel.length; i++) {
            var numLabel = this.numLabel[i].getComponent(cc.Label);
            if (numLabel != undefined)
                numLabel.string = this.packageNumData[i];

            this.numLabel[i].active = !(this.packageNumData[i] <= 0);
        }
    },
    initPackage: function () {
        var j;
        this.packageLayer.removeAllChildren();
        for (var i = 0; i < this.packageNumData.length; i++) {
            if (this.packageNumData[i] !== 0) {
                var packageBoxNode = cc.instantiate(this.packageBox);
                this.packageLayer.addChild(packageBoxNode);

                for (j = 0; j < this.packageNumData[i]; j++) {
                    var packageNode = cc.instantiate(this.packagePrefab[i]);
                    packageBoxNode.addChild(packageNode);
                    //packageNode.x = j*2;
                }
                packageBoxNode.addChild(this.numLabel[i]);
                this.numLabel[i].string = this.packageNumData[i];
            }
        }
    },
    getPackageNum: function () {
        var self = this;
        $.ajax({
            url: "/areadly/userCard",
            type: "GET",
            dataType: "json",
            data: {"token": 18},
            success: function (rs) {
                if (rs.status === "200") {
                    cc.log("获取卡包成功");
                    self.connectionSuccess = true;
                    self.packageData = rs.userCardList;
                    Global.userPackageData = rs.userCardList;
                    cc.log(Global.userPackageData);
                    self.packageDataToNum();
                } else {
                    cc.log("获取卡包失败");
                }
            },
            error: function () {
                cc.log("获取卡包错误");
            }
        });
    },
    packageDataToNum: function () {
        var self = this, i;
        for (i = 0; i < self.packageNumData.length; i++) {
            self.packageNumData[i] = 0;
        }
        for (i = 0; i < self.packageData.length; i++) {
            if (self.packageData[i].status === 0) {
                self.packageNumData[self.packageData[i].package_type] ++;
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
    initPrefab: function () {
        var self = this;
        cc.loader.loadResDir("Card/Normal/", cc.Prefab, function (err, prefab) {
            for (var i = 0; i < prefab.length; i++) {
                var newNode = cc.instantiate(prefab[i]);
                var loadScript = newNode.getComponent("Card");
                //Global.cardPrefab[loadScript.cardId] = cc.instantiate(prefab[i]);
                if (loadScript.cardType === 0) {
                    Global.magicCardPrefab[loadScript.cardId] = cc.instantiate(prefab[i]);
                } else {
                    Global.creatureCardPrefab[loadScript.cardId] = cc.instantiate(prefab[i]);
                }
            }
        })
    },
    /**
     * @主要功能 打开一个卡包
     * @author C14
     * @Date 2018/7/24
     * @parameters packageId
     * @returns
     */
    useCardPackage: function (packageType) {
        var self = this;
        for(var i in Global.userPackageData){
            if(Global.userPackageData[i].status === 0 && Global.userPackageData[i].package_type === packageType){
                $.ajax({
                    url: "/areadly/useCardPackage",
                    type: "GET",
                    dataType: "json",
                    data: {
                        "token": Global.token,
                        "packageId":Global.userPackageData[i].id,
                        "packageType":Global.userPackageData[i].package_type
                    },
                    success: function (rs) {
                        if (rs.status === "200") {
                            cc.log("开包成功");
                            cc.log(rs);
                            Global.userPackageData.splice(i,1);
                            //遍历得到的卡牌，按照ID进行初始化，然后保持可以开启查看的姿态
                            for(var j in rs.packageCardList) {
                                var card = cc.instantiate(self.packageCardPrefab);
                                card.getComponent("CardBack").cardId = rs.packageCardList[j].id;
                                card.getComponent("CardBack").init(rs.packageCardList[j].id);
                                self.packageCardListNode.addChild(card);
                            }
                        } else {
                            cc.log("开包失败");
                            cc.log(rs);
                        }
                    },
                    error: function () {
                        cc.log("开包错误");
                    }
                });
                break;
            }
        }
    },
    mainScene: function () {
        setTimeout(function () {
            cc.director.loadScene('MainScene');
        }, 1000);

    }
})
