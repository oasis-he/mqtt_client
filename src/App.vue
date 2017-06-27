<template>
  <div id="app">
 <div></div>
    <hello></hello>
  </div>
</template>

<script>
import Hello from './components/mqtt_client.vue'

export default {

  name: 'app',
  components: {
  Hello
  },

  created(){
//    (function (doc, win) {
//  // 获取文档的根节点
//  var docEl = doc.documentElement;
//  // 判断移动端是否发生方向改变
//  var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
//  var recalc = function () {
//    // 获取对象的宽度
//    var clientWidth = docEl.clientWidth;
//    if (!clientWidth) return;
//    if(clientWidth >= 640) {
//      docEl.style.fontSize = '100px';
//    } else {
//      docEl.style.fontSize = 100 * (clientWidth / 640) + 'px';
//    }
//  };
//  if (!doc.addEventListener) return;
//  win.addEventListener(resizeEvt, recalc, false);
//  doc.addEventListener('DOMContentLoaded', recalc, false);
//})(document, window);
  }
}
</script>

<style>

</style>
