<template>
    <Tabs v-model="curName">
        <TabPane label="练琴公告"  name="piano">
            <Table :data="tableData1" :columns="tableColumns1" stripe>
                <template slot-scope="{ row }" slot="name">
                    <strong>{{ row.name }}</strong>
                </template>
                <template slot-scope="{ row }" slot="action">
                    <Button type="primary" size="small" style="margin-right: 5px" @click="handleUpdate(row)">修改</Button>
                    <Button type="error" size="small" @click="handleDelete(row)">删除</Button>
                </template>
            </Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total=total :current=curPage @on-change="changePage" show-total></Page>
                </div>
            </div>
        </TabPane>
        <TabPane label="预约公告" name="reservation">
            <Table :data="tableData1" :columns="tableColumns1" stripe>
                <template slot-scope="{ row }" slot="name">
                    <strong>{{ row.name }}</strong>
                </template>
                <template slot-scope="{ row }" slot="action">
                    <Button type="primary" size="small" style="margin-right: 5px" @click="handleUpdate(row)">修改</Button>
                    <Button type="error" size="small" @click="handleDelete(row)">删除</Button>
                </template>
            </Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total=total :current=curPage @on-change="changePage" show-total></Page>
                </div>
            </div>
            <Modal
                v-model="showForm"
                title="公告详情"
                @on-ok="update"
            >
                <bulletin-form :data-obj="curBulletin"></bulletin-form>
                <div slot="footer"/>
            </Modal>
        </TabPane>
    </Tabs>
</template>
<script>
// eslint-disable-next-line import/no-unresolved
import { getAssignmentBulletin, getIndexBulletin } from '../api/bulletin'
import BulletinForm from '../components/BulletinForm'

export default {
    name: 'bulletin',
    components: { BulletinForm },
    data() {
        return {
            total: 11,
            curPage: 1,
            tableData1: [],
            showForm: false,
            tableColumns1: [
                {
                    title: '标题',
                    key: 'title',
                },
                {
                    title: '公告类型',
                    key: 'isduty',
                    render: (h, params) => {
                        const row = params.row
                        // eslint-disable-next-line no-nested-ternary
                        const color = 'primary'
                        // eslint-disable-next-line no-nested-ternary
                        const text = row.isDuty === false ? '值班公告' : '练琴公告'

                        return h('Tag', {
                            props: {
                                type: 'dot',
                                color,
                            },
                        }, text)
                    },
                },
                {
                    title: '内容',
                    key: 'content',
                    render: (h, params) => {
                        const row = params.row
                        const text = row.content.length > 15 ? row.content.substring(0, 15) : row.content
                        return h('div', text)
                    },
                },
                {
                    title: 'Action',
                    slot: 'action',
                    width: 150,
                    align: 'center',
                },
            ],
            curName: 'piano',
            curBulletin: {
                id: 3,
                title: '标题',
                content: '内如',
                isDuty: true,
            },
        }
    },
    methods: {
        changePage(page) {
            this.curPage = page
        },
        handleUpdate(obj) {
            this.showForm = true
            this.curBulletin = obj
            console.log(this.curName)
        },
        handleDelete(param) {
            this.curBulletin = param
            console.log(param)
        },
        fetchData() {
            if (this.curName === 'piano') {
                getAssignmentBulletin(this.curPage).then(res => {
                    console.log(res)
                    this.total = res.data.length
                    this.tableData1 = res.data
                })
            } else if (this.curName === 'reservation') {
                getIndexBulletin(this.curPage).then(res => {
                    console.log(res.data.length)
                    this.total = res.data.length
                    this.tableData1 = res.data
                })
            }
        },
        update() {

        },
    },
    mounted() {
        this.fetchData()
    },
    watch: {
        curPage() {
            this.fetchData()
        },
        curName() {
            this.fetchData()
        },
    },
}
</script>
