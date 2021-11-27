<template>
    <div>
        <Form :model="dataObj" :label-width="80">
            <FormItem label="公告标题">
                <Input v-model="dataObj.title" type="text"  placeholder="Enter something..."/>
            </FormItem>
            <mavon-editor v-model="dataObj.content"></mavon-editor>
            <FormItem>
                <Button type="primary" @click="submit">{{ text }}</Button>
                <Button style="margin-left: 8px" @click="cancel">取消</Button>
            </FormItem>
        </Form>
    </div>

</template>
<script>
import { updateBulletin, addBulletin } from '../api/bulletin'

export default {
    name: 'BulletinForm',
    props: {
        dataObj: {
            type: Object,
            default() {
                return {
                    title: '标题',
                    content: '内容',
                }
            },
        },
        isAdd: {
            type: Boolean,
            default: true,
        },
        isDuty: {
            type: Boolean,
        },
    },
    data() {
        return {
        }
    },
    methods: {
        submit() {
            if (this.isAdd) {
                let isDuty = { isDuty: this.isDuty }
                let data = Object.assign(isDuty, this.dataObj)
                addBulletin(data).then((res) => {
                    console.log(res)
                    this.cancel()
                    this.refresh()
                })
            } else {
                updateBulletin(this.dataObj.id, this.dataObj).then(res => {
                    this.$Message.success({
                        content: res.msg,
                    })
                    this.cancel()
                    this.refresh()
                    console.log(res)
                })
            }
        },
        cancel() {
            this.$emit('close')
        },
        refresh() {
            this.$emit('refresh')
        },
    },
    computed: {
        text() {
            return this.isAdd == true ? '添加' : '修改'
        },
    },

}
</script>
