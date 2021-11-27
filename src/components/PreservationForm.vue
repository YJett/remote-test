<template>
    <i-form :model="formData" :label-width="80">
        <card v-for="day in dataObj" :key="day.timeId">
            <FormItem label="开始时间">
                <Time-picker
                    format="HH:mm"
                    v-model="day.start"/>
            </FormItem>
            <FormItem label="截止时间">
                <Time-picker
                    format="HH:mm"
                    v-model="day.stop"/>
            </FormItem>
            <FormItem label="已预约人数">
                <div>{{day.current}}</div>
            </FormItem>
            <FormItem label="可预约人数">
                <Input  number v-model="day.all"/>
            </FormItem>
        </card>
        <FormItem>
            <Button type="primary" @click="submit">修改</Button>
            <Button style="margin-left: 8px" @click="cancel">取消</Button>
        </FormItem>
    </i-form>
</template>
<script>
import { getDetail, updatePreservation } from '../api/pPreservation'

export default {
    name: 'PreservationForm',
    props: { dataObj: {
        type: Array,
    },
    curDate: {
        type: String,
    } },
    data() {
        return {
            formData: {

            },
        }
    },
    methods: {
        submit() {
            let data = []
            this.dataObj.forEach(item => {
                data.push({
                    id: item.timeId,
                    all: item.all,
                    StartTime: this.curDate + 'T' + item.start,
                    EndTime: this.curDate + 'T' + item.stop,
                })
            })
            data.forEach(item => {
                updatePreservation(item)
            })
            this.cancel()
        },
        cancel() {
            this.$emit('close')
        },

    },
    mounted() {
    },
}
</script>
