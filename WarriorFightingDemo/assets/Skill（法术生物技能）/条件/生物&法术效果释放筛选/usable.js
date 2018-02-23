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
        //属性
        target:{
            type:cc.Enum({
                //生命值
                health:0,
                //攻击力
                attack:1,
                //移动速度
                velocity:2,
                //稀有度
                rarity:3,
                //种族
                race:4,
                //区域
                area:5,
                //附近
                around:6
            }),
            default:0
        },
        ////对于数据处理的类型
        //dataType:{
        //    type:cc.Enum({
        //        //数值范围
        //        range:0,
        //        //具体数值
        //        num:1,
        //    }),
        //    default:0
        //},

        anti:false,
        //最大值，-1表示未定义
        max:{
            type:cc.Integer,
            default:-1
        },
        //最小值，-1表示未定义
        min:{
            type:cc.Integer,
            default:-1
        },
    },

    onload:function(){
        if(this.max === -1){
            this.max = Number.POSITIVE_INFINITY;
        }
        if(this.min === -1){
            this.min = Number.NEGATIVE_INFINITY;
        }
    },
    // LIFE-CYCLE CALLBACKS:
    /**
     * @主要功能 获取发动对象是否满足要求
     * @author C14
     * @Date 2018/1/17
     * @parameters
     * @returns 返回true表示有效 否则表示无效
     */
    isEffectEnable:function(creatureScript){
        var enumDat = cc.Enum({
            //生命值
            health:0,
            //攻击力
            attack:1,
            //移动速度
            velocity:2,
            //稀有度
            rarity:3,
            //种族
            race:4,
            //区域
            area:5,
            //附近
            around:6
        });
        switch (this.target){
            case enumDat.health:
                if(creatureScript.health >= this.min && creatureScript.health <= this.max){
                    return !this.anti;
                }else  return this.anti;
                break;
            case enumDat.attack:
                if(creatureScript.attack >= this.min && creatureScript.attack <= this.max){
                    return !this.anti;
                }else  return this.anti;
                break;
            case enumDat.velocity:
                if(creatureScript.velocity >= this.min && creatureScript.velocity <= this.max){
                    return !this.anti;
                }else  return this.anti;
                break;
            case enumDat.rarity:
                if(creatureScript.rarity >= this.min && creatureScript.rarity <= this.max){
                    return !this.anti;
                }else  return this.anti;
                break;
            case enumDat.race:
                if(creatureScript.race >= this.min && creatureScript.race <= this.max){
                    return !this.anti;
                }else  return this.anti;
                break;
            case enumDat.area:
                if(creatureScript.node.x >= this.min && creatureScript.node.x <= this.max){
                    return !this.anti;
                }else  return this.anti;
                break;
            case enumDat.around:
                var dat = Math.abs(creatureScript.node.x - this.node.parent.parent.x);
                if(dat <= this.max * globalConstant.unitLength){
                    return !this.anti;
                }else  return this.anti;
                break;
        }


    },

    releaseFunction:function(){},
    // onLoad () {},

    // update (dt) {},
});
