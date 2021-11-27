<template>
    <Markdown :content.sync="content"></Markdown>
</template>

<script>
import Markdown from 'vue-s-markdown/src/markdown/index'

export default {
    name: 'BulletinMarkDown',
    data() {
        return {
            content: '',
        }
    },
}
</script>

<style scoped>

</style>
