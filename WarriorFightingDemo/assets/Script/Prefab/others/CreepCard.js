var globalConstant = require("Constant");

cc.Class({
    extends: cc.Component,

    cardID: 0,

    cardType: 0,

    properties: {
        // 这个是枚举，相当的好用啊，以后都用这个好了
        magicType: {
            type: cc.Enum({
                NoTarget: 0,
                AreaTarget: 1,
                DirectionTarget: 2,
            }),
            default: 0
        },

        //攻击力
        attack: 0,
        //攻击力标签
        attackLabel: cc.Label,
        //生命值
        health: 0,
        //生命值标签
        healthLabel: cc.Label,
        //速度
        velocity: 0,
        //速度
        velocityLabel: cc.Label,

        backRoll:cc.Node,
        //是否能够放置的指示器
        indicator:cc.Prefab,

        usableNode:cc.Node,

    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        self.magicTypeEnum = cc.Enum({
            NoTarget: 0,
            AreaTarget: 1,
            DirectionTarget: 2,
        });

        if(self.magicType === self.magicTypeEnum.AreaTarget && self.indicator !== null) {
            self.indicatorNode = cc.instantiate(self.indicator);
            self.indicatorScript = self.indicatorNode.getComponent("CreatureIndicator");
            self.indicatorNode.active = false;
            self.indicatorNode.x = this.node.x;
            self.indicatorNode.y = globalConstant.heroY;
            self.node.parent.parent.addChild(self.indicatorNode);
        }

        self.cardScript = self.node.getComponent('Card');
        this.heroScirpt = this.cardScript.hero.getComponent('Player');
        this.usableScript = this.usableNode.getComponent(cc.Component);

        this.preUse = false;

        self.attackLabel.string = self.attack;
        self.healthLabel.string = self.health;
        self.velocityLabel.string = self.velocity;

        this.startListen();
        // 这个添加监听为测试用
        // self.startListen();
    },
    setHealthTo: function(health){
        var self = this;
        self.health = health;
        self.healthLabel.string = self.health;
    },
    setHealthBy: function(dHealth){
        var self = this;
        self.health += dHealth;
        self.healthLabel.string = self.health;
    },
    setAttackTo: function(attack){
        var self = this;
        self.attack += attack;
        self.attackLabel.string = self.attack;
    },
    setAttackBy: function(dAttack){
        var self = this;
        self.attackLabel.string = self.attack += dAttack;
    },
    /**
     *
     * @param event
     * @constructor
     */
    NoTargetMagicStartListen: function (event) {
        var self = this;
        if (event.getButton() === cc.Event.EventMouse.BUTTON_LEFT)
        {
            console.log("NoTargetMagicStartListen" + event.getLocationX().toFixed(0));
            self.node.on(cc.Node.EventType.MOUSE_MOVE, self.NoTargetMagicMoveListen, self);
            self.node.on(cc.Node.EventType.MOUSE_UP, self.NoTargetMagicEndListen, self);
        }
    },
    /**
     *
     * @param event
     * @constructor
     */
    AreaTargetMagicStartListen: function (event) {
        //console.log("AreaTargetMagicStartListen");

    },
    /**
     *
     * @param event
     * @constructor
     */
    DirectionTargetMagicStartListen: function (event) {
        //console.log("DirectionTargetMagicStartListen");
    },
    /**
     *
     * @param event
     * @constructor
     */
    NoTargetMagicMoveListen: function (event) {
        //console.log("NoTargetCreatureMoveListen" + event.getLocationX().toFixed(0));
        if(this.node.y > globalConstant.cardUseLine && this.preUse === false){

            this.node.opacity = 200;
            this.preUse = true;
        }
        if(this.node.y <= globalConstant.cardUseLine && this.preUse === true){
            this.node.opacity = 1000;
            this.preUse = false;
        }
        // console.log("NoTargetMagicStartListen " + event.getLocationX().toFixed(0) + "," + event.getLocationY().toFixed(0));
    },
    /**
     *
     * @param event
     * @constructor
     */
    AreaTargetMagicMoveListen: function (event) {
        //console.log("AreaTargetMagicMoveListen");
        if(this.preUse === true){
            this.indicatorNode.x = this.node.x;
            this.indicatorScript.changeUsable(this.usableScript.getUseState());
        }
        if(this.node.y > globalConstant.cardUseLine && this.preUse === false){
            this.indicatorNode.active = true;
            this.node.opacity = 200;
            this.preUse = true;
        }
        if(this.node.y <= globalConstant.cardUseLine && this.preUse === true){
            this.indicatorNode.active = false;
            this.node.opacity = 1000;
            this.preUse = false;
        }
    },
    /**
     *
     * @param event
     * @constructor
     */
    DirectionTargetMagicMoveListen: function (event) {
        //console.log("DirectionTargetMagicMoveListen");
    },
    /**
     *
     * @param event
     * @constructor
     */
    NoTargetMagicEndListen: function (event) {
        var self = this;
        if(this.preUse === true && this.usableScript.getUseState() === true) {
            this.heroScirpt.mana -= this.cardScript.manaConsume;
            this.useCard();
        }else{
            this.node.opacity = 1000;
            this.preUse = false;
        }
        self.node.off(cc.Node.EventType.MOUSE_MOVE, self.NoTargetMagicMoveListen, self);
        self.node.off(cc.Node.EventType.MOUSE_UP, self.NoTargetMagicEndListen, self);
    },
    /**
     *
     * @param event
     * @constructor
     */
    AreaTargetMagicEndListen: function (event) {
        //console.log("AreaTargetMagicEndListen");
        // this.node.removeFromParent();
        if(this.preUse === true && this.usableScript.getUseState() === true) {
            this.heroScirpt.mana -= this.cardScript.manaConsume;
            this.indicatorNode.active = false;
            this.useCard();
        }else{
            this.indicatorNode.active = false;
            this.node.opacity = 1000;
            this.preUse = false;
        }
    },
    /**
     *
     * @param event
     * @constructor
     */
    DirectionTargetMagicEndListen: function (event) {
        //console.log("DirectionTargetMagicEndListen");
    },

    useCard: function(){
        var eventsend = new cc.Event.EventCustom('creatureCreate',true);
        var position = 0;
        if(this.magicType === 0){
            position = cc.director.getWinSize().width * globalConstant.sceneWidth / 2 *
                (1 + this.cardScript.team/Math.abs(this.cardScript.team))
        }else if(this.magicType === 1){
            position = this.node.x + globalConstant.cameraOffset +
                cc.director.getWinSize().width * globalConstant.sceneEdge;
        }

        eventsend.setUserData({
            X:position,
            Y:null,
            attack:this.attack,
            health:this.health,
            team:this.cardScript.team,
            id:this.cardScript.cardID,
            velocity:this.velocity,
            battleCry:true
        });
        this.node.dispatchEvent(eventsend);

        this.cardScript.drawCardScript.deleteCard(this.node);
    },

    // 开启监听的位置，不过嘛，后面还得改，这里先搭个模子，至少保证功能正常
    startListen: function () {
        var self = this;
        console.log("add listen");
        switch (self.magicType) {
            case 0:
                self.node.on(cc.Node.EventType.MOUSE_DOWN, self.NoTargetMagicStartListen, self);
                self.node.on(cc.Node.EventType.MOUSE_MOVE, self.NoTargetMagicMoveListen, self);
                self.node.on(cc.Node.EventType.MOUSE_UP, self.NoTargetMagicEndListen, self);
                break;
            case 1:
                self.node.on(cc.Node.EventType.MOUSE_DOWN, self.AreaTargetMagicStartListen, self);
                self.node.on(cc.Node.EventType.MOUSE_MOVE, self.AreaTargetMagicMoveListen, self);
                self.node.on(cc.Node.EventType.MOUSE_UP, self.AreaTargetMagicEndListen, self);
                break;
            case 2:
                self.node.on(cc.Node.EventType.MOUSE_DOWN, self.DirectionTargetMagicStartListen, self);
                self.node.on(cc.Node.EventType.MOUSE_MOVE, self.DirectionTargetMagicMoveListen, self);
                self.node.on(cc.Node.EventType.MOUSE_UP, self.DirectionTargetMagicEndListen, self);
                break;
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});