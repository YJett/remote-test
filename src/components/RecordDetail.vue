<template>
  <card>
      <div>位置信息：{{this.dataObj.Location}}</div>
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
                return { Location: 'hello' }
            },
        },
    },
    computed: {
        imgUrl() {
            return 'https://localhost:5001/api/PracticePreservation/Pic/' + this.dataObj.PictureId
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
