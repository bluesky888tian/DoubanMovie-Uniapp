<template>
	<view class="page">
		
		<!-- 视频播放 start -->
		<view class="player">
			<button type="default" @click="sharephoto" class="sharephoto" v-if="isShow && generateimage.success==null">查看分享大图</button>
			<image 
				id="myTrailer"
				:src="generateimage.image"
				class="movie"
				:webp="true"></image>
		</view>
		<!-- 视频播放 end -->
		
		<!-- 影片基本信息 start -->
		<view class="movie-info">
		
			<navigator :url="'../cover/cover?cover=' + trailerInfo['data'][0].poster">
				<image 
					:src="trailerInfo['data'][0].poster" 
					class="cover"></image>
			</navigator>
			
			<view class="movie-desc">
				<view class="title">{{trailerInfo["data"][0].name}}</view>
				<view class="basic-info">{{trailerInfo["data"][0].genre}}</view>
				<view class="basic-info">{{trailerInfo.originalName}}</view>
				<view class="basic-info">{{trailerInfo["data"][0].country}}</view>
				<view class="basic-info">{{trailerInfo.dateReleased}}</view>
				
				<view class="score-block">
					
					<view class="big-score">
						<view class="score-words">综合评分：</view>
						<view class="movie-score">{{trailerInfo.doubanRating}}</view>
					</view>
					
					<view class="score-stars">
						<block v-if="trailerInfo.doubanRating >= 0">
							<trailerStars :innerScore="trailerInfo.doubanRating" showNum="1"></trailerStars>
						</block>
						
						<view class="prise-counts">
							{{trailerInfo.doubanVotes}}  人评分
						</view>
					</view>
					
				</view>
			</view>
		</view>
		<!-- 影片基本信息 end -->
		
		<view class="line-wapper">
			<view class="line"></view>
		</view>
		
		<!-- 剧情简介 start -->
		<view class="plots-block">
			<view class="plots-title">剧情简介</view>
			<view class="plots-desc">{{trailerInfo["data"][0].description}}</view>
		</view>
		<!-- 剧情简介 end -->
		
		<!-- 演职人员 start -->
		<view class="scroll-block">
			<view class="plots-title">演职人员</view>
			<scroll-view scroll-x class="scroll-list">
				
				<view class="actor-wapper" v-for="(director,staffIndex) in trailerInfo.director">
					 <view class="actor-wapper" v-for="(good,index) in director.data" >
				<!-- 无图片	<image 
						:src="director.photo"
						class="single-actor"
						mode="aspectFill"
						@click="lookStaffs"
						:data-staffIndex="staffIndex"
					></image> -->
					<view :class="'actor-name'+index" >{{good.name}}</view>
					<view :class="'actor-role' + index">导演</view>
					</view>
				</view>
				
				<view class="actor-wapper" v-for="(writer,writerIndex) in trailerInfo.writer">
					<view class="actor-wapper" v-for="(list,index) in writer.data" >
				
				
					<view :class="'actor-name'+index" >{{list.name}}</view>
					<view :class="'actor-role' + index">编剧</view>
					</view>
				</view>
				
				<view class="actor-wapper" v-for="(actor,actorIndex) in trailerInfo.actor">
					<view class="actor-wapper" v-for="(item,index) in actor.data" >
				
					
					<view :class="'actor-name'+index" >{{item.name}}</view>
					<view :class="'actor-role' + index">演员</view>
					</view>
				</view>
				
		
			</scroll-view>
		</view>
		<!-- 演职人员 end -->
		
		<!-- 剧照 start  API无剧照
		<view class="scroll-block">
			<view class="plots-title">剧照</view>
			<scroll-view scroll-x class="scroll-list">
				<image 
					v-for="(img, imgIndex) in plotPicsArray"
					:src="img"
					class="plot-image"
					mode="aspectFill"
					@click="lookMe"
					:data-imgIndex="imgIndex"
				></image>
			</scroll-view>
		</view> -->
		<!-- 剧照 end -->
		
	</view>
</template>

