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
            <Tag
                color="primary"
                v-for="person in day.people"
                :key="person.id"
                closable
                @on-close="handleClose(person.id,day.timeId)"
            >
                {{person.name}}-{{person.class}}</Tag>
            <FormItem label="可预约人数">
                <Input  number v-model="day.all"/>
            </FormItem>
            <Button type="primary" @click="submit(day)">修改</Button>
            <Button type="primary" @click="handleDelete(day.timeId)">删除</Button>
        </card>
    </i-form>
</template>
<script>
import { getDetail, updatePPreservation, deletePPreservation, deletePRecord } from '../api/pPreservation'
import { updateDPreservation, deleteDPreservation, deleteDRecord } from '../api/dutyPreservation'

export default {
    name: 'PreservationForm',
    props: { dataObj: {
        type: Array,
    },
    curDate: {
        type: String,
    },
    isDuty: {
        type: Boolean,
        default: false,
    },
    },
    data() {
        return {
            formData: {

            },
        }
    },
    methods: {
        submit(dayData) {
            let data = {}
            data.StartTime = this.curDate + 'T' + dayData.start
            data.EndTime = this.curDate + 'T' + dayData.stop
            data.id = dayData.timeId
            data.All = dayData.all
            this.update(data)
            this.cancel()
        },
        update(data) {
            if (this.isDuty) {
                updateDPreservation(data).then(res => {
                    console.log(res)
                })
            } else {
                updatePPreservation(data).then(res => {
                    console.log(res)
                })
            }
        },
        delete(id) {
            if (this.isDuty) {
                deleteDPreservation(id).then(res => {
                    console.log(res)
                    this.refresh()
                })
            } else {
                deletePPreservation(id).then(res => {
                    console.log(res)
                    this.refresh()
                })
            }
        },
        deleteOnesRecord(gid, tid) {
            if (this.isDuty) {
                deleteDRecord(gid, tid).then(res => {
                    console.log(res)
                    this.refresh()
                })
            } else {
                deletePRecord(gid, tid).then(res => {
                    console.log(res)
                    this.refresh()
                })
            }
        },
        cancel() {
            this.$emit('close')
        },
        handleDelete(id) {
            this.delete(id)
        },
        refresh() {
            this.$emit('refresh')
        },
        handleClose(gid, tid) {
            this.deleteOnesRecord(gid, tid)
        },

    },
    mounted() {
    },
}
</script>
