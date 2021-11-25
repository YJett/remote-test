<template>
    <Form :model="formItem" :label-width="80">
        <FormItem label="公告类型">
            <RadioGroup v-model="formItem.isDuty">
                <Radio label="false">练琴公告</Radio>
                <Radio label="true">预约公告</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="公告内容">
            <Input v-model="formItem.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."/>
        </FormItem>
    </Form>
</template>
<script>
export default {
    name: 'bulletinform',
    props: {
        dataObj: {
            type: Object,
        } },
    data() {
        return {
            formItem: this.dataObj,
        }
    },
}
</script>
