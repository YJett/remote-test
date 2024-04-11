<template>
    <div>
        <div class="input-container">
            <!-- 查询按钮 -->
            <div class="search-container">
                <Input v-model="schName" placeholder="请输入学校名" style="width: 200px" />
                <Input v-model="email" placeholder="请输入邮箱" style="width: 200px"
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" />
                <Button type="primary" class="button" @click="fetchData">查询</Button>
            </div>
            <!-- 新增、删除、审核按钮 -->
            <div class="button-container">
                <Button type="primary" class="button" @click="openAddSchoolModal">添加学校</Button>
                <Button type="success" class="button" @click="exportData1">删除所选</Button>
                <Button type="warning" class="button" @click="queryUnSigned">审核所选</Button>
            </div>
        </div>
        <Table :data="tableData1" :columns="tableColumns1" stripe>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" style="margin-right: 5px" @click="show(row, index)">查看</Button>
                <Button type="error" size="small" @click="handleDelete(row)">删除</Button>
            </template>
        </Table>
        <Modal v-model="addSchoolModalVisible" title="添加学校">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="学校名" prop="schName">
                    <Input v-model="formValidate.schName" placeholder="请输入学校名" /><br />
                </FormItem>
                <FormItem label="地址" prop="address">
                    <Input v-model="formValidate.address" placeholder="请输入地址" /><br />
                </FormItem>
                <FormItem label="邮编" prop="zipcode">
                    <Input v-model="formValidate.zipcode" placeholder="请输入邮编" /><br />
                </FormItem>
                <FormItem label="联系人" prop="contact">
                    <Input v-model="formValidate.contact" placeholder="请输入联系人" /><br />
                </FormItem>
                <FormItem label="电话" prop="tel">
                    <Input v-model="formValidate.tel" placeholder="请输入电话" /><br />
                </FormItem>
                <FormItem label="邮编" prop="email">
                    <Input v-model="formValidate.email" placeholder="请输入邮箱" /><br />
                </FormItem>
                <FormItem label="审核状态" prop="status">
                    <Select v-model="formValidate.status" placeholder="请选择状态">
                        <Option value="0">未审核</Option>
                        <Option value="1">已审核</Option>
                        <Option value="9">已删除</Option>
                    </Select><br />
                </FormItem>
                <FormItem label="备注" prop="comment">
                    <Input v-model="formValidate.comment" placeholder="请输入备注" />
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
                    <Button @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
                </FormItem>
            </Form>
        </Modal>
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page :total=total :current=curPage @on-change="changePage" show-total></Page>
            </div>
        </div>
    </div>
</template>

<script>
import { querySignedDRecord, queryUnsignedDRecord } from "@/api/dutyPreservation";
import { querySignedPRecord, queryUnsignedPRecord } from "@/api/pPreservation";
import { querySch, froze, unForze, deleteSch, createSch } from '../api/schmanage';
import PreservationRecord from '../components/PreservationRecord';

export default {
    name: 'schmanage',
    // eslint-disable-next-line vue/no-unused-components
    components: { PreservationRecord },
    data() {
        return {
            formValidate: {
                schName: '',
                address: '',
                zipcode: '',
                contact: '',
                tel: '',
                email: '',
                status: '',
                comment: ''
            },
            ruleValidate: {
                schName: [
                    {
                        required: true,
                        message: 'The name cannot be empty',
                        trigger: 'blur'
                    }
                ],
                address: [
                    {
                        required: true,
                        message: 'address cannot be empty',
                        trigger: 'blur'
                    },
                ],
                zipcode: [
                    {
                        required: true,
                        message: 'zipcode select the city',
                        trigger: 'blur'
                    }
                ],
                contact: [
                    {
                        required: true,
                        message: 'contact select the city',
                        trigger: 'blur'
                    }
                ],
                tel: [
                    {
                        required: true,
                        message: 'tel select the city',
                        trigger: 'blur'
                    }
                ],
                email: [
                    {
                        required: true,
                        message: 'Mailbox cannot be empty',
                        trigger: 'blur'
                    },
                    {
                        type: 'email',
                        message: 'Incorrect email format',
                        trigger: 'blur'
                    }
                ],
                status: [
                    {
                        required: true,
                        message: 'Please select status',
                        trigger: 'change'
                    }
                ],
                comment: [
                    {
                        required: true,
                        message: 'comment select the city',
                        trigger: 'blur'
                    }
                ]
            },
            addSchoolModalVisible: false,
            showDetail: false,
            total: 11,
            curPage: 1,
            tableData1: [],
            tableColumns1: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: 'No',
                    key: 'schId',
                },
                {
                    title: '学校名',
                    key: 'schName',
                },
                {
                    title: '地址',
                    key: 'address',
                },
                {
                    title: '联系人',
                    key: 'contact',
                },
                {
                    title: '邮编',
                    key: 'zipcode'
                },
                {
                    title: '电话',
                    key: 'tel',
                },
                {
                    title: '邮箱',
                    key: 'email',
                },
                {
                    title: 'Action',
                    slot: 'action',
                    width: 150,
                    align: 'center'
                }
            ],
            curObj: {},
            isDuty: false,
            // 添加学校需要的字段
            schName: '',
            address: '',
            zipcode: '',
            contact: '',
            tel: '',
            email: '',
            qualification: '',
            status: '',
            remark: ''
        }
    },
    methods: {
        openAddSchoolModal() {
            this.addSchoolModalVisible = true;
        },
        handleSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                                // 调用添加学校的方法
                    createSch(this.formValidate).then(res => {
                        console.log(res);
                        this.$Message.success({
                            content: res.msg,
                        })
                        this.fetchData()
                    })
                    this.$Message.success('Success!');
                } else {
                    this.$Message.error('Fail!');
                }
            })


        },
        handleReset(name) {
            this.$refs[name].resetFields();
        },
        cancelAddSchool() {
            this.addSchoolModalVisible = false;
            this.clearInputs();
        },
        clearInputs() {
            this.schName = '';
            this.address = '';
            this.zipcode = '';
            this.contact = '';
            this.tel = '';
            this.email = '';
            this.status = '';
            this.remark = '';
        },
        show(row, index) {
            console.log(row)
            console.log(index)
        },
        handleDelete(obj) {
            console.log(obj)
            // 提示用户是否确认删除
            this.$Modal.confirm({
                title: '删除',
                content: '是否确认删除该企业？',
                onOk: () => {
                    deleteSch(obj.schId)
                        .then(res => {
                            this.$Message.success({
                                content: res.msg,
                            })
                            this.fetchData()
                        })
                },
                onCancel: () => {
                    console.log('cancel')
                },
            })
        },
        fetchData() {
            querySch(this.curPage, this.email, this.schName)
                .then(res => {
                    console.log(res);
                    console.log(res.data.list);
                    this.tableData1 = res.data.list
                    this.total = res.data.total
                })
        },
        changePage(page) {
            this.curPage = page
        },
    },

    mounted() {
        this.fetchData();
    },
    watch: {
        curPage() {
            this.fetchData();
        },
    },
}
</script>

<style>
.input-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}

.search-container {
    display: flex;
    align-items: center;
}
</style>
