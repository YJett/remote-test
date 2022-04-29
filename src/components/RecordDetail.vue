<template>
  <card>
      <div>位置信息：{{dataObj.location}}</div>
      <img :src="imgUrl" />
  </card>
</template>

<script>
export default {
    name: 'RecordDetail',
    props: {
        dataObj: {
            type: Object,
            default() {
                return {
                    location: '未知位置',
                    pictureId: '1',
                }
            },
        },
    },
    computed: {
        imgUrl() {
            return 'https://bucuo-1391155-1308220348.ap-shanghai.run.tcloudbase.com/api/PracticePreservation/Pic/' + this.dataObj.pictureId
        },
    },
    methods: {
        close() {
            this.$emit('close')
        },
    },
}
</script>

<style scoped>

</style>
