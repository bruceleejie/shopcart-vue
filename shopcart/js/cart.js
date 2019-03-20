var vm = new Vue({
	el: "#app",
	data: {
		title: 'helloworld',
		totalMoney: 0,
		productList: [],
		checkAllFlag: false,
		deleteFlag: false,
		currentProduct: '',
		jumpUrl: ''
	},
	filters: {
		formatMoney (value) {
			return '￥'+ value.toFixed(2)+'元'
		}
	},
	mounted: function () {
		this.$nextTick(function () {
			this.cartView();
		})
//		this.cartView();
	},
	computed: {
		junmUrl () {
			if (totalMoney > 0) {
				return 'address.html'
			} else {
				return 'javascript:void(0)'
			}
		}
	},
	methods: { 
		cartView () {
			var self = this
			// 这里url后面的参数可选。
			this.$http.get("data/cartData.json", {"id": 123}).then((res) => {
				console.log('请求返回的是：', res)
				if (res.data.status == 1) {
					self.productList = res.data.result.list
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
		}
		
	}
})