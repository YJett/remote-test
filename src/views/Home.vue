<template>
    <div class="home-container">
        <div class="home-content">
            <label>请选择时间范围</label>
            <Date-picker type="datetimerange"
                         format="yyyy-MM-dd HH:mm"
                         placeholder="选择日期和时间（不含秒）"
                         style="width: 300px"
                         v-model="timerange">
            </Date-picker>
            <Button type="primary" @click="exportData1">导出统计表</Button>
        </div>
    </div>
</template>

<script>
import { exportReport } from '../api/dutyPreservation'

export default {
    name: 'home',
    data() {
        return {
            timerange: '',

        }
    },
    methods: {
        exportData1() {
            /*
            exportReport(this.timerange[0].toISOString().split('.')[0], this.timerange[1].toISOString().split('.')[0]).then(res => {
                const blob = new Blob([res])
                const reader = new FileReader()
                reader.readAsDataURL(blob)
                reader.onload = function (e) {
                    const a = document.createElement('a')
                    a.download = '文件名.xls'
                    a.href = e.target.result
                    document.documentElement.appendChild(a)
                    a.click()
                    a.remove()
                }
            })

             */
            // eslint-disable-next-line max-len
            let url = 'http://bt.yeep.gay:2468/api/DutyPreservation/export?starttime='
                + this.timerange[0].toISOString().split('.')[0]
                + '&endtime=' + this.timerange[1].toISOString().split('.')[0]
                + '&token=' + localStorage.getItem('token')
            // eslint-disable-next-line max-len
            // eslint-disable-next-line max-len
            window.location = url
        },

    },
}
</script>

<style scoped>
.home-container {
    padding: 10px;
    padding-top: 5px;
}
.home-content {
    padding: 10px;
    border-radius: 5px;
    background: #fff;
}
</style>
