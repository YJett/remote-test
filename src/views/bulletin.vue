<template>
    <Tabs v-model="curName">
        <TabPane label="值班公告"  name="duty">
            <div>
                <Button type="primary" icon="ios-search" @click="fetchData">刷新</Button>
                <Button type="primary" class="left" @click="handleAdd">添加</Button>
            </div>
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
        <TabPane label="练琴公告" name="piano">
            <div>
                <Button type="primary" icon="ios-search" @click="fetchData">刷新</Button>
                <Button type="primary" class="left" @click="handleAdd">添加</Button>
            </div>
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
                width="900px"
            >
                <bulletin-form
                    :data-obj="curBulletin"
                    :is-duty="isDuty"
                    :is-add="isAdd"
                    @close="showForm=false"
                    @refresh="fetchData">
                </bulletin-form>
                <div slot="footer"/>
            </Modal>
        </TabPane>
    </Tabs>
</template>
<script>
// eslint-disable-next-line import/no-unresolved
export default {
    name: 'Home',
    data() {
        return {
            timerange: [],
            tableData: [],
            tableColumns: [
                {
                    title: '姓名',
                    slot: 'name',
                },
                {
                    title: '邮箱',
                    slot: 'email',
                },
                {
                    title: '角色',
                    slot: 'role',
                },
                {
                    title: '操作',
                    slot: 'action',
                },
            ],
            curPage: 1,
            pageSize: 10,
            total: 0,
        }
    },
    methods: {
        fetchData() {
            // 调用 API 获取数据
            this.tableData = [
                {
                    name: '张三',
                    email: 'zhangsan@example.com',
                    role: '管理员',
                },
                {
                    name: '李四',
                    email: 'lisi@example.com',
                    role: '普通用户',
                },
                {
                    name: '王五',
                    email: 'wangwu@example.com',
                    role: '编辑',
                },
            ]
            this.total = this.tableData.length
        },
        editUser(row) {
            // 编辑用户
            console.log('编辑用户', row)
        },
        deleteUser(row) {
            // 删除用户
            console.log('删除用户', row)
        },
        changePage(page) {
            // 切换页码
            this.curPage = page
        },
    },
}
</script>
<style>
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
