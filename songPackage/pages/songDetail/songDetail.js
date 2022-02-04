import PubSub from 'pubsub-js'
import request from '../../../utils/request'
import dayjs from 'dayjs'
//获取全局实例
const appInstance = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlay: false, //音乐是否播放
        song: {}, //歌曲详情对象
        musicId: '', //音乐id
        musicLink: '', //音乐的链接
        currentTime: '00.00', // 实时时间
        durationTime: '00.00', // 总时长
        currentWidth: 0, //实时进度条的宽度
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //options: 用于接收路由跳转的query参数
        // console.log(JSON.parse(options.song))
        let musicId = options.musicId
        this.setData({
            musicId
        })
        //判断当前页面音乐是否在播放
        if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
            // 修改当前页面音乐播放状态为true
            this.setData({
                isPlay: true
            })
        }
        this.getMusicInfo(musicId)
        //创建控制音乐的实例对象
        this.BackgroundAudioManager = wx.getBackgroundAudioManager()
        //监视音乐播放/暂停/停止
        this.BackgroundAudioManager.onPlay(() => {
            this.changePlayState(true)
            //修改全局音乐播放的状态
            appInstance.globalData.musicId = musicId
        })
        this.BackgroundAudioManager.onPause(() => {
            this.changePlayState(false)
        })
        this.BackgroundAudioManager.onStop(() => {
            this.changePlayState(false)
        })
        //监视音乐播放自然结束
        this.BackgroundAudioManager.onEnded(() => {
            //订阅来自recommendSong页面发布的musicId消息，自己写的，且取消订阅放到了最前面
            PubSub.subscribe('musicId', (_, musicId) => {
                //取消订阅
                PubSub.unsubscribe('musicId')
                //获取音乐详细信息
                this.getMusicInfo(musicId)
                //自动播放当前音乐
                this.musicControl(true, musicId)
            })
            //自动切换至下一首音乐，并自动播放
            PubSub.publish('switchType', 'next')
            //将实时进度条和实时时间还原为0
            this.setData({
                currentWidth: 0,
                currentTime: '00.00'
            })
        })
        //监听音乐实时播放的进度
        this.BackgroundAudioManager.onTimeUpdate(() => {
            let currentTime = dayjs(this.BackgroundAudioManager.currentTime * 1000).format('mm:ss')
            let currentWidth = this.BackgroundAudioManager.currentTime/this.BackgroundAudioManager.duration * 450
            this.setData({
                currentTime,
                currentWidth
            })
        })
    },
    //修改播放状态的功能函数
    changePlayState(isPlay) {
        //修改音乐是否播放
        this.setData({
            isPlay
        })
        //修改全局音乐播放的状态
        appInstance.globalData.isMusicPlay = isPlay
    },
    //获取音乐详情的功能函数
    async getMusicInfo(musicId) {
        let songData = await request('/song/detail', {ids: musicId})
        let durationTime = dayjs(songData.songs[0].dt).format('mm:ss')
        this.setData({
            song: songData.songs[0],
            durationTime
        })
        //动态修改窗口标题
        wx.setNavigationBarTitle({
            title: this.data.song.name
        })
    },
    // 点击播放/暂停的回调
    handleMusicPlay() {
        let isPlay = !this.data.isPlay
        //修改音乐是否播放
        // this.setData({
        //     isPlay
        // })
        let {musicId, musicLink} = this.data
        this.musicControl(isPlay, musicId, musicLink)
    },
    // 控制音乐播放/暂停的功能函数
    async musicControl(isPlay, musicId, musicLink) {
        if (isPlay) { //音乐播放
            if (!musicLink) {
                //获取音乐播放链接
                let musicLinkData = await request('/song/url', {id: musicId})
                musicLink = musicLinkData.data[0].url
                this.setData({
                    musicLink
                })
            }
            this.BackgroundAudioManager.src = musicLink
            this.BackgroundAudioManager.title = this.data.song.name
        } else { //暂停播放
            this.BackgroundAudioManager.pause()
        }
    },
    //点击切歌的回调
    handleSwitch(event) {
        //获取切歌的类型
        let type = event.currentTarget.id
        //关闭当前播放的音乐
        this.BackgroundAudioManager.stop()
        //订阅来自recommendSong页面发布的musicId消息
        PubSub.subscribe('musicId', (_, musicId) => {
            // console.log(musicId)
            //获取音乐详细信息
            this.getMusicInfo(musicId)
            //自动播放当前音乐
            this.musicControl(true, musicId)
            //取消订阅
            PubSub.unsubscribe('musicId')
        })
        //发布消息给recommendSong页面
        PubSub.publish('switchType', type)
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})