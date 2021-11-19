<template>
	<view class="container">
		<view class="content">
			<view class="xtgg">
				<text class="iconfont icon-a-lujing471"></text>
				<!-- 系统公告：正式内测 -->
				<view class="ggri">
					<textscroll :list="gglist"/>
				</view>
			</view>
			<map id="map" :scale="scale" :markers="markers" :longitude="longitude" :latitude="latitude"
				@markertap="showModal"></map>

			<view class="zximg" v-show="dwSta">
				<image :src='imgUrl+"marker1.png"' />
			</view>
			<view class="right">
				<!-- <view class="item item3" @click="">联系客服</view> -->
				<button class="item item3" open-type='contact' session-from=''>联系客服</button>
				<view class="item item1" @click="reflash">
					<text class="iconfont icon-a-lujing409"></text>
				</view>
				<view class="item item2" @click="getdqwz">
					<text class="iconfont icon-a-zu476"></text>
				</view>
			</view>
			<view class="bottk" :hidden="showState" @click="clickMb"> </view>
			<view class="bot mdxx" :hidden="showState">
				<view class="sqbtn iconfont icon-a-lujing279" @click="closeFun"></view>
				<view class="xx1">
					<view class="xx1le">
						<view class="wz">
							<view v-if="dtDetaile.istype==1" class="mdstate">营业</view>
							<view v-if="dtDetaile.istype==2" class="mdstate mdstate1">停业</view>
							<view class="mdname" :data-id="dtDetaile.id" :data-jl="dtDetaile.distance"
								@click="goDetaile">{{dtDetaile.name}}</view>
						</view>
						<view class="mdtel" v-if="dtDetaile.phone" :data-tel="dtDetaile.phone" @click="callTel">
							<text class="iconfont icon-a-lujing424"></text>
							<text class="tel font26 color9">站场电话：{{dtDetaile.phone}}</text>
						</view>
					</view>
					<view class="xx1ri">
						<view class="dh" v-if="dtDetaile.zx&&dtDetaile.zy" :data-lng="dtDetaile.zx"
							:data-lat="dtDetaile.zy" :data-name="dtDetaile.name" :data-address="dtDetaile.address"
							@click="goDh">
							<text class="iconfont icon-a-lujing2821"></text>
							<text class="font26">导航</text>
						</view>
						<view class="jl font26 color9">{{dtDetaile.distance}}</view>
					</view>
				</view>
				<view class="xx2">
					<view class="xx2top">
						<view class="font26 color3 fontwe">电池充电情况</view>
						<view class="font26 color9">电池
							<text class="dcnum fontwe">{{dcNum?dcNum:0}}</text>
						</view>
					</view>
					<view class="xx2con">
						<block v-for="(value, key, index) in powerSpaceCount" :key="index">
							<view class="xx2item">
								<view>{{value}}</view>
								<view>{{key.split('-')[0]+'%~'+key.split('-')[1]+'%'}}</view>
							</view>
						</block>
					</view>
				</view>
				<view class="xx3"><text>预约须知：</text>预约成功后请尽快前往站场进行换电，订单保留 30分钟，超时将取消预约订单。</view>
				<view class="btn" v-if="dtDetaile.istype==1" :hidden="!dcState" :data-id="dtDetaile.id"
					:data-name="dtDetaile.zname" data-sta='1' @click="dtyyFun">
					<view class="iconfont icon-a-zu640"></view>
					<view>预约换电</view>
				</view>
				<view class="btn" :class="dtDetaile.istype==2?'btnho':''" v-if="dtDetaile.istype==2" :hidden="!dcState">
					<view class="iconfont icon-a-zu640"></view>
					<view>预约换电</view>
				</view>
			</view>
		</view>
		<!-- 地图预约成功 -->
		<view class="yytk" :hidden="successState">
			<view class="tkcon">
				<view class="tk">
					<view class="img">
						<image :src='imgUrl+"success.png"' />
					</view>
					<view class="tknr tknr1">
						<view class="tip1 font30 color3">恭喜你 电池检测通过</view>
						<view class="tip2 font38 color3 fontwe">已成功预约</view>
						<view class="tip4 font30 color6" v-if="dtDetaile.zx&&dtDetaile.zy"
							:data-lng="dtDetaile.zx" :data-lat="dtDetaile.zy" :data-name="dtDetaile.name"
							:data-address="dtDetaile.address" @click="goDh">去换电</view>
					</view>
				</view>
				<view class="iconfont icon-a-lujing415" data-sta='0' @click="yytkClose"></view>
			</view>
		</view>
		<!-- 地图预约失败 -->
		<view class="yytk" :hidden="failState">
			<view class="tkcon">
				<view class="tk sbtknr">
					<view class="img">
						<image :src='imgUrl+"fail.png"' />
					</view>
					<view class="tknr">
						<view class="tip1 font30 color3">很抱歉 电池检测异常</view>
						<view class="tip2 font38 color3 fontwe">预约失败</view>
						<view class="tip3 font30 color6" @click="goxyFun">去消除异常</view>
					</view>
				</view>
				<view class="iconfont icon-a-lujing415" data-sta='1' @click="yytkClose"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import textscroll  from '@/components/screenTextScroll/screenTextScroll.vue'
	import util from '../../utils/WSCoordinate.js'
	export default {

		data() {
			return {
				imgUrl: getApp().globalData.imgUrl,
				cityname: '',
				showState: true,
				dcState: true,
				successState: true,
				failState: true,
				scale: 16,
				latitude: 0,
				longitude: 0,
				markers: [],
				dwSta: true,
				dtDetaile: {},
				powerSpaceCount:{},
				distance:'',
				dcNum: '',
				gglist: []
			}
		},
		components: {
			textscroll
		},
		methods: {
			// 跳转到内容页
			goDetaile(e) {
				var id = e.currentTarget.dataset.id
				uni.navigateTo({
					url: '../../pages/detaile/detaile?id=' + id + '&jl=' + e.currentTarget.dataset.jl,
				});
			},
			// 地图详情预约
			dtyyFun: function(e) {
				this.dcState = true
				this.yyreserv(e.currentTarget.dataset.id, e.currentTarget.dataset.name, e.currentTarget.dataset.sta);
			},
			reflash: function() {
				this.markers = [];
				this.getalllist();
				this.scale = 16;
				uni.showLoading({
					title: '刷新中。。。'
				});
			},
			getdqwz: function() {
				var that = this;
				uni.showLoading({
					title: '位置获取中。。。'
				});
				//获取当时位置
				uni.getLocation({
					type: 'gcj02',
					altitude:true,
					success: (res) => {
						uni.hideLoading();
						console.log(res);
						let marker = {
							id: Number(0),
							longitude: res.longitude,
							latitude: res.latitude,
							iconPath: that.imgUrl + "marker1.png",
							width: 39,
							height: 53
						};
						var list = that.markers;
						list.push(marker);
						that.scale = 16;
						that.longitude = res.longitude;
						that.latitude = res.latitude;
						that.markers = list;
						that.currentPage = 1;
						that.dwSta = false;
					}
				});
			},
			getalllist() {
				var that = this;
				/** 将GCJ-02(火星坐标)转为百度坐标*/
				var hxzbd = util.transformFromGCJToBaidu(this.latitude, this.longitude);
				this.$http.sendRequest('/appsite/alllist', 'POST', {
					city: this.cityname,
					jd: hxzbd.longitude,
					wd: hxzbd.latitude
				}).then(res => {
					if (res.data.code == 200) {
						uni.hideLoading();
						var arr = [];
						res.data.data.forEach(item => {
							/**将百度坐标转为GCJ-02(火星坐标) */
							var bdzhx = util.transformFromBaiduToGCJ(item.zy, item.zx);
							if (item.istype == 1) { //1营业
								var obj = {
									id: Number(item.id),
									longitude: bdzhx.longitude,
									latitude: bdzhx.latitude,
									iconPath: that.imgUrl + "marker2.png",
									width: 48,
									height: 62
								}
							} else if (item.istype == 2) { //2停业
								var obj = {
									id: Number(item.id),
									longitude: bdzhx.longitude,
									latitude: bdzhx.latitude,
									iconPath: that.imgUrl + "marker3.png",
									width: 48,
									height: 62
								}
							}
							that.markers.push(obj)
						});
						arr = that.markers;
						that.markers = arr
					}
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: err.data.msg,
					})
				})
			},
			// 点击地图上面的标记点
			showModal: function(e) {
				console.log('111', e.detail.markerId);
				var that = this;
				var token = uni.getStorageSync('token') || '';
				if (e.detail.markerId != 0) {
					this.$http.sendRequest('/appsite/sitedetails', 'POST', {
						sid: e.detail.markerId
					}).then(res => {
						var distance = 0;
						if (res.data.code == 200) {
							if (res.data.zy != null && res.data.data.zx != '') {
								distance = that.getDistance(that.latitude, that.longitude, res.data
									.data.zy, res.data.data.zx);
							}

							that.showState = false;
							if (res.data.data != null) {
								that.dtDetaile = res.data.data;
							}
							if (res.data.powerSpaceCount != null) {
								that.powerSpaceCount = res.data.powerSpaceCount;
							}
							that.dtDetaile.distance = distance;
							that.dcNum = res.data.siztdatasize;
						} else {
							uni.showToast({
								icon: 'none',
								title: res.data.msg,
							})
						}
					}).catch(err => {
						uni.showToast({
							icon: 'none',
							title: '网络错误',
						})
					})
				} else {
					uni.showToast({
						icon: 'none',
						title: "点击了当前位置",
					})
				}
			},
			clickMb() {
				this.showState = true
			},
			Rad: function(d) { //根据经纬度判断距离
				return d * Math.PI / 180.0;
			},
			getDistance: function(lat1, lng1, lat2, lng2) {
				var radLat1 = this.Rad(lat1);
				var radLat2 = this.Rad(lat2);
				var a = radLat1 - radLat2;
				var b = this.Rad(lng1) - this.Rad(lng2);
				var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) *
					Math.pow(Math.sin(b / 2), 2)));
				s = s * 6378.137;
				s = Math.round(s * 10000) / 10000;
				s = s.toFixed(2) + '公里' //保留两位小数
				return s
			},
			closeFun: function() {
				this.showState = true
			},
			// 预约弹框关闭
			yytkClose: function(e) {
				if (e.currentTarget.dataset.sta == 0) {
					this.successState = true
				} else if (e.currentTarget.dataset.sta == 1) {
					this.failState = true
				}
			},
			//点击消除异常  
			goxyFun: function(e) {
				this.showState = true;
				this.failState = true
				uni.navigateTo({
					url: '../../pages/fjwd/fjwd'
				})
			},
			// 打电话
			callTel: function(e) {
				var phone = e.currentTarget.dataset.tel;
				if (phone != '') {
					uni.makePhoneCall({
						phoneNumber: phone,
					})
				}
			},
			// 跳转到导航
			goDh: function(e) {
				this.showState = true;
				this.successState = true;
				var bdzhx = util.transformFromBaiduToGCJ(e.currentTarget.dataset.lat, e.currentTarget.dataset.lng);
				uni.openLocation({
					latitude: bdzhx.latitude, //维度
					longitude: bdzhx.longitude, //经度
					name: e.currentTarget.dataset.name, //目的地定位名称
					scale: 15, //缩放比例
					address: e.currentTarget.dataset.address //导航详细地址
				});
			},
			// 列表预约
			lbyyFun: function(e) {
				//预约接口
				this.yyreserv(e.currentTarget.dataset.id);
			},
			yyreserv(id) {
				var that = this
				this.$http.sendRequest('/appreserv/create', 'POST', {
					siteId: id,
				}).then(res => {
					if (res.data.code == 200) {
						if(res.data.msg=="操作成功"){
							that.successState = false
							that.failState = true
						}else{
							that.successState = true
							that.failState = false
						}
					}else {
						uni.showToast({
							icon: 'none',
							title: res.data.msg,
							duration: 3000
						})
					}
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: "网络错误",
					})
				})
			},
			// 公告消息
			getggList: function(id) {
				var that = this;
				this.$http.sendRequest('/appsysmgs/platform/list', 'POST').then(res => {
					console.log('111', res);
					if (res.data.code == 200) {
						that.gglist = res.data.data
					}
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.data.msg,
					})

				})
			},
		},
		onLoad() {
			var that = this;
			//获取当时位置
			uni.getLocation({
				type: 'gcj02',
				success: (res) => {
					var list = [];
					that.longitude = res.longitude;
					that.latitude = res.latitude;
					that.getalllist();
				}
			});
			if(!uni.getStorageSync('token')){
				uni.redirectTo({
					url: '/pages/login/login'
				})
			}else{
				this.getggList();
			}
		}
	}
