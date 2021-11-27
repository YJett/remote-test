<template>
    <i-form :model="formData" :label-width="80">
        <FormItem label="请选择开始的日期">
            <Date-picker type="date" placeholder="请选择开始日期" style="width: 200px" :model="dataObj.startTime"></Date-picker>
            <Button type="primary" @click="addLocal">添加时间段</Button>
        </FormItem>
        <card v-for=" (day,index) in dataObj.PresevationTimes" :key="index">
            <FormItem label="开始时间">
                <Time-picker
                    format="HH:mm"
                    v-model="day.StartTime"/>
            </FormItem>
            <FormItem label="截止时间">
                <Time-picker
                    format="HH:mm"
                    v-model="day.EndTime"/>
            </FormItem>
            <FormItem label="可预约人数">
                <Input-number v-model="day.all"></Input-number>
            </FormItem>
        </card>
        <FormItem label="添加的天数">
            <Input-number v-model="dataObj.DurationTime"></Input-number>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="submit">添加</Button>
            <Button style="margin-left: 8px" @click="cancel">取消</Button>
        </FormItem>
    </i-form>
</template>
<script>
import { addPreservation } from '../api/pPreservation'

export default {
    name: 'AddPreservationForm',
    data() {
        return {
            formData: {
            },
            dataObj: {
                StartDate: new Date().toISOString().split('.')[0],
                PresevationTimes: [
                    {
                        StartTime: '11:19',
                        EndTime: '11:30',
                        all: 5,
                    },
                    {
                        StartTime: '12:30',
                        EndTime: '13:00',
                        all: 5,
                    }],
                DurationTime: 10,
            },
        }
    },
    methods: {
        submit() {
            addPreservation(this.dataObj).then(res => {
                this.formData.$emit('close')
            })
        },
        cancel() {
            this.$emit('close')
        },
        addLocal() {
            this.dataObj.PresevationTimes.push({
                StartTime: '12:30',
                EndTime: '13:00',
            })
        },
    },
    mounted() {
    },
}
</script>
