<!-- 推荐 -->
<template>
    <view-box ref="viewBox">
        <wbc-temCaseLise></wbc-temCaseLise>
        <wbc-footer></wbc-footer>
    </view-box>
</template>

<script>
import footer from '../publicTem/footer.vue'
import temCaseList from '../publicTem/temCaseList.vue'
import { ViewBox } from 'vux'
    export default {
        name:'Recommend',
        data() { //选项 / 数据
            return {

            }
        },
        methods: { //事件处理器

        },
        components: { //定义组件
            'wbc-footer':footer,
            'wbc-temCaseLise':temCaseList,
            ViewBox,
        },
        created() { //生命周期函数

        }
    }
</script>

<style>

</style>
