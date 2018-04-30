// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var globalConstant = require("Constant");
cc.Class({
    extends: cc.Component,

    properties: {

        outTargets:[cc.Node],
        //对象目标的类型
        enemyCreature:false,
        enemyHero:false,
        enemyTower:false,
        enemyBase:false,

        friendlyCreature:false,
        friendlyHero:false,
        friendlyTower:false,
        friendlyBase:false,
        //是否包含自己
        selfTarget:false,

        //生命值是否限制
        healthRangeSwitch:false,
        healthRangeMax:-1,
        healthRangeMin:-1,
        healthMaxSwitch:false,
        healthMinSwitch:false,

        attackRangeSwitch:false,
        attackRangeMax:-1,
        attackRangeMin:-1,
        attackMaxSwitch:false,
        attackMinSwitch:false,

        speedRangeSwitch:false,
        speedRangeMax:-1,
        speedRangeMin:-1,

        speedMaxSwitch:false,
        speedMinSwitch:false,

        //高度范围
        heightRangeSwitch:false,
        heightRangeMax:-1,
        heightRangeMin:-1,

        heightMaxSwitch:false,
        heightMinSwitch:false,

        N:true,
        R:true,
        SR:true,
        SSR:true,

        raceSwitch:false,
        races:[cc.Boolean],

        //从一个坐标到另一个坐标，对称，相对于敌方友方对称，以己方出生点为0，对手的为最末端
        areaRangeSwitch:false,
        areaRangeMax:-1,
        areaRangeMin:-1,

        //around附近范围开关，如果在周围的坐标则发挥效果
        aroundRangeSwitch:false,
        //是否取反
        aroundAnti:false,
        aroundRangeMax:-1,
        aroundRangeMin:-1,
    },

    onload:function(){




    },
    // LIFE-CYCLE CALLBACKS:
    /**
     * @主要功能 获取满足要求的发动对象
     * @author C14
     * @Date 2018/1/17
     * @parameters targets
     * @returns 返回一个对象组
     */
    isEffectEnable:function(targets){

        var skillScript = this.node.parent.parent.getComponent("Skill");
        var creatureScript = null;
        var selfObjectScript = skillScript.selfObjectScript;
        var enemyUnit = [this.enemyCreature,this.enemyHero,this.enemyTower,this.enemyBase];
        var friendlyUnit = [this.friendlyCreature,this.friendlyHero,this.friendlyTower,this.friendlyBase];
        var unitRarity = [this.N,this.R,this.SR,this.SSR];
        //raritySwitch
        this.outTargets = [];
        for(var i = 0; i < targets.length; i++){
            this.outTargets[i] = null;
        }
        this.outTargets = targets.slice();
        cc.log(targets);
        cc.log(this.outTargets);
        //for(var i = 0; i < targets.length; i++) {
        //    this.outTargets[i] = targets[i];//JSON.parse(JSON.stringify(targets[i]));
        //}

        //cc.log(this.outTargets);
        var num = 0;
        //cc.log("结果输出数量1:" + this.outTargets.length);
        for(i = 0; i < targets.length; i++){

            var script = targets[i].getComponent("Unit");
            if(script.death === true){
                this.outTargets.splice(i - num, 1);
                num ++;
                continue;
            }

            //cc.log("unitType" + script.team/Math.abs(script.team) + "unitType2" + selfObjectScript.team/Math.abs(selfObjectScript.team));
            //友军，敌军：用以判断单位是否正确
            if(script.team/Math.abs(script.team) === selfObjectScript.team/Math.abs(selfObjectScript.team)){

                if(this.selfTarget === true) {
                    if (friendlyUnit[script.unitType] !== true && this.outTargets[i] !== selfObjectScript.node) {
                        this.outTargets.splice(i - num, 1);
                        num ++;
                        continue;
                    }
                }else {
                    if (friendlyUnit[script.unitType] !== true || this.outTargets[i] === selfObjectScript.node) {
                        this.outTargets.splice(i - num, 1);
                        num ++;
                        continue;
                    }
                }
            }else{
                if(enemyUnit[script.unitType] !== true){
                    this.outTargets.splice(i - num,1);
                    num ++;
                    continue;
                }
            }

            if(this.healthRangeSwitch === true){
                if( script.health > this.healthRangeMax || script.health < this.healthRangeMin){
                    this.outTargets.splice(i - num,1);
                    num ++;
                    continue;
                }
            }
            if(this.attackRangeSwitch === true){
                if( script.attack > this.attackRangeMax || script.attack < this.attackRangeMin){
                    this.outTargets.splice(i - num,1);
                    num ++;
                    continue;
                }
            }
            if(this.speedRangeSwitch === true){
                if( script.node.getContentSize().height > this.speedRangeMax || script.node.getContentSize().height < this.speedRangeMin){
                    this.outTargets.splice(i - num,1);
                    num ++;
                    continue;
                }
            }
            if(this.heightRangeSwitch === true){
                if( script.speed > this.heightRangeMax || script.speed < this.heightRangeMin){
                    this.outTargets.splice(i - num,1);
                    num ++;
                    continue;
                }
            }

            if(script.unitType === 0){
                creatureScript = targets[i].getComponent("Creature");
                //稀有度的判断
                if (unitRarity[creatureScript.rarity] !== true) {
                    this.outTargets.splice(i - num, 1);
                    num ++;
                    continue;
                }
            }

            if(script.raceSwitch === true){
                creatureScript = targets[i].getComponent("Unit");
                //种族的判断
                if (race[creatureScript.rarity] !== true) {
                    this.outTargets.splice(i - num, 1);
                    num ++;
                    continue;
                }
            }
            if(this.areaRangeSwitch === true){
                if(this.areaRangeMax === -1){
                    this.areaRangeMax = Number.POSITIVE_INFINITY;
                }
                if(this.areaRangeMin === -1){
                    this.areaRangeMin = Number.NEGATIVE_INFINITY;
                }
                if ( targets[i].x >= this.areaRangeMax || targets[i].x <= this.areaRangeMin) {
                    this.outTargets.splice(i - num, 1);
                    num ++;
                    continue;
                }
            }
            if(this.aroundRangeSwitch === true){
                if(this.aroundRangeMax === -1){
                    this.aroundRangeMax = Number.POSITIVE_INFINITY;
                }
                if(this.aroundRangeMin === -1){
                    this.aroundRangeMin = Number.NEGATIVE_INFINITY;
                }
                if ( Math.abs(selfObjectScript.node.x - script.node.x) >= this.aroundRangeMax ||
                    Math.abs(selfObjectScript.node.x - script.node.x) <= this.aroundRangeMin) {
                    this.outTargets.splice(i - num, 1);
                    num ++;
                }
            }
        }

        if(this.healthMaxSwitch === true){
            var dat = 0;
            for(i = 1;i < this.outTargets.length; i++){
                var script1 = this.outTargets[i].getComponent("Unit");
                var script2 = this.outTargets[dat].getComponent("Unit");
                if(script1.health > script2.health){
                    dat = i;
                }
            }
            this.outTargets = this.outTargets.splice(dat,1);
        }else if(this.healthMinSwitch === true){
            dat = 0;
            for(i = 1;i < this.outTargets.length; i++){
                script1 = this.outTargets[i].getComponent("Unit");
                script2 = this.outTargets[dat].getComponent("Unit");
                if(script1.health < script2.health){
                    dat = i;
                }
            }
            this.outTargets = this.outTargets.splice(dat,1);
        }
        if(this.speedMaxSwitch === true){
            dat = 0;
            for(i = 1;i < this.outTargets.length; i++){
                script1 = this.outTargets[i].getComponent("Unit");
                script2 = this.outTargets[dat].getComponent("Unit");
                if(script1.speed > script2.speed){
                    dat = i;
                }
            }
            this.outTargets = this.outTargets.splice(dat,1);
        }else if(this.speedMinSwitch === true){
            dat = 0;
            for(i = 1;i < this.outTargets.length; i++){
                script1 = this.outTargets[i].getComponent("Unit");
                script2 = this.outTargets[dat].getComponent("Unit");
                if(script1.speed < script2.speed){
                    dat = i;
                }
            }
            this.outTargets = this.outTargets.splice(dat,1);
        }
        if(this.heightMaxSwitch === true){
            dat = 0;
            for(i = 1;i < this.outTargets.length; i++){
                script1 = this.outTargets[i].getComponent("Unit");
                script2 = this.outTargets[dat].getComponent("Unit");
                if(script1.node.getContentSize().height > script2.node.getContentSize().height){
                    dat = i;
                }
            }
            this.outTargets = this.outTargets.splice(dat,1);
        }else if(this.heightMinSwitch === true){
            dat = 0;
            for(i = 1;i < this.outTargets.length; i++){
                script1 = this.outTargets[i].getComponent("Unit");
                script2 = this.outTargets[dat].getComponent("Unit");
                if(script1.node.getContentSize().height < script2.node.getContentSize().height){
                    dat = i;
                }
            }
            this.outTargets = this.outTargets.splice(dat,1);
        }
        if(this.attackMaxSwitch === true){
            dat = 0;
            for(i = 1;i < this.outTargets.length; i++){
                script1 = this.outTargets[i].getComponent("Unit");
                script2 = this.outTargets[dat].getComponent("Unit");
                if(script1.attack > script2.attack){
                    dat = i;
                }
            }
            this.outTargets = this.outTargets.splice(dat,1);
        }else if(this.attackMinSwitch === true){
            dat = 0;
            for(i = 1;i < this.outTargets.length; i++){
                script1 = this.outTargets[i].getComponent("Unit");
                script2 = this.outTargets[dat].getComponent("Unit");
                if(script1.attack < script2.attack){
                    dat = i;
                }
            }
            this.outTargets = this.outTargets.splice(dat,1);
        }
        //cc.log("结果输出数量2:" + this.outTargets.length);
        return this.outTargets;
    },

    releaseFunction:function(){}
    // onLoad () {},

    // update (dt) {},
});
