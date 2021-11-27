<template>
    <Form :model="dataObj" :label-width="80">
        <FormItem label="公告标题">
            <Input v-model="dataObj.title" type="text"  placeholder="Enter something..."/>
        </FormItem>
        <FormItem label="公告内容">
            <Input v-model="dataObj.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."/>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="submit">修改</Button>
            <Button style="margin-left: 8px" @click="cancel">取消</Button>
        </FormItem>
    </Form>
</template>
<script>
import { updateBulletin } from '../api/bulletin'

export default {
    name: 'BulletinForm',
    props: ['dataObj'],
    data() {
        return {
        }
    },
    methods: {
        submit() {
            updateBulletin(this.dataObj.id, this.dataObj).then(res => {
                this.$Message.success({
                    content: res.msg,
                })
                this.cancel()
                console.log(res)
            })
        },
        cancel() {
            this.$emit('close')
        },
    },
}
</script>
