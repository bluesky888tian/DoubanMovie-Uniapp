(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/meFace/meFace"],{1173:function(e,t,a){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a={data:function(){return{tempFace:""}},onLoad:function(e){var t=e.tempFilePath;this.tempFace=t},methods:{changePendingFace:function(){var t=this;e.chooseImage({count:1,sizeType:["compressed"],sourceType:["album"],success:function(e){var a=e.tempFilePaths[0];t.tempFace=a}})},upload:function(){var t=this.getGlobalUser("globalUser");e.showLoading({mask:!0,title:"上传中，请稍后"}),e.uploadFile({url:this.serverUrl+"/user/uploadFace?userId="+t.id,filePath:this.tempFace,name:"file",header:{headerUserId:t.id,headerUserToken:t.userUniqueToken},success:function(t){var a=t.data,n=JSON.parse(a);if(200==n.status){var c=n.data;e.setStorageSync("globalUser",c),e.navigateBack({delta:1})}else 502!=n.status&&500!=n.status||e.showToast({title:t.data.msg,image:"../../static/icos/error.png",duration:2e3})},complete:function(){e.hideLoading()}})}}};t.default=a}).call(this,a("543d")["default"])},"4ed8":function(e,t,a){"use strict";a.r(t);var n=a("eb8b"),c=a("c577");for(var u in c)["default"].indexOf(u)<0&&function(e){a.d(t,e,(function(){return c[e]}))}(u);a("916a");var i=a("f0c5"),r=Object(i["a"])(c["default"],n["b"],n["c"],!1,null,null,null,!1,n["a"],void 0);t["default"]=r.exports},8076:function(e,t,a){"use strict";(function(e,t){var n=a("4ea4");a("0c9a");n(a("66fd"));var c=n(a("4ed8"));e.__webpack_require_UNI_MP_PLUGIN__=a,t(c.default)}).call(this,a("bc2e")["default"],a("543d")["createPage"])},"916a":function(e,t,a){"use strict";var n=a("edec"),c=a.n(n);c.a},c577:function(e,t,a){"use strict";a.r(t);var n=a("1173"),c=a.n(n);for(var u in n)["default"].indexOf(u)<0&&function(e){a.d(t,e,(function(){return n[e]}))}(u);t["default"]=c.a},eb8b:function(e,t,a){"use strict";a.d(t,"b",(function(){return n})),a.d(t,"c",(function(){return c})),a.d(t,"a",(function(){}));var n=function(){var e=this.$createElement;this._self._c},c=[]},edec:function(e,t,a){}},[["8076","common/runtime","common/vendor"]]]);