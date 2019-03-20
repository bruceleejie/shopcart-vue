<template>
	<div class="cartContainer">
		<!--我是购物车页面-->
		<div class="cart">
            <div class="checkout-title">
              <span>购物车</span>
            </div>

            <!-- table -->
            <div class="item-list-wrap">
              <div class="cart-item">
                <div class="cart-item-head">
                  <ul>
                    <li>商品信息</li>
                    <li>商品金额</li>
                    <li>商品数量</li>
                    <li>总金额</li>
                    <li>编辑</li>
                  </ul>
                </div>
                <ul class="cart-item-list">
                  <li v-for="item in productList">
                    <div class="cart-tab-1">
                      <div class="cart-item-check">
                        <a href="javascript:void 0" class="item-check-btn" :class="{'check': item.checked}" @click="selectProduct(item)">
                          <svg class="icon icon-ok"><use xlink:href="#icon-ok"></use></svg>
                        </a>
                      </div>
                      <div class="cart-item-pic">
                        <!--<img src="img/goods-1.jpg" alt="烟">-->
                        <img :src="item.productImage" alt="烟">
                      </div>
                      <div class="cart-item-title">
                        <div class="item-name">{{ item.productName }}</div>
                      </div>
                      <div class="item-include">
                        <dl>
                          <dt>赠送:</dt>
                          <!--<dd>打火机</dd>-->
                          <dd v-for="part in item.parts" v-text="part.partsName">打火机</dd>
                        </dl>
                      </div>
                    </div>
                    <div class="cart-tab-2">
                      <div class="item-price">{{ item.productPrice | formatMoney }}</div>
                    </div>
                    <div class="cart-tab-3">
                      <div class="item-quantity">
                        <div class="select-self select-self-open">
                          <div class="quantity">
                            <a href="javascript:void 0" v-on:click="changeMoney(item, -1)">-</a>
                            <input type="text" value="0" disabled v-model="item.productQuantity">
                            <a href="javascript:void 0" @click="changeMoney(item, 1)">+</a>
                          </div>
                        </div>
                        <div class="item-stock">有货</div>
                      </div>
                    </div>
                    <div class="cart-tab-4">
                      <div class="item-price-total">{{ item.productPrice * item.productQuantity | formatMoney }}</div>
                    </div>
                    <div class="cart-tab-5">
                      <div class="cart-item-operation">
                        <a href="javascript:void 0" class="item-edit-btn" @click="deleteConfirm(item)">
                          <svg class="icon icon-del"><use xlink:href="#icon-del" ></use></svg>
                        </a>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <!-- footer -->
            <div class="cart-foot-wrap">
              <div class="cart-foot-l">
                <div class="item-all-check">
                  <a href="javascript:void 0" @click="checkAll(true)">
                    <span class="item-check-btn" :class="{'check':checkAllFlag}" >
                      <svg class="icon icon-ok"><use xlink:href="#icon-ok"></use></svg>
                    </span>
                    <span>全选</span>
                  </a>
                </div>
                <div class="item-all-del" style="margin-left: 10px;">
                  <a href="javascript:void 0" class="item-del-btn" @click="checkAll(false)">
                    <span>取消全选</span>
                  </a>
                </div>
              </div>
              <div class="cart-foot-r">
                <div class="item-total">
                  Item total: <span class="total-price">{{ totalMoney | formatMoney }}</span>
                </div>
                <div class="next-btn-wrap">
                  <!--<a :href="[totalMoney > 0 ? 'address.html' : 'javascript:void(0)']" 
                  	class="btn" :class="[totalMoney == 0 ? 'btn-disabled' : 'btn--red']" style="width: 200px">结账</a>-->
                  <a href="javascript:void(0)" @click="judgeJump" 
                  	class="btn" :class="[totalMoney == 0 ? 'btn-disabled' : 'btn--red']" style="width: 200px">结账</a>
                </div>
              </div>
            </div>
        </div>
        
        <!-- 删除弹框 -->
        <div class="md-modal modal-msg md-modal-transition" id="showModal" :class="{'md-show':deleteFlag}">
          <div class="md-modal-inner">
            <div class="md-top">
              <button class="md-close" @click="deleteFlag=false">关闭</button>
            </div>
            <div class="md-content">
              <div class="confirm-tips">
                <p id="cusLanInfo">你确认删除此订单信息吗?</p>
              </div>
              <div class="btn-wrap col-2">
                <button class="btn btn--m" id="btnModalConfirm" @click="deleteProduct">Yes</button>
                <button class="btn btn--m btn--red" id="btnModalCancel" @click="deleteFlag=false">No</button>
              </div>
            </div>
          </div>
        </div>
        <div class="md-overlay" v-show="deleteFlag"></div>
	</div>
</template>

<script>
	export default {
		name: 'cart',
		data () {
			return {
				title: 'helloworld',
				totalMoney: 0,
				productList: [],
				checkAllFlag: false,
				deleteFlag: false,
				currentProduct: '',
				jumpUrl: ''
			}
		},
		computed: {
			
		},
		filters: {
			formatMoney (value) {
				return '￥'+ value.toFixed(2)+'元'
			}
		},
		created () {
			this.$nextTick(function () {
				this.cartView();
			})
		},
		mounted () {
//			this.$nextTick(function () {
//				this.cartView();
//			})
		},
		methods: {
			cartView () {
				var self = this
				// 这里url后面的参数可选。
				self.$http.get("/api/shopcart", {"id": 123}).then((res) => {
					console.log('请求返回的是：', res)
					if (res.data.errno === 0) {
						self.productList = res.data.data.result.list
						// 后台的totalMoney返回给前台，并不做使用，只是为了基础的html展示。
	//					self.totalMoney = res.data.result.totalMoney
						console.log('商品列表是：', self.productList)
					}
				});
			},
			changeMoney (product, way) {
				// 修改商品数量改变单个总价
				if (way > 0) {
					product.productQuantity++
				} else {
					product.productQuantity--
					if (product.productQuantity < 1) {
						product.productQuantity = 1
					}
				}
				this.calculateTotalMoney()
			},
			selectProduct (item) {
				if (typeof item.checked == 'undefined') {
					// Vue.set(item, 'checked', true) // 全局注册
					this.$set(item, 'checked', true)
				} else {
					item.checked = !item.checked
				}
				this.calculateTotalMoney()
			},
			checkAll (flag) {
				let self = this
				self.checkAllFlag = flag
				self.productList.forEach(function (item, index) {
					if (typeof item.checked == 'undefined') {
						self.$set(item, 'checked', self.checkAllFlag)
					} else {
						item.checked = self.checkAllFlag
					}
				})
				this.calculateTotalMoney()
			},
			calculateTotalMoney () {
				let self = this
				self.totalMoney = 0
				self.productList.forEach( (item, index) => {
					if (item.checked) {
						self.totalMoney += item.productPrice * item.productQuantity
					}
				})
			},
			deleteConfirm (obj) {
				let self = this
				self.deleteFlag = true
				self.currentProduct = obj
			},
			deleteProduct () {
				// vue1.0版本，目前已经不支持这种写法。
				// this.deleteProduct.$delete(this.currentProduct)
				let productIndex = this.productList.indexOf(this.currentProduct)
				this.productList.splice(productIndex, 1)
				this.deleteFlag = false
			},
			// 判断是否跳转到地址页面
			judgeJump () {
				let self = this
				if (self.totalMoney > 0) {
					self.$router.push({path: '/shipaddress'})
				} else {
					return
				}
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