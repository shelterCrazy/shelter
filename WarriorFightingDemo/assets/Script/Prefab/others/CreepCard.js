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

    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        self.magicTypeEnum = cc.Enum({
            NoTarget: 0,
            AreaTarget: 1,
            DirectionTarget: 2,
        });

        self.cardScript = self.node.getComponent('Card');
        this.heroScirpt = this.cardScript.hero.getComponent('Player');

        this.preUse = false;

        self.attackLabel.string = self.attack;
        self.healthLabel.string = self.health;
        self.velocityLabel.string = self.velocity;
        //this.cScript = null;
        if(self.cardScript.cardType === 0){
            this.cScript = self.node.getComponent('M' + self.cardScript.cardID);
        }else{
            this.cScript = self.node.getComponent('C' + self.cardScript.cardID);
        }

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
        if (event.getButton() === cc.Event.EventMouse.BUTTON_LEFT)
        {
            console.log("NoTargetMagicStartListen" + event.getLocationX().toFixed(0));
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
        //console.log("NoTargetMagicEndListen");
        if(this.preUse === true && this.cScript.getUseState() === true) {
            this.heroScirpt.mana -= this.cardScript.manaConsume;
            this.cScript.useCard();
        }else{
            this.node.opacity = 1000;
        }
    },
    /**
     *
     * @param event
     * @constructor
     */
    AreaTargetMagicEndListen: function (event) {
        //console.log("AreaTargetMagicEndListen");
        // this.node.removeFromParent();
    },
    /**
     *
     * @param event
     * @constructor
     */
    DirectionTargetMagicEndListen: function (event) {
        //console.log("DirectionTargetMagicEndListen");
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