// Constant.js,用于确定某些全局常量

module.exports = {
    //全场景宽度（单位个数 * 屏幕宽 为 场景宽度）
    sceneWidth: 4,
    //场景边界的单位个数
    sceneEdge:0.5,

    //卡牌使用的Y坐标上界（到了此坐标后卡片虚化）
    cardUseLine:100,
    //手牌最大张数
    handMaxNum:9,
    //魔法卡到了这个边缘就会移动场景的镜头
    magicMoveEdge:200,

    //单位时间，单位长度，单位速度
    unitTime:8,
    unitLength:200,
    unitVelocity:1,

    heroY:-76,
    //生物召唤的默认Y坐标
    summonY:-130,
    //法术的默认Y坐标
    magicY:-50,

    //小地图的长度（像素）
    smallMapLength:440,

    //全局变量，相机坐标
    cameraOffset:0,

    //基地总血量
    totalBaseHealth:300,

    //生物状态的枚举
    stateEnum:cc.Enum({
        none:0,
        freeze:1,
        confine:2,
        burn:3,
        weak:4,
        speedDown:5,
        heal:6,
        //互换生命值与攻击力
        healthAreAtk:7
    }),
    //故事模式所需的的金币
    storyModeNeedMoney:500,
    //卡组的最大卡片数量
    maxDeckCardNum:40,

    fogOpen:true,
    //烟雾开始坐标
    fogStart:1366,
    //烟雾间隔
    fogOffset:50,
    //烟雾结束坐标
    fogEnd:5364,

    fogClearTime:1,
    fogRestoreTime:1,

    fogColliderWidth:100,

    //碰撞框绘制调试模式
    collisionDebugDraw:false,

    jf:[],
};