<template>
    <div>
        <Table :data="tableData1" :columns="tableColumns1" stripe>
            <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row }" slot="action">
                <Button type="primary" size="small" style="margin-right: 5px" @click="getDetail(row)">查看详情</Button>
            </template>
        </Table>
        <Modal
            v-model="detailShow"
            title="记录详情"
        >
            <record-detail @close="handleClose" :dataObj="positionDetail"></record-detail>
            <div slot="footer"/>
        </Modal>
    </div>

</template>
<script>
import store from '../store'
import { queryOnesPPreservation } from '../api/pPreservation'
import { queryOnesDPreservation } from '../api/dutyPreservation'
import RecordDetail from './RecordDetail'

export default {
    name: 'PreservationRecord',
    components: { RecordDetail },
    props: {
        id: {
            type: String,
        },
        isDuty: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            detailShow: false,
            tableColumns1: [
                {
                    title: '开始时间',
                    key: 'startTime',
                },
                {
                    title: '结束时间',
                    key: 'endTime',
                },
                {
                    title: '签到情况',
                    key: 'isAssigned',
                    render: (h, params) => {
                        const row = params.row
                        // eslint-disable-next-line no-nested-ternary
                        const color = row.isFreezed === true ? 'success' : 'error'
                        // eslint-disable-next-line no-nested-ternary
                        const text = row.isFreezed === true ? '已签到' : '未签到'

                        return h('Tag', {
                            props: {
                                type: 'dot',
                                color,
                            },
                        }, text)
                    },
                },
                {
                    title: '签到详情信息',
                    key: 'detail',
                },
                {
                    title: '奖励方式',
                    key: 'rewardWay',
                    render: (h, params) => {
                        const row = params.row
                        // eslint-disable-next-line no-nested-ternary
                        const color = 'success'
                        // eslint-disable-next-line no-nested-ternary
                        const text = store.state.rewardDict[row.rewardWay]
                        return h('Tag', {
                            props: {
                                type: 'dot',
                                color,
                            },
                        }, text)
                    },
                    width: 200,
                },
                {
                    title: 'Action',
                    slot: 'action',
                    width: 150,
                    align: 'center',
                },
            ],
            tableData1: [],
            formData: {
            },
            positionDetail: {

            },
        }
    },
    methods: {
        fetchData() {
            if (this.isDuty) {
                queryOnesDPreservation(this.id).then(res => {
                    this.tableData1 = res.data.dutyList
                })
            } else {
                queryOnesPPreservation(this.id).then(res => {
                    this.tableData1 = res.data.dutyList
                })
            }
        },
        handleClose() {
            this.detailShow = false
        },
        cancel() {
            this.$emit('close')
        },
        getDetail(data) {
            if (data.detail != null) {
                this.positionDetail = data.detail
            } else {
                this.positionDetail = {
                    location: '未知位置',
                    pictureId: '1',
                }
            }
            this.detailShow = true
        },
    },
    mounted() {
    },
    watch: {
        id() {
            this.fetchData()
        },
        isDuty() {
            this.fetchData()
        },
    },
}
</script>
