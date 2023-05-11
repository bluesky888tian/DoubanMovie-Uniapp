<template>
	<view class="page">

		<!-- 使用自定义标签 -->
		<!-- <helloComp myval="Hello Next~~"></helloComp>
	   <trailerStars innerScore="5.1" showNum="0"></trailerStars> -->

		
		 <mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
		<!-- 猜你喜欢 start -->
		<view class="page-block super-hot">
			<view class="hot-title-wapper">
				<image src="../../static/icos/guess-u-like.png" class="hot-ico"></image>
				<view class="hot-title">
					豆瓣TOP250
				</view>
			</view>
			
		</view>


		<view class="page-block guess-u-like">
		   
			<view class="single-like-movie" v-for="(guess,gIndex) in guessULikeList">
				<view class="single-like-movie" v-for="(item,index) in guess.data">
				<navigator open-type="navigate" :url="'../movie/movie?doubanId=' + guess.doubanId">
					<image :src="item.poster" :webp="true" class="like-movie"></image>
				</navigator>
				
				<view class="movie-desc">
					<view class="movie-title">
						{{item.name}}
					</view>
					<trailerStars :innerScore="guess.doubanRating" showNum="1"></trailerStars>
					<view class="movie-info">
						{{item.genre}}
					</view>
					<view class="movie-info">
						{{item.country}}
					</view>
					<view class="movie-info">
						{{guess.dateReleased}}
					</view>
				</view>
				
				<view class="movie-oper" :data-gIndex="gIndex" @click="praiseMe">
					<image src="../../static/icos/praise.png" class="praise-ico"></image>
					<view class="praise-me">
						点赞
					</view>
					<view :animation="animationDataArr[gIndex]" class="praise-me animation-opacity">
						+1
					</view>
				</view>
			</view>
		</view>
		
	</view>
		<!-- 猜你喜欢 end -->
		</mescroll-body>
	</view>
</template>

<script>
	// import common from "../../common/common.js";
	// 导入自定义组件
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import trailerStars from "../../components/trailerStars.vue";

	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				guessULikeList: [],	
				animationData: {},
				animationDataArr: [
					{}, {}, {}, {}, {}
				]
			};
		},
		onUnload() {
			// 页面卸载的时候，清除动画数据
			this.animationData = {};
			this.animationDataArr = [
				{}, {}, {}, {}, {}
			];
		},


		onLoad() {
			var me = this;
			
			// #ifdef APP-PLUS || MP-WEIXIN
			// 在页面创建的时候，创建一个临时动画对象
			this.animation = uni.createAnimation();
			// #endif
			
			// 获取common.js中的服务器地址
			// var serverUrl = common.serverUrl;
			// 通过挂载到main.js中获取服务器的地址，作为全局变量
			var serverUrl = me.serverUrl;

			// 请求轮播图数据
			/*uni.request({
				url: serverUrl + '/api/v1/top?type=Douban&lang=Cn&limit=250',
				success: (res) => {
					 console.log(res.data);

					// 获取真实数据之前，务必判断状态是否为200
					if (res.data.status == 200) {
						var guessULikeList = res.data;
						me.guessULikeList = guessULikeList;
					}

				}
			});*/
 

			// 查询热门超英

			// 查询热门预告
			
		
			
				//刷新页面
		//	me.refresh();
		
			
		},
		onShareAppMessage(res) {
			var me = this;
			return {
				title:'电影小程序',
				path:'/pages/index/index'
			}
		},
		methods: {
			upCallback(page) {
				var me = this;
			 var serverUrl = me.serverUrl;
			 // 页码, 默认从1开始
			let limit = page.size;
			let skip = page.num// 页长, 默认每页10条
			uni.request({
				url: serverUrl + '/api/v1/top?type=Douban&lang=Cn&limit='+limit+'&skip='+skip,
				success: (res) => {
					// console.log(res.data);
					 let curPageData = res.data; 
					 let curPageLen = curPageData.length; 
					 if(page.num == 0) this.guessULikeList = []; //如果是第一页需手动制空列表
					 this.guessULikeList=this.guessULikeList.concat(res.data); 
					// 获取真实数据之前，务必判断状态是否为200
					this.mescroll.endSuccess(res.data.length);
			
				}
			});
		},
			/*refresh(){
				console.log(skip,limit);
				var me = this;
				
				uni.showLoading({
					mask: true
				});
				uni.showNavigationBarLoading();
		
				var serverUrl = me.serverUrl;
				// 查询猜你喜欢数据列表
	
				uni.request({
					url: serverUrl + '/api/v1/top?type=Douban&lang=Cn',
					success: (res) => {
						console.log(res.data);
						// 获取真实数据之前，务必判断状态是否为200
							var guessULikeList = res.data;
							me.guessULikeList = guessULikeList;
								},

						
					
					complete: () => {
						uni.hideNavigationBarLoading();
						uni.hideLoading();
						uni.stopPullDownRefresh();
					}
				});
				
			},*/

		
		
		/*pagedTrailerList(skip, limit) {
			var me = this;
			
			uni.showLoading({
				mask: true,
				title: "请稍后..."
			});
			uni.showNavigationBarLoading();
			
			var serverUrl = me.serverUrl;
			// 查询猜你喜欢数据列表
			uni.request({
				url: serverUrl + '/api/v1/top?type=Douban&lang=Cn&skip=' + skip
														+ '&limit=' + limit,
				success: (res) => {
					// 获取真实数据之前，务必判断状态是否为200
					if (res.data.status == 200) {
						// debugger;
						var guessULikeList = res.data;
						me.guessULikeList = me.guessULikeList.concat(guessULikeList);
					}
				},
				complete: () => {
					uni.hideNavigationBarLoading();
					uni.hideLoading();
				}
			});
		},*/
			// 实现点赞动画效果
			praiseMe(e) {
				// #ifdef APP-PLUS || MP-WEIXIN
				var gIndex = e.currentTarget.dataset.gindex;
			//	console.log(gIndex);
				// return;
				// 构建动画数据，并且通过step来表示这组动画的完成
				this.animation.translateY(-60).opacity(1).step({
					duration: 400
				});
				
				// 导出动画数据到view组件，实现组件的动画效果
				// this.animationData = this.animation.export();
				this.animationData = this.animation;
				this.animationDataArr[gIndex] = this.animationData.export();

				// 还原动画
				setTimeout(function() {
					this.animation.translateY(0).opacity(0).step({
						duration: 0
					});
					this.animationData = this.animation;
					this.animationDataArr[gIndex] = this.animationData.export();
				}.bind(this), 500)
				// #endif
			}
		},

		components: {
			trailerStars
		}
	}
</script>

<style>
	@import url("index.css");
</style>
