<template>
	<div class="addressContainer">
		<!-- 我是地址信息页面 -->
		<div class="checkout-addr">
	        <!-- process step -->
	        <div class="check-step">
	          <ul>
	            <li class="cur">地址确认</li>
	            <li>查看订单</li>
	            <li>支付</li>
	            <li>订单确认</li>
	          </ul>
	        </div>
	
	        <!-- address list -->
	        <div class="checkout-title">
	          <span>配送地址</span>
	        </div>
	        <div class="addr-list-wrap">
	          <div class="addr-list">
	            <ul>
	            	<!-- 基本写法：v-for="(item,index) in addressList" :key="index" -->
	              <li v-for="(item,index) in filterAddress" :key="index" :class="{'check': index==currentIndex}" @click="currentIndex = index">
	                <dl>
	                  <dt>{{ item.userName }}</dt>
	                  <dd class="address">{{ item.streetName }}</dd>
	                  <dd class="tel">{{ item.tel }}</dd>
	                </dl>
	                <div class="addr-opration addr-edit">
	                  <a href="javascript:;" class="addr-edit-btn">
	                    <svg class="icon icon-edit"><use xlink:href="#icon-edit"></use></svg>
	                  </a>
	                </div>
	                <div class="addr-opration addr-del">
	                  <a href="javascript:;" class="addr-del-btn" @click="deleteConfirm(item)">
	                    <svg class="icon icon-del"><use xlink:href="#icon-del"></use></svg>
	                  </a>
	                </div>
	                <div class="addr-opration addr-set-default" v-show="!item.isDefault">
	                  <a href="javascript:;" class="addr-set-default-btn" @click="setDefault(item.addressId)"><i>设为默认</i></a>
	                </div>
	                <div class="addr-opration addr-default" v-show="item.isDefault">默认地址</div>
	              </li>
	
	              <li class="addr-new" @click="addConfirm">
	                <div class="add-new-inner">
	                  <i class="icon-add">
	                    <svg class="icon icon-add"><use xlink:href="#icon-add"></use></svg>
	                  </i>
	                  <p >添加新地址</p>
	                </div>
	              </li>
	            </ul>
	          </div>
	
	          <div class="shipping-addr-more">
	            <a class="addr-more-btn up-down-btn" href="javascript:" @click="loadMore">
	              more
	              <i class="i-up-down">
	                <i class="i-up-down-l"></i>
	                <i class="i-up-down-r"></i>
	              </i>
	            </a>
	          </div>
	        </div>
	
	        <!-- shipping method-->
	        <div class="checkout-title">
	          <span>配送方式</span>
	        </div>
	        <div class="shipping-method-wrap">
	          <div class="shipping-method">
	            <ul>
	              <li :class="{'check':shipmethodIndex == 1}" @click="shipmethodIndex = 1">
	                <div class="name">标准配送</div>
	                <div class="price">Free</div>
	              </li>
	              <li :class="{'check':shipmethodIndex == 2}" @click="shipmethodIndex = 2">
	                <div class="name">高级配送</div>
	                <div class="price">180</div>
	              </li>
	            </ul>
	          </div>
	        </div>
	        <div class="next-btn-wrap">
	          <a href="javascript:;" class="btn btn--red">下一步</a>
	        </div>
	        <!-- 删除地址弹框 -->
	        <div class="md-modal modal-msg md-modal-transition" id="showModal" :class="{'md-show': deleteFlag}">
	          <div class="md-modal-inner">
	            <div class="md-top">
	              <button class="md-close" @click="cancleDel">关闭</button>
	            </div>
	            <div class="md-content">
	              <div class="confirm-tips">
	                <p id="cusLanInfo">你确认删除此配送地址信息吗?</p>
	              </div>
	              <div class="btn-wrap col-2">
	                <button class="btn btn--m" id="btnModalConfirm" @click="deleteAddress">Yes</button>
	                <button class="btn btn--m btn--red" id="btnModalCancel" @click="cancleDel">No</button>
	              </div>
	            </div>
	          </div>
	        </div>
	        <!-- 新增地址弹框 -->
	        <div class="md-modal modal-msg md-modal-transition" id="showModalw" :class="{'md-show':addAddressFlag}">
	          <div class="md-modal-inner">
	            <div class="md-top">
	              <button class="md-close" @click="cancleAdd">关闭</button>
	            </div>
	            <div class="md-content">
	              <div class="confirm-tips">
	                <div class="md-form-item">
	                  <label class="md-form-item__label" style="width: 80px;">姓名</label>
	                  <div class="md-form-item__content" style="margin-left: 80px;">
	                    <div  class="el-input">
	                      <input type="text" autocomplete="off" class="md-input__inner">
	                    </div>
	                  </div>
	                </div>
	                <div class="md-form-item">
	                  <label class="md-form-item__label" style="width: 80px;">地址</label>
	                  <div class="md-form-item__content" style="margin-left: 80px;">
	                    <div  class="el-input">
	                      <input type="text" autocomplete="off" class="md-input__inner">
	                    </div>
	                  </div>
	                </div>
	                <div class="md-form-item">
	                  <label class="md-form-item__label" style="width: 80px;">电话号码</label>
	                  <div class="md-form-item__content" style="margin-left: 80px;">
	                    <div  class="el-input">
	                      <input type="text" autocomplete="off" class="md-input__inner">
	                    </div>
	                  </div>
	                </div>
	              </div>
	              <div class="btn-wrap col-2">
	                <button class="btn btn--s" id="btnModalConfirms">保存</button>
	                <button class="btn btn--s btn--red" id="btnModalCancels" @click="cancleAdd">取消</button>
	              </div>
	            </div>
	          </div>
	        </div>
	        <div class="md-overlay" id="showOverLay" v-show="overlayShow"></div>
	 
	    </div>
	</div>
