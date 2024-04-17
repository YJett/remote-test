<template>
    <div>
        <div class="input-container">
            <!-- 查询按钮 -->
            <div class="search-container">
                <Input v-model="comName" placeholder="请输入企业名" style="width: 200px"/>
                <Input v-model="email" placeholder="请输入邮箱" style="width: 200px" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"/>
                <Button type="primary" class="button" @click="fetchData">查询</Button>
            </div>
            <!-- 新增、删除、审核按钮 -->
            <div class="button-container">
                <Button type="primary" class="button" @click="openAddCompanyModal">添加公司</Button>
                <Button type="success" class="button" @click="handleBatchDelete">删除所选</Button>
                <Button type="warning" class="button" @click="handleSuccess">审核所选</Button>
            </div>
        </div>
        <Table :data="tableData1" :columns="tableColumns1" stripe @on-selection-change="handleSelectionChange">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" style="margin-right: 5px" @click="showDetailModal(row)">查看</Button>
                <Button type="error" size="small" @click="handleDelete(row)">删除</Button>
            </template>
        </Table>
        <Modal v-model="addComModalVisible" title="添加企业">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width=80>
                <FormItem label="企业名" prop="comName">
                    <Input v-model="formValidate.comName" placeholder="请输入企业名"/><br/>
                </FormItem>
                <FormItem label="地址" prop="address">
                    <Input v-model="formValidate.address" placeholder="请输入地址"/><br/>
                </FormItem>
                <FormItem label="邮编" prop="zipcode">
                    <Input v-model="formValidate.zipcode" placeholder="请输入邮编"/><br/>
                </FormItem>
                <FormItem label="联系人" prop="contact">
                    <Input v-model="formValidate.contact" placeholder="请输入联系人"/><br/>
                </FormItem>
                <FormItem label="电话" prop="tel">
                    <Input v-model="formValidate.tel" placeholder="请输入电话"/><br/>
                </FormItem>
                <FormItem label="邮编" prop="email">
                    <Input v-model="formValidate.email" placeholder="请输入邮箱"/><br/>
                </FormItem>
               <FormItem label="企业资质文件" prop="filepath">
                    <Upload multiple action="/api/com/upload"
                    :on-success="handleSuccess"
                    >
                        <Button icon="ios-cloud-upload-outline">Upload files</Button>
                    </Upload>
               </FormItem>
                <FormItem label="审核状态" prop="status">
                    <Select v-model="formValidate.status" placeholder="请选择状态">
                        <Option value="0">未审核</Option>
                        <Option value="1">已审核</Option>
                        <Option value="9">已删除</Option>
                    </Select><br/>
                </FormItem>
                <FormItem label="备注" prop="comment">
                    <Input v-model="formValidate.comment" placeholder="请输入备注"/>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
                    <Button @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="detailModalVisible" title="企业详情">
            <!-- 显示企业详情的表单 -->
            <Form :model="currentDetailData" label-width="80" ref="detailForm">
                <FormItem label="企业名">
                    <Input v-model="currentDetailData.comName" disabled/>
                </FormItem>
                <FormItem label="地址">
                    <Input v-model="currentDetailData.address" disabled/>
                </FormItem>
                <FormItem label="邮编">
                    <Input v-model="currentDetailData.zipcode" disabled/>
                </FormItem>
                <FormItem label="联系人">
                    <Input v-model="currentDetailData.contact" disabled/>
                </FormItem>
                <FormItem label="电话">
                    <Input v-model="currentDetailData.tel" disabled/>
                </FormItem>
                <FormItem label="邮箱">
                    <Input v-model="currentDetailData.email" disabled/>
                </FormItem>
                <FormItem label="审核状态">
                    <Input v-model="currentDetailData.status" disabled/>
                </FormItem>
                <FormItem label="备注">
                    <Input v-model="currentDetailData.comment" disabled/>
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


import {queryCom, deleteCom} from '../api/commanage';
import PreservationRecord from '../components/PreservationRecord';
import {createCom} from "@/api/commanage";
import {deleteBatchCom,successBatchCom} from "@/api/commanage";

export default {
    name: 'commanage',
    // eslint-disable-next-line vue/no-unused-components
    components: { PreservationRecord },
    data() {
        return {
            formValidate: {
                comName: '',
                address: '',
                zipcode: '',
                contact: '',
                tel: '',
                email: '',
                status: '',
                comment: '',
                filepath: '',
            },
            ruleValidate: {
                comName: [
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
                        message: 'zipcode cannot be empty',
                        trigger: 'blur'
                    }
                ],
                contact: [
                    {
                        required: true,
                        message: 'contact cannot be empty',
                        trigger: 'blur'
                    }
                ],
                tel: [
                    {
                        required: true,
                        message: 'tel cannot be empty',
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
                        message: 'comment cannot be empty',
                        trigger: 'blur'
                    }
                ]
            },
            detailModalVisible: false, // 控制详情弹窗的显示
            currentDetailData: {}, // 当前查看的企业数据
            addComModalVisible: false,
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
                    key: 'comId',
                },
                {
                    title: '企业名',
                    key: 'comName',
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
                    key: 'zipcode',
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
            // 添加公司需要的字段
            comName: '',
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
        handleSuccess (res, file) {
                file.url = 'https://file.iviewui.com/images/image-demo-3.jpg';
                file.name = res.data;
                console.log(res)
                console.log(file)
                this.formValidate.filepath = res.data;
            },
        openAddCompanyModal() {
            this.addComModalVisible = true;
        },
        handleSelectionChange(selection) {
            console.log(selection);
            this.selectedIds = selection.map(item => item.comId);
        },
        handleBatchDelete() {
            // 提示用户是否确认删除
            this.$Modal.confirm({
                title: '删除',
                content: '是否确认删除该公司？',
                onOk: () => {
                    deleteBatchCom(this.selectedIds)
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
        handleSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    // 调用添加公司的方法
                    createCom(this.formValidate).then(res => {
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
                    deleteCom(obj.comId)
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
        showDetailModal(row) {
            this.currentDetailData = { ...row }; // 将当前行数据赋值给详情数据
            this.detailModalVisible = true; // 显示详情弹窗
        },
        fetchData() {
            queryCom(this.curPage, this.email, this.comName)
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