</script>

<style>
	.content {
		width: 100%;
		height: 100%;
	}

	.controls-title {
		width: 100%;
		height: 100%;
	}

	.xtgg {
		position: absolute;
		top: 20rpx;
		z-index: 2;
		margin-left: 24rpx;
		display: flex;
		padding: 0 20rpx;
		width: 702rpx;
		height: 70rpx;
		line-height: 70rpx;
		font-size: 26rpx;
		color: #000000;
		box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.06);
		background: rgba(255, 255, 255, 0.9);
		border-radius: 10rpx;
		box-sizing: border-box;
		overflow: hidden;
	}
	.ggri{
		    flex: 1;
		    position: relative;
	}
	.icon-a-lujing471 {
		margin-right: 10rpx;
		font-size: 28rpx;
		color: #01972C;
	}

	.right {
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		position: absolute;
		right: 10rpx;
		bottom: 100rpx;
		z-index: 999;
	}

	.right .item {
		padding: 10rpx;
		margin-bottom: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 60rpx;
		height: 60rpx;
		box-shadow: 0px 6rpx 12rpx rgba(0, 0, 0, 0.16);
		border-radius: 10rpx;
	}

	.right .item1,
	.right .item2 {
		background: #fff;
	}

	.right .iconfont {
		font-size: 48rpx;
	}

	.item3 {
		font-size: 22rpx;
		line-height: 26rpx;
		color: #FFFFFF;
		text-align: center;
		background: #212D43;
		box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.16);
		box-sizing: content-box;
	}

	map {
		width: 100%;
		height: 100%;
		z-index: 1;
	}

	.zximg {
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		top: 0;
		left: 0;
	}

	.zximg image {
		width: 74rpx;
		height: 104rpx;
		z-index: 2;
	}

	.bottk {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
	}

	.bot {
		display: none;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 999;
		display: flex;
		flex-direction: column;
		width: 100%;
		background: #FAFCFF;
		border-radius: 40rpx 40rpx 0px 0px;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.mobtn {
		display: flex;
		padding: 24rpx;
		height: 8rpx;
		border-radius: 40rpx;
	}

	.mobtn .tb {
		margin: 0 auto;
		width: 60rpx;
		height: 8rpx;
		background: #EAEAEA;
	}

	.btn {
		display: flex;
		justify-content: center;
		margin: 0 auto;
		width: 702rpx;
		height: 90rpx;
		line-height: 90rpx;
		color: #FAFCFF;
		background: #212D43;
		border-radius: 10rpx;
		text-align: center;
	}

	.btnho {
		background: #F4F4F3;
	}

	.btn .iconfont {
		margin-right: 10rpx;
	}

	.btn view:last-child {
		font-size: 26rpx;
	}

	.mdxx {
		padding: 0 24rpx;
		padding-bottom: 40rpx;
		box-sizing: border-box;
	}

	.icon-a-lujing279 {
		height: 56rpx;
		line-height: 56rpx;
		font-size: 20rpx;
		color: #EAEAEA;
		text-align: center;
	}

	.xx1 {
		display: flex;
		justify-content: space-between;
	}

	.wz {
		margin-bottom: 10rpx;
		display: flex;
		align-items: center;
		height: 50rpx;
	}

	.mdstate {
		width: 60rpx;
		height: 30rpx;
		font-size: 20rpx;
		color: #fff;
		text-align: center;
		background: #29BD5F;
		border-radius: 10rpx;
	}

	.mdstate1 {
		background: #999999;
	}

	.mdname {
		margin-left: 10rpx;
		font-size: 30rpx;
		color: #333;
		line-height: 21px;
		height: 50rpx;
		overflow: hidden;
	}

	.mdtel {
		display: flex;
	}

	.icon-a-lujing424 {
		margin-right: 10rpx;
		font-size: 32rpx;
	}

	.dh {
		margin-bottom: 10rpx;
		display: flex;
		justify-content: center;
		width: 130rpx;
		height: 50rpx;
		line-height: 50rpx;
		background: #FAFCFF;
		border: 2rpx solid #66676A;
		border-radius: 24rpx;

	}

	.icon-a-lujing2821 {
		margin-right: 10rpx;
		font-size: 30rpx;
	}

	.dh text:last-child {
		color: #212D43;
	}

	.jl {
		text-align: right;
	}

	.xx2 {
		margin-top: 24rpx;
		padding: 0 20rpx;
		width: 702rpx;
		background: #FFFFFF;
		box-shadow: 0px 0px 20rpx rgba(0, 0, 0, 0.05);
		border-radius: 10rpx;
		box-sizing: border-box;
	}

	.xx2top {
		display: flex;
		justify-content: space-between;
		height: 100rpx;
		line-height: 100rpx;
	}

	.dcnum {
		margin-left: 6rpx;
		color: #FF1D1D;
	}

	.xx2con {
		padding: 30rpx 0;
		border-top: 2rpx solid #F2F5F8;
		display: flex;
		justify-content: space-between;
	}

	.xx2item {
		display: flex;
		flex-direction: column;
		text-align: center;
	}

	.xx2item view:first-child {
		margin-bottom: 20rpx;
		height: 44rpx;
		font-size: 34rpx;
		font-weight: bold;
		line-height: 40rpx;
		color: #333333;

	}

	.xx2item view:last-child {
		height: 34rpx;
		font-size: 26rpx;
		line-height: 40rpx;
		color: #999999;
	}

	.xx3 {
		margin: 40rpx 0;
		height: 88rpx;
		font-size: 26rpx;
		line-height: 52rpx;
		color: #333333;
	}

	.xx3 text {
		font-weight: bold;
	}

	.icon-a-zu640 {
		margin-right: 10rpx;
	}

	.jcBtn {
		background: #F2F5F8;
	}

	.jcBtn view {
		font-weight: bold;
		color: #333;
	}

	.yytk {
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		z-index: 999;
		background: rgba(0, 0, 0, 0.4);
	}

	.tk {
		position: relative;
		width: 582rpx;
		height: 400rpx;
		background: #FFFFFF;
		border: 6rpx solid rgba(112, 213, 142, 0.2196078431372549);
		box-shadow: 0px 0px 20rpx rgba(0, 0, 0, 0.26);
		border-radius: 40rpx;
	}

	.tk .img {
		position: absolute;
		left: 232rpx;
		top: -59rpx;
		height: 118rpx;
		width: 118rpx;
	}

	.tk image {
		height: 118rpx;
		width: 118rpx;
	}

	.tknr {
		margin-top: 108rpx;
		text-align: center;
	}

	.tknr1 {
		margin-top: 144rpx;
	}

	.tip1 {
		margin: 0 auto;
		margin-bottom: 20rpx;
		width: 320rpx;
		line-height: 40rpx;
	}

	.icon-a-lujing415 {
		margin-top: 40rpx;
		font-size: 64rpx;
		text-align: center;
	}

	.sbtknr {
		border: 6px solid #EAEAEA;
	}

	.tip3 {
		margin: 0 auto;
		margin-top: 40rpx;
		width: 400rpx;
		height: 70rpx;
		line-height: 70rpx;
		background: #F2F5F8;
		border-radius: 10rpx;
	}

	.tip4 {
		margin: 0 auto;
		margin-top: 40rpx;
		width: 400rpx;
		height: 70rpx;
		line-height: 70rpx;
		color: #fff;
		background: #212D43;
		border-radius: 10rpx;
	}
</style>
