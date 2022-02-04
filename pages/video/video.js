import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        videoGroupList: [], //导航标签数据
        navId: '', //导航的标识
        videoList: [], //视频列表数据
        videoId: '', //视频id标识
        videoUpdateTime: [], // 记录video播放的时长
        isTriggered: false, //标记下拉刷新是否被触发
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //获取导航数据
        this.getVideoGroupListData()
    },
    //获取导航数据
    async getVideoGroupListData() {
        let videoGroupListData = await request('/video/group/list')
        this.setData({
            videoGroupList: videoGroupListData.data.slice(0, 14),
            navId: videoGroupListData.data[0].id
        })
        //获取视频列表数据
        this.getVideoList(this.data.navId)
    },
    //获取视频列表数据
    async getVideoList(navId) {
        let VideoListData = await request('/video/group', {id: navId})
        //关闭消息提示框
        wx.hideLoading()
        // console.log(VideoListData)
        let index = 0
        let videoList = VideoListData.datas.map(item => {
            item.id = index++
            return item
        })
        this.setData({
            videoList,
            isTriggered: false //关闭下拉刷新
        })
    },
    // 点击切换导航的回调
    changeNav(event) {
        let navId = event.currentTarget.id //通过id向event传参的时候如果传的是number会自动转化成string
        // let navId = event.currentTarget.dataset.id
        this.setData({
            // navId
            navId: navId>>>0,
            //清空视频列表数据
            videoList: []
        })
        //显示正在加载
        wx.showLoading({
            title: '正在加载中',
        })
        //动态获取当前对导航的视频数据
        this.getVideoList(this.data.navId)
    },
    //点击播放/继续播放的回调
    handlePaly(event) {
        let vid = event.currentTarget.id
        //关闭上一个播放的视频
        //this.vid !== vid && this.videoContext && this.videoContext.stop()
        //this.vid = vid
        //更新data中videoId的状态数据
        this.setData({
            videoId: vid
        })
        //创建控制video标签的实例对象
        this.videoContext = wx.createVideoContext(vid)
        //判断当前视频之前是否播放过，是否有播放记录，如果有，跳转至指定的播放位置
        let {videoUpdateTime} = this.data
        let videoItem = videoUpdateTime.find(item => item.vid === vid)
        if (videoItem) {
            this.videoContext.seek(videoItem.currentTime)
        }
        this.videoContext.play()
    },
    //监听视频播放进度的回调
    handleTimeUpdate(event) {
        let videoTimeObj = {vid: event.currentTarget.id, currentTime: event.detail.currentTime}
        let {videoUpdateTime} = this.data
        //判断是否正在播放当前视频
        let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid)
        if(videoItem) {
            //更新此视频对象
            videoItem.currentTime = event.detail.currentTime
        } else {
            //添加别的视频对象
            videoUpdateTime.push(videoTimeObj)
        }
        this.setData({
            videoUpdateTime
        })
    },
    //视频播放结束调用的回调
    handleEnded(event) {
        //移除记录播放时长数组中当前视频的对象
        let {videoUpdateTime} = this.data
        videoUpdateTime.splice(videoUpdateTime.findIndex(item => item.vid === event.currentTarget.id), 1)
        this.setData({
            videoUpdateTime
        })
    },
    //自定义下拉刷新的回调 scroll-view
    handleRefresher() {
        this.getVideoList(this.data.navId)
    },
    //自定义下拉触底的回调 scroll-view
    handleToLower() {
        //模拟数据
        let newVideoList = [{
            "type": 1,
            "displayed": false,
            "alg": "onlineHotGroup",
            "extAlg": null,
            "data": {
            "alg": "onlineHotGroup",
            "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
            "threadId": "R_VI_62_CB5C13DA8022711855493E8E1FD51E4D",
            "coverUrl": "https://p2.music.126.net/A-fkG1blEALut0vCOyyqAQ==/109951163953580807.jpg",
            "height": 720,
            "width": 1280,
            "title": "王嘉尔《Dawn of us》live版",
            "description": "王嘉尔《Dawn of us》live版",
            "commentCount": 2888,
            "shareCount": 6936,
            "resolutions": [
            {
            "resolution": 240,
            "size": 13053897
            },
            {
            "resolution": 480,
            "size": 21241889
            },
            {
            "resolution": 720,
            "size": 30839931
            }
            ],
            "creator": {
            "defaultAvatar": false,
            "province": 110000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/7Z6rYNbcZLl4X9e3TWpWzg==/109951166499729724.jpg",
            "accountStatus": 0,
            "gender": 1,
            "city": 110101,
            "birthday": 965812041369,
            "userId": 555304231,
            "userType": 207,
            "nickname": "娱玖爷",
            "signature": "娱玖爷，明星八卦！娱乐圈精选优秀资源！好音乐分享！【微博同名】中华小曲库就是我！•_•. 商演合作，新专辑推广请私信！",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951166499729730,
            "backgroundImgId": 109951165395722990,
            "backgroundUrl": "http://p1.music.126.net/LulOmlCSpzNQKI9xmJYIcg==/109951165395722990.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
            "1": "音乐视频达人",
            "2": "生活图文达人"
            },
            "djStatus": 10,
            "vipType": 11,
            "remarkName": null,
            "avatarImgIdStr": "109951166499729724",
            "backgroundImgIdStr": "109951165395722990"
            },
            "urlInfo": {
            "id": "CB5C13DA8022711855493E8E1FD51E4D",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/J8QxCGUj_2402790657_shd.mp4?ts=1642478174&rid=CED16A41E5018CA291C3A1B7FCD5AF64&rl=3&rs=rtjQdzlMuMGHsjRwboaXrPrxFVzJViZo&sign=f11b2170f0a8c5a877982ff3f80b9062&ext=ClH2p%2B%2BDmoyOVAgK8byePGlWvWUL2HGiTHwnChoGMs0gFRTNc6EGuw9rISbDFHN8xjZ2hRWnmifYMIa7q%2BR75l0Erdb%2B5XTByQnWAtaqO8H1XiA%2F0eQH0tl3MIKTsWJ1DdKxuoA5MkmE%2Fvv5zuXrCo9PX%2FlnbDbsrPzoGLCHSQY1lTu8R1l5SRtXz2OCyEAOmuDohhrH8WG6ZR55BVoyf3PQOUp2XZkH0mlnzBHiD0B%2Fr%2B582t4ZFF8RqUul5qf2",
            "size": 30839931,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 720
            },
            "videoGroup": [
            {
            "id": 58100,
            "name": "现场",
            "alg": null
            },
            {
            "id": 9102,
            "name": "演唱会",
            "alg": null
            },
            {
            "id": 57106,
            "name": "欧美现场",
            "alg": null
            },
            {
            "id": 1100,
            "name": "音乐现场",
            "alg": null
            },
            {
            "id": 5100,
            "name": "音乐",
            "alg": null
            }
            ],
            "previewUrl": null,
            "previewDurationms": 0,
            "hasRelatedGameAd": false,
            "markTypes": null,
            "relateSong": [
            {
            "name": "Dawn of us",
            "id": 553813030,
            "pst": 0,
            "t": 0,
            "ar": [
            {
            "id": 1083118,
            "name": "王嘉尔",
            "tns": [],
            "alias": []
            }
            ],
            "alia": [],
            "pop": 100,
            "st": 0,
            "rt": null,
            "fee": 8,
            "v": 14,
            "crbt": null,
            "cf": "",
            "al": {
            "id": 38404010,
            "name": "Dawn of us",
            "picUrl": "http://p4.music.126.net/36Jn70oJcxhTpiWunyyg8w==/109951163255300834.jpg",
            "tns": [],
            "pic_str": "109951163255300834",
            "pic": 109951163255300830
            },
            "dt": 179833,
            "h": {
            "br": 320000,
            "fid": 0,
            "size": 7196256,
            "vd": -21000
            },
            "m": {
            "br": 192000,
            "fid": 0,
            "size": 4317771,
            "vd": -18500
            },
            "l": {
            "br": 128000,
            "fid": 0,
            "size": 2878528,
            "vd": -17100
            },
            "a": null,
            "cd": "01",
            "no": 0,
            "rtUrl": null,
            "ftype": 0,
            "rtUrls": [],
            "djId": 0,
            "copyright": 0,
            "s_id": 0,
            "mst": 9,
            "cp": 456010,
            "mv": 5894029,
            "rtype": 0,
            "rurl": null,
            "publishTime": 1524153600007,
            "privilege": {
            "id": 553813030,
            "fee": 8,
            "payed": 0,
            "st": 0,
            "pl": 128000,
            "dl": 0,
            "sp": 7,
            "cp": 1,
            "subp": 1,
            "cs": false,
            "maxbr": 999000,
            "fl": 128000,
            "toast": false,
            "flag": 0,
            "preSell": false
            }
            }
            ],
            "relatedInfo": null,
            "videoUserLiveInfo": null,
            "vid": "CB5C13DA8022711855493E8E1FD51E4D",
            "durationms": 178680,
            "playTime": 2677532,
            "praisedCount": 20857,
            "praised": false,
            "subscribed": false
            }
            },
            {
            "type": 1,
            "displayed": false,
            "alg": "onlineHotGroup",
            "extAlg": null,
            "data": {
            "alg": "onlineHotGroup",
            "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
            "threadId": "R_VI_62_BDE4C88BA3B31DCDDA486DCA330934CE",
            "coverUrl": "https://p1.music.126.net/gcqKHQ6vr1Elzb_tNI_yUw==/109951164718320143.jpg",
            "height": 1080,
            "width": 1920,
            "title": "【IZONE】200217回归秀《Fiesta》舞台",
            "description": "【IZONE】200217回归秀《Fiesta》舞台",
            "commentCount": 237,
            "shareCount": 437,
            "resolutions": [
            {
            "resolution": 240,
            "size": 58459188
            },
            {
            "resolution": 480,
            "size": 97210833
            },
            {
            "resolution": 720,
            "size": 149883862
            },
            {
            "resolution": 1080,
            "size": 181841690
            }
            ],
            "creator": {
            "defaultAvatar": false,
            "province": 310000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/vYHGILLfWWof6ogz1HwxKQ==/109951164491145822.jpg",
            "accountStatus": 0,
            "gender": 2,
            "city": 310101,
            "birthday": 1262275200000,
            "userId": 1335061865,
            "userType": 204,
            "nickname": "仙宫频道",
            "signature": "plmm爱好者/个人收藏bot",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951164491145820,
            "backgroundImgId": 109951164829202080,
            "backgroundUrl": "http://p1.music.126.net/PNGXsjXd_IYT0vvkXeoonQ==/109951164829202086.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
            "1": "音乐视频达人",
            "2": "音乐图文达人"
            },
            "djStatus": 10,
            "vipType": 0,
            "remarkName": null,
            "avatarImgIdStr": "109951164491145822",
            "backgroundImgIdStr": "109951164829202086"
            },
            "urlInfo": {
            "id": "BDE4C88BA3B31DCDDA486DCA330934CE",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/N3Tcjoya_2909344987_uhd.mp4?ts=1642478174&rid=CED16A41E5018CA291C3A1B7FCD5AF64&rl=3&rs=HTYxAVinpoqLnulYdnvSSKwqSQXmwpPS&sign=123d8853148ee4c6d94120661792d73d&ext=ClH2p%2B%2BDmoyOVAgK8byePGlWvWUL2HGiTHwnChoGMs0gFRTNc6EGuw9rISbDFHN8xjZ2hRWnmifYMIa7q%2BR75l0Erdb%2B5XTByQnWAtaqO8H1XiA%2F0eQH0tl3MIKTsWJ1DdKxuoA5MkmE%2Fvv5zuXrCo9PX%2FlnbDbsrPzoGLCHSQY1lTu8R1l5SRtXz2OCyEAOmuDohhrH8WG6ZR55BVoyf3PQOUp2XZkH0mlnzBHiD0B%2Fr%2B582t4ZFF8RqUul5qf2",
            "size": 181841690,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 1080
            },
            "videoGroup": [
            {
            "id": 58100,
            "name": "现场",
            "alg": null
            },
            {
            "id": 1101,
            "name": "舞蹈",
            "alg": null
            },
            {
            "id": 1100,
            "name": "音乐现场",
            "alg": null
            },
            {
            "id": 5100,
            "name": "音乐",
            "alg": null
            },
            {
            "id": 16166,
            "name": "韩语音乐",
            "alg": null
            }
            ],
            "previewUrl": null,
            "previewDurationms": 0,
            "hasRelatedGameAd": false,
            "markTypes": null,
            "relateSong": [],
            "relatedInfo": null,
            "videoUserLiveInfo": null,
            "vid": "BDE4C88BA3B31DCDDA486DCA330934CE",
            "durationms": 232986,
            "playTime": 317993,
            "praisedCount": 2673,
            "praised": false,
            "subscribed": false
            }
            },
            {
            "type": 1,
            "displayed": false,
            "alg": "onlineHotGroup",
            "extAlg": null,
            "data": {
            "alg": "onlineHotGroup",
            "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
            "threadId": "R_VI_62_5EAE8BB298756C99E1002789E7A13AF5",
            "coverUrl": "https://p2.music.126.net/6dACtD_LxEom_ovExpe7wQ==/109951163710138670.jpg",
            "height": 720,
            "width": 1280,
            "title": "神秘园成名作《夜曲》",
            "description": "神秘园成名作《夜曲》,天籁之声，感动落泪。",
            "commentCount": 136,
            "shareCount": 1785,
            "resolutions": [
            {
            "resolution": 240,
            "size": 13424286
            },
            {
            "resolution": 480,
            "size": 21547662
            },
            {
            "resolution": 720,
            "size": 30670859
            }
            ],
            "creator": {
            "defaultAvatar": false,
            "province": 110000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/Y4pGKbckFvX-aYFZn53s9Q==/109951163924975239.jpg",
            "accountStatus": 0,
            "gender": 1,
            "city": 110101,
            "birthday": 1489593600000,
            "userId": 346928030,
            "userType": 204,
            "nickname": "音乐学人",
            "signature": "聆听音乐，感悟人生 。",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951163924975230,
            "backgroundImgId": 109951166108729000,
            "backgroundUrl": "http://p1.music.126.net/hBOTbXAzy3yUv46P8IfyBA==/109951166108728986.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
            "1": "音乐视频达人",
            "2": "古典资讯达人"
            },
            "djStatus": 0,
            "vipType": 11,
            "remarkName": null,
            "avatarImgIdStr": "109951163924975239",
            "backgroundImgIdStr": "109951166108728986"
            },
            "urlInfo": {
            "id": "5EAE8BB298756C99E1002789E7A13AF5",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/LcGqvxxZ_2169891123_shd.mp4?ts=1642478174&rid=CED16A41E5018CA291C3A1B7FCD5AF64&rl=3&rs=XzBtypkZpYtJurrxMnMmHZIilJLFsloB&sign=3f4cff3d643edd66d83117a26393d47d&ext=ClH2p%2B%2BDmoyOVAgK8byePGlWvWUL2HGiTHwnChoGMs0gFRTNc6EGuw9rISbDFHN8xjZ2hRWnmifYMIa7q%2BR75l0Erdb%2B5XTByQnWAtaqO8H1XiA%2F0eQH0tl3MIKTsWJ1DdKxuoA5MkmE%2Fvv5zuXrCo9PX%2FlnbDbsrPzoGLCHSQY1lTu8R1l5SRtXz2OCyEAOmuDohhrH8WG6ZR55BVoyf3PQOUp2XZkH0mlnzBHiD0B%2Fr%2B582t4ZFF8RqUul5qf2",
            "size": 30670859,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 720
            },
            "videoGroup": [
            {
            "id": 58100,
            "name": "现场",
            "alg": null
            },
            {
            "id": 9102,
            "name": "演唱会",
            "alg": null
            },
            {
            "id": 57106,
            "name": "欧美现场",
            "alg": null
            },
            {
            "id": 1100,
            "name": "音乐现场",
            "alg": null
            },
            {
            "id": 5100,
            "name": "音乐",
            "alg": null
            },
            {
            "id": 15105,
            "name": "古典",
            "alg": null
            }
            ],
            "previewUrl": null,
            "previewDurationms": 0,
            "hasRelatedGameAd": false,
            "markTypes": null,
            "relateSong": [],
            "relatedInfo": null,
            "videoUserLiveInfo": null,
            "vid": "5EAE8BB298756C99E1002789E7A13AF5",
            "durationms": 195000,
            "playTime": 224848,
            "praisedCount": 1797,
            "praised": false,
            "subscribed": false
            }
            },
            {
            "type": 1,
            "displayed": false,
            "alg": "onlineHotGroup",
            "extAlg": null,
            "data": {
            "alg": "onlineHotGroup",
            "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
            "threadId": "R_VI_62_ED266AE187D80E4A55792BA8B78D6016",
            "coverUrl": "https://p2.music.126.net/wAmiF0Tgq19tnSInkvkFug==/109951163776951749.jpg",
            "height": 720,
            "width": 1280,
            "title": "虐狗超甜~陈小春《相依为命》全程严肃无表情.看到应采儿合不拢嘴",
            "description": "太有爱了！陈小春、郑伊健、谢天华、钱嘉乐、林晓峰 古惑仔之友情岁月演唱会(Live)",
            "commentCount": 94,
            "shareCount": 1649,
            "resolutions": [
            {
            "resolution": 240,
            "size": 15593255
            },
            {
            "resolution": 480,
            "size": 26405784
            },
            {
            "resolution": 720,
            "size": 41100299
            }
            ],
            "creator": {
            "defaultAvatar": false,
            "province": 420000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/u2UclkSLln_uY3cLodf32A==/7945071023153547.jpg",
            "accountStatus": 0,
            "gender": 1,
            "city": 421300,
            "birthday": 591120000000,
            "userId": 77798117,
            "userType": 204,
            "nickname": "管管736",
            "signature": "传递快乐，治愈不开心。B站：管管丶",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 7945071023153547,
            "backgroundImgId": 2002210674180199,
            "backgroundUrl": "http://p1.music.126.net/VTW4vsN08vwL3uSQqPyHqg==/2002210674180199.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": null,
            "djStatus": 0,
            "vipType": 0,
            "remarkName": null,
            "avatarImgIdStr": "7945071023153547",
            "backgroundImgIdStr": "2002210674180199"
            },
            "urlInfo": {
            "id": "ED266AE187D80E4A55792BA8B78D6016",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/JlGEtYIf_2236325092_shd.mp4?ts=1642478174&rid=CED16A41E5018CA291C3A1B7FCD5AF64&rl=3&rs=wcfkBLyWkWtTscaDWRYCYWPwryJymMqj&sign=773c3f7c01995eac8a5f17ababd54805&ext=ClH2p%2B%2BDmoyOVAgK8byePGlWvWUL2HGiTHwnChoGMs0gFRTNc6EGuw9rISbDFHN8xjZ2hRWnmifYMIa7q%2BR75l0Erdb%2B5XTByQnWAtaqO8H1XiA%2F0eQH0tl3MIKTsWJ1DdKxuoA5MkmE%2Fvv5zuXrCo9PX%2FlnbDbsrPzoGLCHSQY1lTu8R1l5SRtXz2OCyEAOmuDohhrH8WG6ZR55BVoyf3PQOUp2XZkH0mlnzBHiD0B%2Fr%2B582t4ZFF8RqUul5qf2",
            "size": 41100299,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 720
            },
            "videoGroup": [
            {
            "id": 58100,
            "name": "现场",
            "alg": null
            },
            {
            "id": 9102,
            "name": "演唱会",
            "alg": null
            },
            {
            "id": 57105,
            "name": "粤语现场",
            "alg": null
            },
            {
            "id": 57108,
            "name": "流行现场",
            "alg": null
            },
            {
            "id": 1100,
            "name": "音乐现场",
            "alg": null
            },
            {
            "id": 5100,
            "name": "音乐",
            "alg": null
            }
            ],
            "previewUrl": null,
            "previewDurationms": 0,
            "hasRelatedGameAd": false,
            "markTypes": null,
            "relateSong": [
            {
            "name": "相依为命",
            "id": 94639,
            "pst": 0,
            "t": 0,
            "ar": [
            {
            "id": 2112,
            "name": "陈小春",
            "tns": [],
            "alias": []
            }
            ],
            "alia": [],
            "pop": 100,
            "st": 0,
            "rt": "",
            "fee": 8,
            "v": 88,
            "crbt": null,
            "cf": "",
            "al": {
            "id": 9259,
            "name": "十年选",
            "picUrl": "http://p3.music.126.net/Yjc9XiSt4pwQpL-6XehWJQ==/109951165687518185.jpg",
            "tns": [],
            "pic_str": "109951165687518185",
            "pic": 109951165687518190
            },
            "dt": 236826,
            "h": {
            "br": 320000,
            "fid": 0,
            "size": 9476223,
            "vd": -35335
            },
            "m": {
            "br": 192000,
            "fid": 0,
            "size": 5685751,
            "vd": -32788
            },
            "l": {
            "br": 128000,
            "fid": 0,
            "size": 3790515,
            "vd": -31238
            },
            "a": null,
            "cd": "1",
            "no": 2,
            "rtUrl": null,
            "ftype": 0,
            "rtUrls": [],
            "djId": 0,
            "copyright": 1,
            "s_id": 0,
            "mst": 9,
            "cp": 405025,
            "mv": 5643810,
            "rtype": 0,
            "rurl": null,
            "publishTime": 1122825600000,
            "privilege": {
            "id": 94639,
            "fee": 8,
            "payed": 0,
            "st": 0,
            "pl": 128000,
            "dl": 0,
            "sp": 7,
            "cp": 1,
            "subp": 1,
            "cs": false,
            "maxbr": 999000,
            "fl": 128000,
            "toast": false,
            "flag": 0,
            "preSell": false
            }
            }
            ],
            "relatedInfo": null,
            "videoUserLiveInfo": null,
            "vid": "ED266AE187D80E4A55792BA8B78D6016",
            "durationms": 173024,
            "playTime": 375449,
            "praisedCount": 4164,
            "praised": false,
            "subscribed": false
            }
            },
            {
            "type": 1,
            "displayed": false,
            "alg": "onlineHotGroup",
            "extAlg": null,
            "data": {
            "alg": "onlineHotGroup",
            "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
            "threadId": "R_VI_62_6B9A3795A9E292050BCDAF9926CF172A",
            "coverUrl": "https://p2.music.126.net/IQntEqtJ-qlNutFrLw_5-Q==/109951163767187469.jpg",
            "height": 1080,
            "width": 1920,
            "title": "茄子蛋2019跨年现场《浪子回头》 这歌今年唱哭了",
            "description": "今年有多少人，为了这首歌开始用注音学习闽南语。平淡之处的真情最动人，现场版的浪子回头的每一次听，都有不一样的感触。当有一天你老去了，有谁会等你，浪子回头？#在云村看现场#",
            "commentCount": 2247,
            "shareCount": 6827,
            "resolutions": [
            {
            "resolution": 240,
            "size": 34750771
            },
            {
            "resolution": 480,
            "size": 62654449
            },
            {
            "resolution": 720,
            "size": 100594974
            },
            {
            "resolution": 1080,
            "size": 171968629
            }
            ],
            "creator": {
            "defaultAvatar": false,
            "province": 110000,
            "authStatus": 1,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/w9sQfaK_Xissw1pmu9LcXw==/109951163536090163.jpg",
            "accountStatus": 0,
            "gender": 2,
            "city": 110101,
            "birthday": -2209017600000,
            "userId": 1539973165,
            "userType": 10,
            "nickname": "在云村看现场",
            "signature": "网易云音乐是6亿人都在使用的音乐平台，致力于帮助音乐爱好者发现音乐惊喜，帮助音乐人实现梦想。\n在云村看现场独家策划专题每周周末更新，欢迎各位村民私信或者@优质音乐现场内容！\n如果仍然不能解决您的问题，请邮件我们：\n用户：ncm5990@163.com\n音乐人：yyr599@163.com",
            "description": "在云村看现场官方",
            "detailDescription": "在云村看现场官方",
            "avatarImgId": 109951163536090160,
            "backgroundImgId": 109951162868126480,
            "backgroundUrl": "http://p1.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": null,
            "djStatus": 0,
            "vipType": 0,
            "remarkName": null,
            "avatarImgIdStr": "109951163536090163",
            "backgroundImgIdStr": "109951162868126486"
            },
            "urlInfo": {
            "id": "6B9A3795A9E292050BCDAF9926CF172A",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/P3IYI7Oo_2230867671_uhd.mp4?ts=1642478174&rid=CED16A41E5018CA291C3A1B7FCD5AF64&rl=3&rs=ubkKYIEpvixpeVKHkwnczIScuUQGnvji&sign=d90d8182a5a00ca2a49ce7be02c15318&ext=ClH2p%2B%2BDmoyOVAgK8byePGlWvWUL2HGiTHwnChoGMs0gFRTNc6EGuw9rISbDFHN8xjZ2hRWnmifYMIa7q%2BR75l0Erdb%2B5XTByQnWAtaqO8H1XiA%2F0eQH0tl3MIKTsWJ1DdKxuoA5MkmE%2Fvv5zuXrCo9PX%2FlnbDbsrPzoGLCHSQY1lTu8R1l5SRtXz2OCyEAOmuDohhrH8WG6ZR55BVoyf3PQOUp2XZkH0mlnzBHiD0B%2Fr%2B582t4ZFF8RqUul5qf2",
            "size": 171968629,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 1080
            },
            "videoGroup": [
            {
            "id": 58100,
            "name": "现场",
            "alg": null
            },
            {
            "id": 9102,
            "name": "演唱会",
            "alg": null
            },
            {
            "id": 59101,
            "name": "华语现场",
            "alg": null
            },
            {
            "id": 57108,
            "name": "流行现场",
            "alg": null
            },
            {
            "id": 1100,
            "name": "音乐现场",
            "alg": null
            },
            {
            "id": 5100,
            "name": "音乐",
            "alg": null
            }
            ],
            "previewUrl": null,
            "previewDurationms": 0,
            "hasRelatedGameAd": false,
            "markTypes": null,
            "relateSong": [
            {
            "name": "浪子回頭",
            "id": 516728102,
            "pst": 0,
            "t": 0,
            "ar": [
            {
            "id": 1039873,
            "name": "茄子蛋",
            "tns": [],
            "alias": []
            }
            ],
            "alia": [],
            "pop": 100,
            "st": 0,
            "rt": null,
            "fee": 8,
            "v": 67,
            "crbt": null,
            "cf": "",
            "al": {
            "id": 36693907,
            "name": "卡通人物",
            "picUrl": "http://p3.music.126.net/emWwYFceRZ2plNWgnGUDfg==/109951163333175426.jpg",
            "tns": [],
            "pic_str": "109951163333175426",
            "pic": 109951163333175420
            },
            "dt": 259373,
            "h": {
            "br": 320000,
            "fid": 0,
            "size": 10377970,
            "vd": -37177
            },
            "m": {
            "br": 192000,
            "fid": 0,
            "size": 6226800,
            "vd": -34584
            },
            "l": {
            "br": 128000,
            "fid": 0,
            "size": 4151214,
            "vd": -32933
            },
            "a": null,
            "cd": "1",
            "no": 6,
            "rtUrl": null,
            "ftype": 0,
            "rtUrls": [],
            "djId": 0,
            "copyright": 1,
            "s_id": 0,
            "mst": 9,
            "cp": 2706505,
            "mv": 10729090,
            "rtype": 0,
            "rurl": null,
            "publishTime": 1509724800000,
            "privilege": {
            "id": 516728102,
            "fee": 8,
            "payed": 0,
            "st": 0,
            "pl": 128000,
            "dl": 0,
            "sp": 7,
            "cp": 1,
            "subp": 1,
            "cs": false,
            "maxbr": 999000,
            "fl": 128000,
            "toast": false,
            "flag": 4,
            "preSell": false
            }
            }
            ],
            "relatedInfo": null,
            "videoUserLiveInfo": null,
            "vid": "6B9A3795A9E292050BCDAF9926CF172A",
            "durationms": 262378,
            "playTime": 7918309,
            "praisedCount": 47946,
            "praised": false,
            "subscribed": false
            }
            },
            {
            "type": 1,
            "displayed": false,
            "alg": "onlineHotGroup",
            "extAlg": null,
            "data": {
            "alg": "onlineHotGroup",
            "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
            "threadId": "R_VI_62_56136524F7CFDCD7650F78A99697B145",
            "coverUrl": "https://p2.music.126.net/eog5Pe96RPZhF4HCxVvv6w==/109951163741038611.jpg",
            "height": 1080,
            "width": 1920,
            "title": "Coldplay最美现场 -Everglow（中英字幕），极致电音碰撞唯美人声",
            "description": "Coldplay最美现场，极致电音碰撞唯美人声",
            "commentCount": 57,
            "shareCount": 600,
            "resolutions": [
            {
            "resolution": 240,
            "size": 20827922
            },
            {
            "resolution": 480,
            "size": 34479847
            },
            {
            "resolution": 720,
            "size": 50674304
            },
            {
            "resolution": 1080,
            "size": 74063861
            }
            ],
            "creator": {
            "defaultAvatar": false,
            "province": 350000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/j1Y9KfzEB1cPrlscvJRSzw==/109951164077300349.jpg",
            "accountStatus": 0,
            "gender": 1,
            "city": 350200,
            "birthday": 918316800000,
            "userId": 304891018,
            "userType": 204,
            "nickname": "Ricardo丶X丶P",
            "signature": "Till nobody else even fu**ing feels me, till it kills me......",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951164077300350,
            "backgroundImgId": 109951164747231330,
            "backgroundUrl": "http://p1.music.126.net/jqGDEY4drK_oEm3WhmUkuA==/109951164747231331.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
            "1": "音乐视频达人"
            },
            "djStatus": 0,
            "vipType": 11,
            "remarkName": null,
            "avatarImgIdStr": "109951164077300349",
            "backgroundImgIdStr": "109951164747231331"
            },
            "urlInfo": {
            "id": "56136524F7CFDCD7650F78A99697B145",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/BuTr39pL_2204851787_uhd.mp4?ts=1642478174&rid=CED16A41E5018CA291C3A1B7FCD5AF64&rl=3&rs=NgiIQpEatrYyadofsehdeJLNvSiPPmhs&sign=90e67255444d0865ba10d75127235f7c&ext=ClH2p%2B%2BDmoyOVAgK8byePGlWvWUL2HGiTHwnChoGMs0gFRTNc6EGuw9rISbDFHN8xjZ2hRWnmifYMIa7q%2BR75l0Erdb%2B5XTByQnWAtaqO8H1XiA%2F0eQH0tl3MIKTsWJ1DdKxuoA5MkmE%2Fvv5zuXrCo9PX%2FlnbDbsrPzoGLCHSQY1lTu8R1l5SRtXz2OCyEAOmuDohhrH8WG6ZR55BVoyf3PQOUp2XZkH0mlnzBHiD0B%2Fr%2B582t4ZFF8RqUul5qf2",
            "size": 74063861,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 1080
            },
            "videoGroup": [
            {
            "id": 58100,
            "name": "现场",
            "alg": null
            },
            {
            "id": 57106,
            "name": "欧美现场",
            "alg": null
            },
            {
            "id": 57108,
            "name": "流行现场",
            "alg": null
            },
            {
            "id": 59108,
            "name": "巡演现场",
            "alg": null
            },
            {
            "id": 12125,
            "name": "Coldplay",
            "alg": null
            },
            {
            "id": 1100,
            "name": "音乐现场",
            "alg": null
            },
            {
            "id": 4104,
            "name": "电音",
            "alg": null
            },
            {
            "id": 5100,
            "name": "音乐",
            "alg": null
            }
            ],
            "previewUrl": null,
            "previewDurationms": 0,
            "hasRelatedGameAd": false,
            "markTypes": [
            101,
            111
            ],
            "relateSong": [
            {
            "name": "Everglow",
            "id": 37239018,
            "pst": 0,
            "t": 0,
            "ar": [
            {
            "id": 89365,
            "name": "Coldplay",
            "tns": [],
            "alias": []
            },
            {
            "id": 59177,
            "name": "Gwyneth Paltrow",
            "tns": [],
            "alias": []
            }
            ],
            "alia": [],
            "pop": 100,
            "st": 0,
            "rt": null,
            "fee": 1,
            "v": 24,
            "crbt": null,
            "cf": "",
            "al": {
            "id": 3419012,
            "name": "Everglow",
            "picUrl": "http://p3.music.126.net/tnaTZ9ZokTL7w0kDa73iVA==/3297435376989078.jpg",
            "tns": [],
            "pic": 3297435376989078
            },
            "dt": 282749,
            "h": {
            "br": 320000,
            "fid": 0,
            "size": 11311063,
            "vd": -11400
            },
            "m": {
            "br": 192000,
            "fid": 0,
            "size": 6786655,
            "vd": -8800
            },
            "l": {
            "br": 128000,
            "fid": 0,
            "size": 4524451,
            "vd": -6900
            },
            "a": null,
            "cd": "1",
            "no": 4,
            "rtUrl": null,
            "ftype": 0,
            "rtUrls": [],
            "djId": 0,
            "copyright": 0,
            "s_id": 0,
            "mst": 9,
            "cp": 14002,
            "mv": 0,
            "rtype": 0,
            "rurl": null,
            "publishTime": 1448467200007,
            "privilege": {
            "id": 37239018,
            "fee": 1,
            "payed": 0,
            "st": 0,
            "pl": 0,
            "dl": 0,
            "sp": 0,
            "cp": 0,
            "subp": 0,
            "cs": false,
            "maxbr": 320000,
            "fl": 0,
            "toast": false,
            "flag": 4,
            "preSell": false
            }
            }
            ],
            "relatedInfo": null,
            "videoUserLiveInfo": null,
            "vid": "56136524F7CFDCD7650F78A99697B145",
            "durationms": 280753,
            "playTime": 170569,
            "praisedCount": 1627,
            "praised": false,
            "subscribed": false
            }
            },
            {
            "type": 1,
            "displayed": false,
            "alg": "onlineHotGroup",
            "extAlg": null,
            "data": {
            "alg": "onlineHotGroup",
            "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
            "threadId": "R_VI_62_9B1AD82AF34D7A035B8522D8BB6EB1C3",
            "coverUrl": "https://p2.music.126.net/7_Tpxgf21M7E_u8_U5qnUA==/109951163988674373.jpg",
            "height": 720,
            "width": 1280,
            "title": "2019日本指弹大赛第一位 Youngso Kim - Like A Star",
            "description": null,
            "commentCount": 826,
            "shareCount": 7201,
            "resolutions": [
            {
            "resolution": 240,
            "size": 38107796
            },
            {
            "resolution": 480,
            "size": 64163127
            },
            {
            "resolution": 720,
            "size": 88034156
            }
            ],
            "creator": {
            "defaultAvatar": false,
            "province": 330000,
            "authStatus": 1,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/s89WfZEOLRbbSY3R_dObbA==/109951166883421577.jpg",
            "accountStatus": 0,
            "gender": 0,
            "city": 330100,
            "birthday": 927734400000,
            "userId": 107196027,
            "userType": 4,
            "nickname": "urts",
            "signature": "",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951166883421580,
            "backgroundImgId": 109951166896461800,
            "backgroundUrl": "http://p1.music.126.net/TyWqO1Ki6dxHphU6JCc7Og==/109951166896461800.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": null,
            "djStatus": 10,
            "vipType": 0,
            "remarkName": null,
            "avatarImgIdStr": "109951166883421577",
            "backgroundImgIdStr": "109951166896461800"
            },
            "urlInfo": {
            "id": "9B1AD82AF34D7A035B8522D8BB6EB1C3",
            "url": "http://vodkgeyttp9.vod.126.net/cloudmusic/LCzaGPV4_2436228004_shd.mp4?ts=1642478174&rid=CED16A41E5018CA291C3A1B7FCD5AF64&rl=3&rs=ovwmfWXFfkKeFeNqtBNCRfBZsaEfeclf&sign=e780e8aa8daaf24624388cd70e77bad9&ext=ClH2p%2B%2BDmoyOVAgK8byePGlWvWUL2HGiTHwnChoGMs0gFRTNc6EGuw9rISbDFHN8xjZ2hRWnmifYMIa7q%2BR75l0Erdb%2B5XTByQnWAtaqO8H1XiA%2F0eQH0tl3MIKTsWJ1DdKxuoA5MkmE%2Fvv5zuXrCo9PX%2FlnbDbsrPzoGLCHSQY1lTu8R1l5SRtXz2OCyEAOmuDohhrH8WG6ZR55BVoyf3PQOUp2XZkH0mlnzBHiD0B%2Fr%2B582t4ZFF8RqUul5qf2",
            "size": 88034156,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 720
            },
            "videoGroup": [
            {
            "id": 58100,
            "name": "现场",
            "alg": null
            },
            {
            "id": 9100,
            "name": "指弹",
            "alg": null
            },
            {
            "id": 4103,
            "name": "演奏",
            "alg": null
            },
            {
            "id": 1100,
            "name": "音乐现场",
            "alg": null
            },
            {
            "id": 5100,
            "name": "音乐",
            "alg": null
            },
            {
            "id": 23128,
            "name": "纯音乐",
            "alg": null
            },
            {
            "id": 16170,
            "name": "吉他",
            "alg": null
            }
            ],
            "previewUrl": null,
            "previewDurationms": 0,
            "hasRelatedGameAd": false,
            "markTypes": null,
            "relateSong": [
            {
            "name": "Like A Star",
            "id": 1357582780,
            "pst": 0,
            "t": 0,
            "ar": [
            {
            "id": 31872922,
            "name": "Youngso Kim",
            "tns": [],
            "alias": []
            }
            ],
            "alia": [],
            "pop": 95,
            "st": 0,
            "rt": "",
            "fee": 0,
            "v": 5,
            "crbt": null,
            "cf": "",
            "al": {
            "id": 78397049,
            "name": "Like A Star",
            "picUrl": "http://p3.music.126.net/wbH04DUjhZMmuDaHenNsnw==/109951163986283044.jpg",
            "tns": [],
            "pic_str": "109951163986283044",
            "pic": 109951163986283040
            },
            "dt": 335996,
            "h": {
            "br": 320000,
            "fid": 0,
            "size": 13442656,
            "vd": -2
            },
            "m": {
            "br": 192000,
            "fid": 0,
            "size": 8065611,
            "vd": -2
            },
            "l": {
            "br": 128000,
            "fid": 0,
            "size": 5377088,
            "vd": -2
            },
            "a": null,
            "cd": "01",
            "no": 1,
            "rtUrl": null,
            "ftype": 0,
            "rtUrls": [],
            "djId": 0,
            "copyright": 0,
            "s_id": 0,
            "mst": 9,
            "cp": 0,
            "mv": 0,
            "rtype": 0,
            "rurl": null,
            "publishTime": 0,
            "privilege": {
            "id": 1357582780,
            "fee": 0,
            "payed": 0,
            "st": 0,
            "pl": 320000,
            "dl": 320000,
            "sp": 7,
            "cp": 1,
            "subp": 1,
            "cs": false,
            "maxbr": 320000,
            "fl": 320000,
            "toast": false,
            "flag": 128,
            "preSell": false
            }
            }
            ],
            "relatedInfo": null,
            "videoUserLiveInfo": null,
            "vid": "9B1AD82AF34D7A035B8522D8BB6EB1C3",
            "durationms": 336000,
            "playTime": 982431,
            "praisedCount": 10568,
            "praised": false,
            "subscribed": false
            }
            },
            {
            "type": 1,
            "displayed": false,
            "alg": "onlineHotGroup",
            "extAlg": null,
            "data": {
            "alg": "onlineHotGroup",
            "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
            "threadId": "R_VI_62_D6E7E744C6FE8D65F5F6D9AA19113000",
            "coverUrl": "https://p2.music.126.net/hHdzcwYtFfZM6AdHFBXaHg==/109951164209188393.jpg",
            "height": 1080,
            "width": 1920,
            "title": "【(G)I-DLE】LOL总决赛开幕式 全昭妍Pop Stars饭拍",
            "description": "【(G)I-DLE】LOL总决赛开幕式 全昭妍《Pop/Stars》饭拍，小狐狸气场两米八",
            "commentCount": 377,
            "shareCount": 654,
            "resolutions": [
            {
            "resolution": 240,
            "size": 52665763
            },
            {
            "resolution": 480,
            "size": 84545388
            },
            {
            "resolution": 720,
            "size": 125910790
            },
            {
            "resolution": 1080,
            "size": 135223318
            }
            ],
            "creator": {
            "defaultAvatar": false,
            "province": 310000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/vYHGILLfWWof6ogz1HwxKQ==/109951164491145822.jpg",
            "accountStatus": 0,
            "gender": 2,
            "city": 310101,
            "birthday": 1262275200000,
            "userId": 1335061865,
            "userType": 204,
            "nickname": "仙宫频道",
            "signature": "plmm爱好者/个人收藏bot",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951164491145820,
            "backgroundImgId": 109951164829202080,
            "backgroundUrl": "http://p1.music.126.net/PNGXsjXd_IYT0vvkXeoonQ==/109951164829202086.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
            "1": "音乐视频达人",
            "2": "音乐图文达人"
            },
            "djStatus": 10,
            "vipType": 0,
            "remarkName": null,
            "avatarImgIdStr": "109951164491145822",
            "backgroundImgIdStr": "109951164829202086"
            },
            "urlInfo": {
            "id": "D6E7E744C6FE8D65F5F6D9AA19113000",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/1fXL3az1_2127662561_uhd.mp4?ts=1642478174&rid=CED16A41E5018CA291C3A1B7FCD5AF64&rl=3&rs=FtqpUHYrPbcqoEaGYTRMslONIfHxcAsc&sign=5de4f379c5dac0b116692157eec323c3&ext=ClH2p%2B%2BDmoyOVAgK8byePGlWvWUL2HGiTHwnChoGMs0gFRTNc6EGuw9rISbDFHN8xjZ2hRWnmifYMIa7q%2BR75l0Erdb%2B5XTByQnWAtaqO8H1XiA%2F0eQH0tl3MIKTsWJ1DdKxuoA5MkmE%2Fvv5zuXrCo9PX%2FlnbDbsrPzoGLCHSQY1lTu8R1l5SRtXz2OCyEAOmuDohhrH8WG6ZR55BVoyf3PQOUp2XZkH0mlnzBHiD0B%2Fr%2B582t4ZFF8RqUul5qf2",
            "size": 135223318,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 1080
            },
            "videoGroup": [
            {
            "id": 58100,
            "name": "现场",
            "alg": null
            },
            {
            "id": 1101,
            "name": "舞蹈",
            "alg": null
            },
            {
            "id": 1100,
            "name": "音乐现场",
            "alg": null
            },
            {
            "id": 5100,
            "name": "音乐",
            "alg": null
            }
            ],
            "previewUrl": null,
            "previewDurationms": 0,
            "hasRelatedGameAd": false,
            "markTypes": null,
            "relateSong": [
            {
            "name": "POP/STARS",
            "id": 1321385655,
            "pst": 0,
            "t": 0,
            "ar": [
            {
            "id": 30611063,
            "name": "K/DA",
            "tns": [],
            "alias": []
            },
            {
            "id": 827791,
            "name": "Madison Beer",
            "tns": [],
            "alias": []
            },
            {
            "id": 14055085,
            "name": "(G)I-DLE",
            "tns": [],
            "alias": []
            },
            {
            "id": 12475103,
            "name": "Jaira Burns",
            "tns": [],
            "alias": []
            }
            ],
            "alia": [
            "英雄联盟2018全球总决赛·决赛开幕式开场曲"
            ],
            "pop": 100,
            "st": 0,
            "rt": null,
            "fee": 8,
            "v": 36,
            "crbt": null,
            "cf": "",
            "al": {
            "id": 74149887,
            "name": "POP/STARS",
            "picUrl": "http://p4.music.126.net/CaFZORZOOdE3acaCqMxn2Q==/109951163861068723.jpg",
            "tns": [],
            "pic_str": "109951163861068723",
            "pic": 109951163861068720
            },
            "dt": 191208,
            "h": {
            "br": 320000,
            "fid": 0,
            "size": 7650787,
            "vd": -27100
            },
            "m": {
            "br": 192000,
            "fid": 0,
            "size": 4590489,
            "vd": -24600
            },
            "l": {
            "br": 128000,
            "fid": 0,
            "size": 3060341,
            "vd": -23300
            },
            "a": null,
            "cd": "01",
            "no": 1,
            "rtUrl": null,
            "ftype": 0,
            "rtUrls": [],
            "djId": 0,
            "copyright": 2,
            "s_id": 0,
            "mst": 9,
            "cp": 743010,
            "mv": 10829259,
            "rtype": 0,
            "rurl": null,
            "publishTime": 1541174400007,
            "privilege": {
            "id": 1321385655,
            "fee": 8,
            "payed": 0,
            "st": 0,
            "pl": 128000,
            "dl": 0,
            "sp": 7,
            "cp": 1,
            "subp": 1,
            "cs": false,
            "maxbr": 320000,
            "fl": 128000,
            "toast": false,
            "flag": 5,
            "preSell": false
            }
            }
            ],
            "relatedInfo": null,
            "videoUserLiveInfo": null,
            "vid": "D6E7E744C6FE8D65F5F6D9AA19113000",
            "durationms": 225427,
            "playTime": 2540400,
            "praisedCount": 12841,
            "praised": false,
            "subscribed": false
            }
            }]
        let videoList = this.data.videoList
        //将视频最新数据更新原有视频列表数据中
        videoList.push(...newVideoList)
        this.setData({
            videoList
        })
    },
    //跳转至搜索界面
    toSearch() {
        wx.navigateTo({
          url: '/pages/search/search',
        })
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
        console.log('页面下拉刷新')
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        console.log('页面上拉触底')
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function ({from}) {
        console.log(from)
        if (from === 'button') {
            return {
                title: '来自button的转发',
                page: '/pages/video/video',
                imageUrl: '/static/images/nvsheng.jpg'
            }
        } else {
            return {
                title: '来自menu的转发',
                page: '/pages/video/video',
                imageUrl: '/static/images/nvsheng.jpg'
            }
        }
    }
})