new Vue({
	el: '.container',
	data: {
		addressList: [],
		limitNumber: 3,
		currentIndex: 0,
		currentAddress: '',
		deleteFlag: false,
		overlayShow: false,
		shipmethodIndex: 1,
		addAddressFlag: false
	},
	mounted: function () {
		// 保证dom都展现完毕
		this.$nextTick(function () {
			this.getAddressList()
		})
	},
	computed: {
		// 实时计算显示的个数，以达到默认显示3个
		filterAddress () {
			return this.addressList.slice(0, this.limitNumber)
		}
	},
	methods: {
		getAddressList () {
			let self = this
			self.$http.get("data/address.json").then((res) => {
				console.log('address数据是：',res)
				if (res.data.status == 0) {
					self.addressList = res.data.result
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
})