(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/userInfo/userInfo"],{"0371":function(t,e,a){"use strict";var n=a("147e"),o=a.n(n);o.a},"147e":function(t,e,a){},"3a94":function(t,e,a){"use strict";a.r(e);var n=a("5a02"),o=a.n(n);for(var i in n)"default"!==i&&function(t){a.d(e,t,(function(){return n[t]}))}(i);e["default"]=o.a},"5a02":function(t,e,a){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a={data:function(){return{userimg:getApp().globalData.imgUrl+"tx.png",nick:"",sex:["男","女"],sexIndex:0,zy:"",date:"2016-09-01",phone:""}},methods:{upuserPhoto:function(){var e=this;t.showActionSheet({itemList:["从相册中选择","拍照"],itemColor:"#f7982a",success:function(t){t.cancel||(0==t.tapIndex?e.chooseWxImageShop("album"):1==t.tapIndex&&e.chooseWxImageShop("camera"))}})},chooseWxImageShop:function(e){var a=this;t.chooseImage({sizeType:["original","compressed"],sourceType:[e],success:function(t){a.userimg=t.tempFilePaths[0],a.upload_file(getApp().globalData.uploadUrl,t.tempFilePaths[0]);var e=t.tempFilePaths[0];a.userimg=e}})},upload_file:function(e,a){var n=this;t.uploadFile({url:e,filePath:a,name:"file",header:{"content-type":"multipart/form-data"},success:function(t){var e=JSON.parse(t.data);200==e.code&&(n.userimg=e.data.url)},fail:function(t){}})},bindPickerSex:function(t){this.sexIndex=t.detail.value},getnick:function(t){this.nick=t.detail.value},updateInfo:function(){this.$http.sendRequest("/wx/updateuser","POST",{avatar:this.userimg,userName:this.nick,sex:this.sexIndex}).then((function(e){200==e.data.code?t.showToast({title:"编辑成功",icon:"success",duration:2e3,success:function(){t.navigateBack({delta:1})}}):t.showToast({icon:"none",title:e.data.msg})})).catch((function(e){t.showToast({icon:"none",title:e.data.msg})}))},getUserInfo:function(){var e=this;this.$http.sendRequest("/wx/goUser","POST").then((function(t){console.log("res",t),200==t.data.code&&(0!=t.data.data.avatar.length&&(e.userimg=t.data.data.avatar),e.sexIndex=t.data.data.sex,e.nick=t.data.data.userName)})).catch((function(e){t.showToast({icon:"none",title:e.data.msg})}))}},onLoad:function(){this.getUserInfo()}};e.default=a}).call(this,a("543d")["default"])},"805e":function(t,e,a){"use strict";a.r(e);var n=a("f04f"),o=a("3a94");for(var i in o)"default"!==i&&function(t){a.d(e,t,(function(){return o[t]}))}(i);a("0371");var s,u=a("f0c5"),c=Object(u["a"])(o["default"],n["b"],n["c"],!1,null,null,null,!1,n["a"],s);e["default"]=c.exports},c15b:function(t,e,a){"use strict";(function(t){a("837d");n(a("66fd"));var e=n(a("805e"));function n(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,a("543d")["createPage"])},f04f:function(t,e,a){"use strict";var n;a.d(e,"b",(function(){return o})),a.d(e,"c",(function(){return i})),a.d(e,"a",(function(){return n}));var o=function(){var t=this,e=t.$createElement;t._self._c},i=[]}},[["c15b","common/runtime","common/vendor"]]]);