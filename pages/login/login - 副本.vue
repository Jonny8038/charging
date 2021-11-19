<template>
	<view class="container">
		<view class="login">
			<image class="dlbg" :src='imgUrl+"dlbg.png"' />
			<view class="dlcon">
				<view class="dltit">欢迎登录</view>
				<view class="dlform">
					<view class="dlitem">
						<input type="text" @blur="phone" :value="account" maxlength="11" placeholder="请输入手机号"
							placeholder-class="phcolor" />
					</view>
					<view class="dlitem">
						<input type="password" @input="getPassword" :value="password" placeholder="输入密码"
							placeholder-class="phcolor" />
					</view>
					<view class="dltip">
						<text @click="goregister">立即注册</text>
					</view>
					<view class="dbtn" @click="goIndex">登录</view>
				</view>
				<view class="dsf">
					<view class="dsftit">第三方账号登录</view>
					<button class="dsfcon" open-type="getPhoneNumber"
						@getphonenumber="getPhoneNumber">
					<image :src='imgUrl+"wx.png"' />
					<text>微信</text>
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '../../utils/WSCoordinate.js'
	export default {
		data() {
			return {
				imgUrl: getApp().globalData.imgUrl,
				account: '',
				password: ''
			}
		},

		methods: {
			getPhoneNumber: function(e) {
				var that = this;
				console.log('e', e);
				if (e.detail.errMsg == "getPhoneNumber:ok") {
					uni.login({
						provider: 'weixin',
						success({
							errMsg,
							code
						}) {
							if (errMsg == "login:ok") {
								that.$http.sendRequest('/wx/wxlogin', 'POST', {
									code: code,
									encryptedData: e.detail.encryptedData,
									iv: e.detail.iv,
								}).then(res => {
									console.log('’123123', res.data);
									if (res.data.code == 200) {
										uni.setStorageSync('tel', res.data.phoneNumber);
										uni.setStorageSync('token', res.data.token.access_token);
										if(res.data.carinfo){
											uni.setStorageSync('carId', res.data.carinfo.id);
										}
										uni.showToast({
											title: "登录成功",
											icon: 'success',
											duration: 2000,
											success() {
												setTimeout(() => {
													uni.redirectTo({
														url: '../index/index', //跳转至首页
													})
												}, 2000)
											}
										})
									} else {
										uni.showToast({
											icon: 'none',
											title: res.data.msg,
										})
									}
								}).catch(err => {
									uni.showToast({
										icon: 'none',
										title: "网络错误",
									})
								})
							}
						}
					});
				}
			},
			phone: function(e) {
				let phone = e.detail.value;
				let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
				if (!reg.test(phone)) {
					uni.showToast({
						title: '手机号码格式不正确',
						icon: "none",
						duration: 2000
					})
					return false;
				}
				this.account = e.detail.value
			},
			getPassword: function(e) {
				var value = e.detail.value;
				this.password = value
			},
			goregister: function() {
				wx.navigateTo({
					url: '../../pages/register/register'
				});
			},
			goIndex() {
				var that = this;
				if (that.account.length == 0 || that.password.length == 0) { //校验非空
					uni.showToast({ //弹框提示
						icon: 'none',
						title: '用户名或密码不能为空！',
						duration: 2000,
					})
				} else {
					this.$http.sendRequest('/wx/applogin', 'POST', {
						username: this.account,
						password: this.password
					}).then(res => {
						console.log('ssss', res.data.code);
						if (res.data.code == 200) {
							uni.setStorageSync('token', res.data.token.access_token);
							if(res.data.carinfo){
								uni.setStorageSync('carId', res.data.carinfo.id);
							}
							uni.showToast({
								title: "登录成功",
								icon: 'success',
								duration: 2000,
								success() {
									setTimeout(() => {
										uni.redirectTo({
											url: '../index/index', //跳转至首页
										})
									}, 2000)
								}
							})
						} else {
							uni.showToast({
								icon: 'none',
								title: res.data.msg,
							})
						}
					}).catch(err => {
						uni.showToast({
							icon: 'none',
							title: "网络错误",
						})
					})

				}

			}
		},
		onLoad() {

		}
	}
</script>

<style>
	.login {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.dlbg {
		width: 100%;
		height: 100%;

	}

	.dlcon {
		position: absolute;
		top: 200rpx;
		z-index: 1;
		width: 100%;
	}

	.dltit {
		margin-bottom: 120rpx;
		font-size: 54rpx;
		text-align: center;
		color: #FFFFFF;
		letter-spacing: 12rpx;
	}

	.dlform {
		margin: 0 auto;
		width: 626rpx;
	}

	.dlitem {
		margin: 20rpx 0;
		height: 90rpx;
		line-height: 90rpx;
		border-bottom: 4rpx solid #54CB77;
	}

	.dlitem input {
		height: 90rpx;
		line-height: 90rpx;
		font-size: 30rpx;
		color: #E1FFE9;
	}

	.phcolor {
		font-size: 30rpx;
		color: #E1FFE9;
	}

	.dltip {
		display: flex;
		justify-content: flex-end;
		height: 60rpx;
		line-height: 60rpx;
	}

	.dltip text {
		font-size: 26rpx;
		color: #fff;
	}

	.dbtn {
		margin: 0 auto;
		margin-top: 40rpx;
		width: 600rpx;
		height: 90rpx;
		line-height: 90rpx;
		font-size: 34rpx;
		color: #29BD5F;
		font-weight: bold;
		text-align: center;
		background: #FFFFFF;
		border-radius: 10rpx;
	}

	.dsftit {
		margin-top: 60rpx;
		font-size: 30rpx;
		color: #fff;
		text-align: center;
	}

	.dsfcon {
		padding: 0;
		background: none;
		display: flex;
		flex-direction: column;
		font-size: 30rpx;
		color: #fff;
		text-align: center;
	}

	.dsfcon image {
		margin: 30rpx auto;
		width: 120rpx;
		height: 120rpx;
	}
	.dsfcon::after{
		border:0
	}
</style>
