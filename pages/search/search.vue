<template>
	<view class="page">
		
		<view class="search-block">
			
			<view class="search-ico-wapper">
				<image src="../../static/icos/search.png" class="search-ico"></image>
			</view>
			
			<input 
				placeholder="搜索..." 
				maxlength="10" 
				class="search-text" 
				confirm-type="search"
				@confirm="searchMe"
			/>
		</view>
		<view class="page-block guess-u-like">
			   
				<view class="single-like-movie" v-for="(guess,gIndex) in trailerList">
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
		
		<view class="movie-list page-block" v-if="isShow&&trailerList.length==0">
			
			<view class="movie-wapper" v-for="(trailer,index) in toplist">
				<view class="movie-wapper" v-for="(item,index) in trailer.data">
				
				<image 
					:src="item.poster" 
					:data-doubanId="trailer.doubanId"
					@click="showTrailer"
					class="poster"></image>
			</view>
		</view>  
		
			
		</view> 
		
	</view>
</template>

<script>
	import trailerStars from "../../components/trailerStars.vue";
	
	export default {
		data() {
			return {
				trailerList: [],
				toplist:[],
				animationData: {},
				animationDataArr: [
					{}, {}, {}, {}, {}
				],
				keywords: "",			// 搜索的关键字
				skip: 0,				// 当前第几页
				totalPages: 1,			// 总页数
				isShow:true
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
			
			
			var me = this;
			
			uni.showLoading({
				mask: true,
				title: "请稍后..."
			});
			uni.showNavigationBarLoading();
			
			var serverUrl = me.serverUrl;
			// 查询猜你喜欢数据列表
			uni.request({
			
				url: serverUrl + '/api/v1/top?type=Imdb&skip=0&limit=27&lang=Cn',
				success: (res) => {
					// 获取真实数据之前，务必判断状态是否为200

						// debugger;
						var toplist = res.data;
						me.toplist = toplist;

				},
				complete: () => {
					uni.hideNavigationBarLoading();
					uni.hideLoading();
				}
			});
		},
		onShareAppMessage(res) {
			var me = this;
			return {
				title:'电影小程序',
				path:'/pages/index/index'
			}
		},
		onReachBottom() {
			var me = this;
			
			var skip = me.skip + 25;			// 查询下一页面，当前页数累加1
			var keywords = me.keywords;		// 获得当前页面中data里的搜索值
			 var totalPages = me.totalPages;	// 获取总页数
			
			// 如果当前需要分页的分页数和总页数相等，就不分页
			if (skip > totalPages) {
				return;
			}
			
			me.pagedTrailerList(keywords, skip, 25);
			
		},
		methods: {
			 
			showTrailer(e) {
				var doubanId = e.currentTarget.dataset.doubanid;
				console.log(doubanId)
				// 页面跳转接口api
				uni.navigateTo({
					url: "../movie/movie?doubanId=" + doubanId
				})
			},
			pagedTrailerList(keywords, skip, pageSize) {
				var me = this;
				
				uni.showLoading({
					mask: true,
					title: "请稍后..."
				});
				uni.showNavigationBarLoading();
				
				var serverUrl = me.serverUrl;
				// 查询猜你喜欢数据列表
				uni.request({
					url: serverUrl + '/api/v1/movie/search?q=' + keywords
															+ '&skip=' + skip
															+ '&limit=' + pageSize,
														
					success: (res) => {
						if (res.statusCode == 429) {
							    uni.showToast({
							    	title:"请求过快!",
									icon:"error",
									duration:5000
							    })
							}
						// 获取真实数据之前，务必判断状态是否为200
							var trailerList = res.data;
							me.trailerList = trailerList;	// 覆盖当前页面里的page
							me.totalPages = res.data.length;
							console.log(res.data.length);
						//	console.log(res.statusCode);

					},
					complete: () => {
						uni.hideNavigationBarLoading();
						uni.hideLoading();
					}
				});
			},
			searchMe(e) {
				var me = this;
				// 获取搜索的内容
				var value = e.detail.value;
				me.keywords = value;
				me.trailerList = [];
				
				me.pagedTrailerList(value, 0, 25);
			},
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
	@import url("search.css"); 
	@import url("../index/index.css");
</style>