</template>

<script>
	
	export default {
		name: 'shipaddress',
		data () {
			return {
				addressList: [],
				limitNumber: 3,
				currentIndex: 0,
				currentAddress: '',
				deleteFlag: false,
				overlayShow: false,
				shipmethodIndex: 1,
				addAddressFlag: false
			}
		},
		computed: {
			// 实时计算显示的个数，以达到默认显示3个
			filterAddress () {
				return this.addressList.slice(0, this.limitNumber)
			}
		},
		created () {
			// 保证dom都展现完毕
			this.$nextTick(function () {
				this.getAddressList()
			})
		},
		mounted () {
			
		},
		methods: {
			getAddressList () {
				let self = this
				self.$http.get("/api/address").then((res) => {
					console.log('address数据是：',res)
					if (res.data.errno === 0) {
						self.addressList = res.data.data.result
					}
				})
			},
			loadMore () {
				let self = this
				if (self.limitNumber == 3) {
					self.limitNumber = self.addressList.length
				} else {
					self.limitNumber = 3
				}
			},
			setDefault (id) {
				let self = this
				self.addressList.forEach((item, index) => {
					if (item.addressId == id) {
						item.isDefault = true
					} else {
						item.isDefault = false
					}
				})
			},
			deleteConfirm (obj) {
				let self = this
				self.deleteFlag = true
				self.overlayShow = true
				self.currentAddress = obj
			},
			deleteAddress () {
				let self = this
				let deleteIndex = self.addressList.indexOf(self.currentAddress)
				self.addressList.splice(deleteIndex, 1)
				self.deleteFlag = false
				self.overlayShow = false
			},
			cancleDel () {
				let self = this
				self.deleteFlag = false
				self.overlayShow = false
			},
			addConfirm () {
				let self = this
				self.addAddressFlag=true
				self.overlayShow = true
			},
			cancleAdd () {
				let self = this
				self.addAddressFlag = false
				self.overlayShow = false
			}
		}
	}
</script>

<style>
	@import url("style/base.css");
	@import url("style/checkout.css");
	@import url("style/modal.css");
	@import url("style/reset.css");
</style>