<script>
	import trailerStars from "../../components/trailerStars.vue";
	
	export default {
		data() {
			return {
				trailerInfo: {},
				generateimage:{},
				isShow:true
				//plotPicsArray: [],	// 剧照
				//directorArray: [],	// 导演列表
				//actorArray: []		// 演员列表
			};
		},
		// 页面初次渲染完成，获得视频上下文对象
	/*	onReady() {
			this.videoContext = uni.createVideoContext('myTrailer');
		},
		onHide() {
			// 页面被隐藏的时候，暂停播放
			this.videoContext.pause();
		},
		onShow() {
			// 页面被再次显示的时候，可以继续播放
// 			if (this.videoContext) {
// 				this.videoContext.play();
// 			}
		},*/
		onLoad(params) {
			var me = this;
			// 获取上一个页面传入的参数
			var doubanId = params.doubanId;
			
			// 通过api修改导航栏的属性
			uni.setNavigationBarColor({
				frontColor: "#000000",
				backgroundColor: "#f7f4f9"
			});
			
			// 获取预告片的详细信息
			var serverUrl = me.serverUrl;
			uni.request({
				url: serverUrl + '/movie/api?id=' + doubanId,
				success: (res) => {
					if (res.statusCode == 429) {
						    uni.showToast({
						    	title:"请求过快!",
								icon:"error",
								duration:5000
						    })
						}
					// 获取真实数据之前，务必判断状态是否为200
						var trailerInfo = res.data;
						me.trailerInfo = trailerInfo;
					//	console.log(res.data);
						// 把剧照的字符串转换为json array
					//	var plotPicsArray = JSON.parse(trailerInfo.plotPics);
					//	me.plotPicsArray = plotPicsArray;
				}
			});
			//获取分享图（太多请求，429）
		/*	uni.request({
				url: serverUrl + '/movie/api/generateimage?doubanId='+ doubanId+'&lang=Cn',
				success: (res) => {
					// 获取真实数据之前，务必判断状态是否为200
						var generateimage = res.data;
						me.generateimage = generateimage;
						console.log(res.data);
				}
			});*/
			
			// 获取导演
		/*	uni.request({
				url: serverUrl + '/search/staff/' + trailerId + '/1',
				method: "POST",
				success: (res) => {
					// 获取真实数据之前，务必判断状态是否为200
					if (res.data.status == 200) {
						me.directorArray = res.data.data;
						// debugger;
					}
				}
			});
			
			// 获取获取演员
			uni.request({
				url: serverUrl + '/search/staff/' + trailerId + '/2',
				method: "POST",
				success: (res) => {
					// 获取真实数据之前，务必判断状态是否为200
					if (res.data.status == 200) {
						me.actorArray = res.data.data;
						// debugger;
					}
				}
			});*/
		},
		// 此函数仅仅只支持在小程序端的分享，分享到微信群或者微信好友
		onShareAppMessage(res) {
			var me = this;
			return {
			  title: me.trailerInfo["data"][0].name,
			  path: '/pages/movie/movie?doubanId=' + me.trailerInfo.doubanId
			}
		},
		// 监听导航栏的按钮
		onNavigationBarButtonTap(e) {
			var index = e.index;
			// console.log(index);
			var me = this;
			var trailerInfo = me.trailerInfo;
			var trailerId = trailerInfo.id;
			var trailerName = trailerInfo.name;
			var cover = trailerInfo.cover;
			var poster = trailerInfo.poster;
			
			// index 为0 则分享
			if (index == 0) {
				uni.share({
					provider: "weixin",
					scene: "WXSenceTimeline",
					type: 0,
					href: "http://www.imovietrailer.com/#/pages/movie/movie?trailerId=" + trailerId,
					title: "NEXT超英预告：《" + trailerName + "》",
					summary: "NEXT超英预告：《" + trailerName + "》",
					imageUrl: cover,
					success: function (res) {
						console.log("success:" + JSON.stringify(res));
					}
				});
			}
		},
		methods: {
			sharephoto(){
				var me = this;
				var trailerInfo = me.trailerInfo;
				var doubanId = trailerInfo.doubanId;
			    var serverUrl = me.serverUrl;
				uni.request({
						url: serverUrl + '/movie/api/generateimage?doubanId='+ doubanId+'&lang=Cn',
						success: (res) => {
							if (res.statusCode == 429) {
								    uni.showToast({
								    	title:"请求过快!",
										icon:"error",
										duration:5000
								    })
								}
								var generateimage = res.data;
								me.generateimage = generateimage;
								
						}
					});
				
			}
		/*	lookMe(e) {
				var me = this;
				var imgIndex = e.currentTarget.dataset.imgindex;
				
				uni.previewImage({
					current: me.plotPicsArray[imgIndex],
					urls: me.plotPicsArray
				})
			},
			lookStaffs(e) {
				var me = this;
				var staffIndex = e.currentTarget.dataset.staffindex;
				
				// 拼接导演和演员的数组，成为一个新数组
				var directorArray = me.directorArray;
				var actorArray = me.actorArray;
				var newStaffArray = [];
				newStaffArray = newStaffArray.concat(directorArray).concat(actorArray);
				
				var urls = [];
				for (var i = 0; i < newStaffArray.length ; i ++) {
					var tempPhoto = newStaffArray[i].photo;
					urls.push(tempPhoto);
				}
				
				uni.previewImage({
					current: urls[staffIndex],
					urls: urls
				})
			}*/
		},
		
		components: {
			trailerStars
		}
	}
</script>

<style>
	@import url("movie.css");
</style>
