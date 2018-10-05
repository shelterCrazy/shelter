/**
 * @主要功能 用于播放音乐
 * @author C14
 * @Date 2018/10/5
 * @parameters
 * @returns
 */
var Global = require("Global");
cc.Class({
    extends: cc.Component,

    properties: {
        selectedSoundEffect:{
            url:cc.AudioClip,
            default:null
        },
        unselectedSoundEffect:{
            url:cc.AudioClip,
            default:null
        }
    },

    playPressEffect:function(){
        cc.audioEngine.play(
            this.selectedSoundEffect,
            false,
            Global.mainEffectVolume * Global.mainVolume
        );
    },
    playReleaseEffect:function(){
        cc.audioEngine.play(
            this.unselectedSoundEffect,
            false,
            Global.mainEffectVolume * Global.mainVolume
        );
    }
});
