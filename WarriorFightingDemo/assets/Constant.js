// Constant.js,用于确定某些全局常量

module.exports = {
    sceneWidth: 3,
    sceneEdge:0.5,

    cardUseLine:100,

    unitTime:8,
    unitLength:200,
    unitVelocity:1,

    summonY:-130,
    //吟唱魔法的Y坐标
    magicY:-50,

    smallMapLength:440,

    cameraOffset:0,

    stateEnum:cc.Enum({
        none:0,
        freeze:1,
        confine:2,
        burn:3,
        weak:4,
        speedDown:5,
        heal:6
    }),

    jf:[],
};