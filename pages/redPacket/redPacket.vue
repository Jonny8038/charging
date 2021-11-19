<template>
	<view>
		<view v-if="packerState != 3" class="packer-box flex-column">
			<view class="packer-bg anim-ease-in" :class="{ 'anim-fade-out': packerState == 2 }"></view>
			<view class="packer-bottom-box anim-ease-in" :class="{ 'anim-out-bottom': packerState == 2 }">
				<view class="arc-bottom-edge"></view>
				<view class="packer-bottom-bg"></view>
			</view>
			<view class="packer-top-box anim-ease-in" :class="{ 'anim-out-top': packerState == 2 }">
				<view class="flex-row sender-info">
					<image class="sender-avatar"></image>
					<view>{{redname}}发出的红包</view>
				</view>
				<view class="packer-greeting double-text">{{'恭喜发财，大吉大利'}}</view>
				<view class="arc-edge"></view>
				<view v-if="packerState == 1" class="anim-rotate packer-btn-pos">
					<view class="packer-btn" style="transform: translateZ(-4px);">開</view>
					<view class="packer-btn-middle" v-for="(item, index) in 7" :key="index"
						:style="{transform: `translateZ(${index - 3}px)`}"></view>
					<view class="packer-btn packer-btn-front">開</view>
				</view>
				<view v-else class="packer-btn packer-btn-pos" @click="openPacker">開</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				redname:"Jonny",
				packerState: 0
			}
		},
		methods: {
			openPacker() {
				// 加载数据，触发硬币旋转动画
				this.packerState = 1;
				this.request(() => {
					// 调用抢红包接口成功，触发开红包动画
					this.packerState = 2;
					// 开红包动画结束后，移除相关节点，否则会阻挡其它下层节点
					setTimeout(() => {
						this.packerState = 3;
					}, 500);
				})

			},
			request(success) {
				setTimeout(() => {
					success()
				}, 3000);
			}
		}
	}
</script>

<style>
	.flex-row {
		display: flex;
		flex-direction: row;
		position: relative;
	}

	.flex-column {
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.packer-box {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 99;
		color: rgb(235, 205, 153);
		padding: 60rpx;
	}

	.packer-bg {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #fff;
	}

	.packer-top-box {
		width: 600rpx;
		background-color: rgb(244, 94, 77);
		text-align: center;
		margin: auto;
		transform: translateY(-160rpx);
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;
		position: relative;
	}

	.sender-info {
		margin-top: 200rpx;
		justify-content: center;
		line-height: 60rpx;
		font-size: 36rpx;
	}

	.sender-avatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 10rpx;
		background-color: #fff;
		margin-right: 10rpx;
	}

	.packer-greeting {
		font-size: 48rpx;
		line-height: 60rpx;
		height: 120rpx;
		margin: 40rpx 30rpx 200rpx;
	}

	.arc-edge {
		position: relative;
	}

	.arc-edge::after {
		width: 100%;
		height: 200rpx;
		position: absolute;
		left: 0;
		top: -100rpx;
		z-index: 9;
		content: '';
		border-radius: 50%;
		background-color: rgb(244, 94, 77);
		box-shadow: 0 6rpx 6rpx 0 rgba(0, 0, 0, 0.1);
	}

	.packer-bottom-box {
		transform: translate(-50%, 0);
		width: 600rpx;
		height: 360rpx;
		border-bottom-left-radius: 30rpx;
		border-bottom-right-radius: 30rpx;
		overflow: hidden;
		position: absolute;
		bottom: calc(50% - 440rpx);
		left: 50%;
	}

	.anim-ease-in {
		animation-duration: 0.5s;
		animation-timing-function: ease-in;
		animation-fill-mode: forwards;
	}

	.anim-out-top {
		animation-name: slideOutTop;
	}

	.anim-out-bottom {
		animation-name: slideOutBottom;
	}

	.anim-fade-out {
		animation-name: fadeOut;
	}

	@keyframes fadeOut {
		from {
			opacity: 1;
		}

		to {
			opacity: 0;
		}
	}

	@keyframes slideOutTop {
		from {
			transform: translateY(-160rpx);
		}

		to {
			transform: translateY(-200%);
		}
	}

	@keyframes slideOutBottom {
		from {
			transform: translate(-50%, 0);
		}

		to {
			transform: translate(-50%, 200%);
		}
	}

	.arc-bottom-edge {
		position: relative;
	}

	.arc-bottom-edge::after {
		width: 120%;
		height: 200rpx;
		position: absolute;
		left: -10%;
		top: -100rpx;
		z-index: 8;
		content: '';
		border-radius: 50%;
		box-shadow: 0 60rpx 0 0 rgb(242, 85, 66);
	}

	.packer-bottom-bg {
		background-color: rgb(242, 85, 66);
		height: 280rpx;
		margin-top: 100rpx;
	}

	.packer-btn {
		border-radius: 50%;
		width: 200rpx;
		height: 200rpx;
		line-height: 200rpx;
		font-size: 80rpx;
		text-align: center;
		color: #333;
		background-color: rgb(235, 205, 153);
		box-shadow: 0 0 6rpx 0 rgba(0, 0, 0, 0.1);
	}

	.packer-btn-pos {
		transform: translateX(-50%);
		position: absolute;
		left: 50%;
		z-index: 10;
		bottom: -200rpx;
	}

	.packer-btn-front {
		position: absolute;
		top: 0;
		transform: translateZ(4px);
	}

	.packer-btn-middle {
		position: absolute;
		top: 0;
		border-radius: 50%;
		width: 200rpx;
		height: 200rpx;
		background-color: rgb(235, 180, 120);
	}

	.anim-rotate {
		margin-left: -100rpx;
		transform-style: preserve-3d;
		animation: rotate 1s linear infinite;
	}

	@keyframes rotate {
		0% {
			transform: rotateY(0deg);
		}

		100% {
			transform: rotateY(360deg);
		}
	}
</style>
