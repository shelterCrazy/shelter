/**
 * @主要功能 选择英雄和卡组的管理器
 * @author C14
 * @Date 2018/10/5
 * @parameters
 * @returns
 */
var Global = require("Global");
cc.Class({
    extends: cc.Component,

    properties: {
        //现在所处的位置
        nowLayer:{
            type:cc.Enum({
                None:99,
                ModeSelect:0,
                StageSelect:1,
                GameSelect:2,
                HeroSelect:3,
                DeckSelect:4,
                PracticeMode:5
            }),
            default:99
        },
        _nowMode:0,
        //英雄查看选择节点
        effectButtonNode:cc.Node,

        cameraNode:cc.Node,

        matchManager:cc.Node,

        mainSceneManager:cc.Node,

        modeSelectButtonLayer:cc.Node,

        //关卡选择的按钮位置层
        stageSelectButtonPositionLayer:cc.Node,
        stageSelectLineLayer:cc.Node,
        stageSelectButtonLayer:cc.Node,
        stageSelectButtonPrefab:cc.Prefab,

        //小游戏选择的按钮位置层
        smallGameNode:cc.Node,
        smallGamePage:0,
        smallGamePositionLayer:cc.Node,
        smallGameButtonLayer:cc.Node,
        smallGameButtonPrefab:cc.Prefab,
        smallGameMaxPage: 3,
        leftPageButton:cc.Node,
        rightPageButton:cc.Node,
        pageLabel:cc.Label,
        pageIndicationNode:cc.Node,
        pageIndicationPrefab:cc.Prefab,

        backNode:cc.Node,

        selectManager:cc.Node,

        background:cc.Node,

        _route:-1
    },

    onLoad :function(){
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.nowLayer = 99;
        this.smallGameNode.active = false;
        this.node.active = false;
        this.node.on("selectStage",function(data){
            var num = data.detail.num;
            if(this.nowLayer === 1) {
                for (var i in this.stageSelectButtonLayer.children) {
                    if (i !== num) {
                        this.stageSelectButtonLayer.children[i].runAction(
                            cc.scaleTo(1, 0, 0).easing(cc.easeCubicActionOut())
                        )
                    }
                }
                this.ctx.clear();
            }else if(this.nowLayer === 2) {
                for (var i in this.smallGameButtonLayer.children) {
                    if (i === num) {
                        this.smallGameButtonLayer.children[i].runAction(
                            cc.scaleTo(1, 1.1, 1.1).easing(cc.easeCubicActionOut())
                        )
                    }
                }
            }
        }.bind(this));

        this.node.on("unSelectStage",function(data){
            var num = data.detail.num;
            if(this.nowLayer === 1) {
                for (var i in this.stageSelectButtonLayer.children) {
                    if (i !== num) {
                        this.stageSelectButtonLayer.children[i].runAction(
                            cc.scaleTo(1, 1, 1).easing(cc.easeCubicActionOut())
                        )
                    }
                }
                this.fastDrawLine();
            }else if(this.nowLayer === 2) {
                for (var i in this.smallGameButtonLayer.children) {
                    if (i === num) {
                        this.smallGameButtonLayer.children[i].runAction(
                            cc.scaleTo(1, 1, 1).easing(cc.easeCubicActionOut())
                        )
                    }
                }
            }
        }.bind(this));

        this.node.on("mouseDownSelectStage",function(data){
            var num = data.detail.num;
                if(this.nowLayer === 1) {
                    for (var i in this.stageSelectButtonLayer.children) {
                        this.stageSelectButtonLayer.children[i].runAction(
                            cc.sequence(
                                cc.scaleTo(0, 1, 1).easing(cc.easeCubicActionOut()),
                                cc.scaleTo(1, 0, 0).easing(cc.easeCubicActionOut())
                            )
                        )
                    }
                    this.ctx.clear();
                    this.selectManager.getComponent("SelectManager").antiActive();
                    this.node.stopAllActions();
                    this.node.runAction(cc.moveTo(1, -1920, 0).easing(cc.easeCubicActionOut()));
                    this.nowLayer = 3;
                }else if(this.nowLayer === 2) {
                    for (var i in this.smallGameButtonLayer.children) {
                        this.smallGameButtonLayer.children[i].runAction(
                            cc.sequence(
                                cc.scaleTo(0, 1, 1).easing(cc.easeCubicActionOut()),
                                cc.scaleTo(1, 0, 0).easing(cc.easeCubicActionOut())
                            )
                        )
                    }
                    this.selectManager.getComponent("SelectManager").antiActive();
                    this.node.stopAllActions();
                    this.node.runAction(cc.moveTo(1, -1920, 0).easing(cc.easeCubicActionOut()));
                    this.nowLayer = 3;
                }
        }.bind(this));


        //cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },

    //onEnable:function(){
    //    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    //},
    onKeyDown: function (event) {
        cc.log("??");
        switch (event.keyCode) {
            case cc.KEY.escape:
                this.back();
                break;
        }
    },
    reloadHero:function(){
        var script = this.heroViewNode.getComponent("HeroSelectManager");
        var temp = script._select;
        if(Global.heroNum !== -1){
            script._select = true;
            script.changeHeroSelect(null, Global.heroNum);
            script._select = temp;
        }
    },
    reloadDeck:function(){
        var script = this.deckViewNode.getComponent("DeckSelectManager");
        var temp = script._select;
        if(Global.nowDeckNum !== -1){
            script._select = true;
            script.selectDeck(null, Global.nowDeckNum);
            script._select = temp;
        }
    },

    back:function(){
        cc.log(this.nowLayer);
        switch(this.nowLayer){
            case 0:
                this.antiActive();
                this.effectButtonNode.getComponent("EffectButton").come();
                this.cameraNode.getComponent("CameraControl").followTarget(null,1);
                this.nowLayer = 99;
                break;
            case 1:
            case 2:
            case 5:
                for(var i in this.modeSelectButtonLayer.children){
                    this.modeSelectButtonLayer.children[i].stopAllActions();
                    this.modeSelectButtonLayer.children[i].getComponent("SpacialRotateEffect").unlockRotation();
                    this.modeSelectButtonLayer.children[i].runAction(
                        cc.spawn(
                            cc.moveTo(0.6,- 500 + 500 * i,0).easing(cc.easeCubicActionOut()),
                            cc.scaleTo(0.5,1).easing(cc.easeCubicActionOut()),
                            cc.fadeIn(0.4)
                        )
                    );
                }
                if(this.ctx !== undefined){
                    this.ctx.clear();
                }
                this.stageSelectButtonLayer.removeAllChildren();
                this.smallGameButtonLayer.removeAllChildren();
                this.pageIndicationNode.removeAllChildren();
                this.nowLayer = 0;
                this.cameraNode.getComponent("CameraControl").followTarget(null,4);
                this.smallGameNode.active = false;
                break;
            case 3:
                //如果到达了卡组选择界面的话，那么返回到角色选择的状态
                if(this.selectManager.getComponent("SelectManager").nowLayer === 1){
                    this.selectManager.getComponent("SelectManager").changePosition(null, 0);
                }else{
                    //否则还原
                    //如果是在故事模式
                    if(Global.nowGameMode === 0) {
                        for (var i in this.stageSelectButtonLayer.children) {
                            this.stageSelectButtonLayer.children[i].runAction(
                                cc.scaleTo(1, 1, 1).easing(cc.easeCubicActionOut())
                            )
                        }
                        this.fastDrawLine();
                        this.node.stopAllActions();
                        this.node.runAction(cc.moveTo(1, 0, 0).easing(cc.easeCubicActionOut()));
                        this.selectManager.getComponent("SelectManager").antiActive();
                        this.nowLayer = 1;
                    //如果是在练习模式
                    }else if(Global.nowGameMode === 1) {
                        this.node.stopAllActions();
                        this.node.runAction(cc.moveTo(1, 0, 0).easing(cc.easeCubicActionOut()));
                        this.selectManager.getComponent("SelectManager").antiActive();
                        this.nowLayer = 5;
                        this.back();
                    //如果是在小游戏模式
                    }else if(Global.nowGameMode === 2) {
                        this.renewSmallGameLayout(1);
                        this.node.stopAllActions();
                        this.node.runAction(cc.moveTo(1, 0, 0).easing(cc.easeCubicActionOut()));
                        this.selectManager.getComponent("SelectManager").antiActive();
                        this.nowLayer = 2;
                    }
                }
                break;
        }
    },

    modeSelect:function(targetNum,customEventData){

        //如果当前的层是模式选择层那么有效
        if(this.nowLayer === 0) {

            Number(customEventData);

            for(var i in this.modeSelectButtonLayer.children){
                if(i === customEventData){
                    this.modeSelectButtonLayer.children[i].runAction(
                        cc.spawn(
                            cc.moveTo(0.6,- 960 + 220,0).easing(cc.easeCubicActionOut()),
                            cc.scaleTo(0.5,0.8).easing(cc.easeCubicActionOut())
                        )
                    );
                }else{
                    this.modeSelectButtonLayer.children[i].runAction(
                        cc.fadeOut(0.1)
                    );
                }
            }
            switch (customEventData * 1) {
                //0的话是故事模式
                case 0:this.nowLayer = 1;
                    Global.nowGameMode = 0;
                    this.cameraNode.getComponent("CameraControl").followTarget(null,5);
                    this.ctx = this.stageSelectLineLayer.getComponent(cc.Graphics);
                    var data = 0;
                    for(var i in this.stageSelectButtonPositionLayer.children) {
                        var stageSelectNode = cc.instantiate(this.stageSelectButtonPrefab);
                        stageSelectNode.getComponent("StoryStage").num = i;
                        stageSelectNode.position = this.stageSelectButtonPositionLayer.children[i].position;
                        stageSelectNode.scale = cc.v2(0, 0);
                        this.stageSelectButtonLayer.addChild(stageSelectNode);
                        stageSelectNode.runAction(
                            cc.sequence(
                                cc.delayTime(0.02 * i + 0.3),
                                cc.callFunc(function(position){
                                    cc.log(data);
                                    if(data <= 12){
                                        if(data > 0) {
                                            this.ctx.moveTo(
                                                this.stageSelectButtonPositionLayer.children[data - 1].position.x,
                                                this.stageSelectButtonPositionLayer.children[data - 1].position.y
                                            );
                                            this.ctx.lineTo(position.x, position.y);
                                            this.ctx.stroke();
                                        }
                                    }
                                    data ++;
                                }.bind(this),this,stageSelectNode.position),
                                cc.scaleTo(0.7,1,1).easing(cc.easeCubicActionOut())
                            )
                        );
                    }

                    break;
                //1的话是练习模式，练习模式的话是可以直接开始的
                case 1:
                    Global.nowGameMode = 1;
                    //this.nowLayer = 5;
                    this.cameraNode.getComponent("CameraControl").followTarget(null,6);
                    this.selectManager.getComponent("SelectManager").antiActive();
                    //this.node.stopAllActions();
                    this.node.runAction(cc.moveTo(1, -1920, 0).easing(cc.easeCubicActionOut()));
                    this.nowLayer = 3;
                    break;
                //2的话是小游戏
                case 2:this.nowLayer = 2;
                    Global.nowGameMode = 2;
                    this.cameraNode.getComponent("CameraControl").followTarget(null,6);
                    this.smallGameNode.active = true;
                    this.pageLabel.node.scale = cc.v2(0, 0);
                    this.pageLabel.string = this.smallGamePage + 1 + "/" + this.smallGameMaxPage;
                    this.pageLabel.node.runAction(
                        cc.sequence(
                            cc.delayTime(1.8),
                            cc.scaleTo(0.4, 1, 1).easing(cc.easeCubicActionOut())
                        )
                    );
                    for(i = 0;i < this.smallGameMaxPage; i ++) {
                        var indicationNode = cc.instantiate(this.pageIndicationPrefab);
                        indicationNode.getComponent("PageIndication").num = i;
                        this.pageIndicationNode.addChild(indicationNode);
                        indicationNode.getComponent("PageIndication").switchState(i === this.smallGamePage,i * 0.1 + 1.5);
                    }
                    for(i = 0;i < this.smallGameMaxPage * 10; i++) {
                        var gameSelectNode = cc.instantiate(this.smallGameButtonPrefab);
                        gameSelectNode.getComponent("StoryStage").num = (i % 10);
                        gameSelectNode.getComponent("StoryStage").storyName = i;
                        gameSelectNode.position = this.smallGamePositionLayer.children[i % 10].position;
                        gameSelectNode.scale = cc.v2(0, 0);
                        this.smallGameButtonLayer.addChild(gameSelectNode);
                        if(i < this.smallGamePage * 10 + 10 && i >= this.smallGamePage) {
                            gameSelectNode.runAction(
                                cc.sequence(
                                    cc.delayTime(0.1 * (i % 5) + 1.1),
                                    cc.scaleTo(0.4, 1, 1).easing(cc.easeCubicActionOut())
                                )
                            );
                        }
                    }
                    break;
            }
        }
    },
    smallGameTurnPage:function(targetNum,customEventData){
        var num = Number(customEventData);
        if(this.smallGamePage + num <= 0){
            this.leftPageButton.active = false;
        }else{
            this.leftPageButton.active = true;
        }
        if(this.smallGamePage + num >= this.smallGameMaxPage - 1){
            this.rightPageButton.active = false;
        }else{
            this.rightPageButton.active = true;
        }
        this.smallGamePage += num;
        this.pageLabel.string = this.smallGamePage + 1 + "/" + this.smallGameMaxPage;
        for(var i = 0;i < this.pageIndicationNode.children.length; i ++) {
            this.pageIndicationNode.children[i].getComponent("PageIndication").switchState(
                i === this.smallGamePage,
                0
            );
        }
        this.renewSmallGameLayout(num);
    },
    renewSmallGameLayout:function(position){
        for(var i in this.smallGameButtonLayer.children) {
            this.smallGameButtonLayer.children[i].stopAllActions();
            this.smallGameButtonLayer.children[i].scale = cc.v2(0, 0);
            if(i < this.smallGamePage * 10 + 10 && i >= this.smallGamePage * 10) {
                this.smallGameButtonLayer.children[i].runAction(
                    cc.sequence(
                        cc.delayTime(position < 0 ? 0.1 * (i % 5): 0.1 * (4 - i % 5)),
                        cc.scaleTo(0.4, 1, 1).easing(cc.easeCubicActionOut())
                    )
                );
            }
        }
    },

    antiActive:function(){
        //this.heroViewNode.getComponent("HeroSelectManager").selectEnable(!this.node.active);
        //this.mainSceneManager.getComponent("MainSceneManager").lockHero(!this.node.active);
        this.node.stopAllActions();

        if(!this.node.active){
            //循环并且播放按钮的动画效果
            for(var i in this.modeSelectButtonLayer.children){
                this.modeSelectButtonLayer.children[i].opacity = 0;
                this.modeSelectButtonLayer.children[i].x = - 500 + 500 * i;
                this.modeSelectButtonLayer.children[i].x += 400;
                this.modeSelectButtonLayer.children[i].runAction(
                    cc.sequence(
                        cc.delayTime(i * 0.1 + 1.3),
                        cc.fadeIn(0.02),
                        cc.moveTo(
                            0.8,
                            this.modeSelectButtonLayer.children[i].x - 400,
                            this.modeSelectButtonLayer.children[i].y
                        ).easing(cc.easeQuadraticActionOut())
                    )
                );
            }
            this.nowLayer = 0;
            //如果是未显示的状态的话，那么使其显示出来
            this.node.active = !this.node.active;
            this.node.opacity = 255;
            this.backNode.active = !this.backNode.active;
            this.backNode.runAction(cc.fadeIn(0.7).easing(cc.easeCubicActionOut()));
            this.background.runAction(
                cc.sequence(
                    cc.fadeIn(1).easing(cc.easeCubicActionOut()),
                    cc.callFunc(function(){
                        this._route = 0;
                    }.bind(this))
                )
            );
        }else{
            this.backNode.runAction(cc.fadeOut(0.7).easing(cc.easeCubicActionOut()));
            this.node.runAction(
                cc.sequence(
                    cc.fadeOut(0.7).easing(cc.easeCubicActionOut()),
                    cc.callFunc(function(){
                        this._route = -1;
                        this.node.active = !this.node.active;
                        this.backNode.active = false;
                    }.bind(this))
                )
            );
        }
    },
    fastDrawLine:function(){
        for(var i in this.stageSelectButtonPositionLayer.children) {
            if(i <= 12){
                if(i > 0) {
                    this.ctx.moveTo(
                        this.stageSelectButtonPositionLayer.children[i - 1].position.x,
                        this.stageSelectButtonPositionLayer.children[i - 1].position.y
                    );
                    this.ctx.lineTo(
                        this.stageSelectButtonPositionLayer.children[i].position.x,
                        this.stageSelectButtonPositionLayer.children[i].position.y);
                    this.ctx.stroke();
                }
            }
        }
    },
    changePosition:function(event, customEventData) {

        var num = Number(customEventData);
        //如果选择了故事模式的话
        if (Global.nowGameMode === 0){
            this.selectManager.getComponent("SelectManager").changePosition(null, customEventData);

            //如果选择了练习模式的话
        }else if(Global.nowGameMode === 1){


            //如果选择了小游戏的话
        }else if(Global.nowGameMode === 2){
            this.selectManager.getComponent("SelectManager").changePosition(null, customEventData);
            switch (this.nowLayer) {
                case 3:
                    break;
                case 4:
                    break;
            }
        }
    },


    // update (dt) {},
});
