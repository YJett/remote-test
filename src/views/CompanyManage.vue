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
                <Button type="primary" class="button" @click="openAddCompanyModal">添加企业</Button>
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
        <Modal v-model="addComModalVisible" title="添加企业" :footer-hide="true">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :labelWidth="parseInt('80')">
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
                <FormItem label="邮箱" prop="email">
                    <Input v-model="formValidate.email" placeholder="请输入邮箱"/><br/>
                </FormItem>
                <FormItem label="企业资质文件" prop="filepath">
                    <Upload multiple action="/api/com/upload" :on-success="handleSuccess">
                        <Button icon="ios-cloud-upload-outline">上传文件</Button>
                    </Upload>
                </FormItem>
                <FormItem label="审核状态" prop="status">
                    <Select v-model="formValidate.status" placeholder="请选择状态">
                        <Option value="0">未审核</Option>
                        <Option value="1">已审核</Option>
                        <Option value="9">已删除</Option>
                    </Select><br/>
                </FormItem>
                <FormItem label="备注">
                    <Input v-model="formValidate.comment" :required="false"/>
                </FormItem>
                <FormItem>
                    <div style="text-align: center;">
                        <Button type="primary" @click="handleSubmit('formValidate')">确定</Button>
                        <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
                        <Button @click="handleCancel" style="margin-left: 8px">取消</Button>
                    </div>
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="detailModalVisible" title="企业详情">
            <!-- 显示企业详情的表单 -->
            <Form :model="currentDetailData" :labelWidth="parseInt('80')" ref="detailForm">
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
                    <Input v-model="currentDetailData.comment" :required="false"/>
                </FormItem>
            </Form>
            <div slot="footer"></div>
        </Modal>
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page :total="total" :current="curPage" @on-change="changePage" show-total></Page>
            </div>
        </div>
    </div>
</template>

<script>
import {queryCom, deleteCom} from '../api/commanage';
import PreservationRecord from '../components/PreservationRecord';
import {createCom} from "@/api/commanage";
import {deleteBatchCom, successBatchCom} from "@/api/commanage";
import {successBatchSch} from "@/api/schmanage";

export default {
    name: 'commanage',
    components: {PreservationRecord},
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
                    {required: true, message: '企业名不能为空', trigger: 'blur'}
                ],
                address: [
                    {required: true, message: '地址不能为空', trigger: 'blur'}
                ],
                zipcode: [
                    {required: true, message: '邮编不能为空', trigger: 'blur'}
                ],
                contact: [
                    {required: true, message: '联系人不能为空', trigger: 'blur'}
                ],
                tel: [
                    {required: true, message: '电话不能为空', trigger: 'blur'}
                ],
                email: [
                    {required: true, message: '邮箱不能为空', trigger: 'blur'},
                    {type: 'email', message: '邮箱格式不正确', trigger: 'blur'}
                ],
                status: [
                    {required: true, message: '请选择审核状态', trigger: 'change'}
                ],
                comment: [
                    {required: true, message: '备注不能为空', trigger: 'blur'}
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
                {type: 'selection', width: 60, align: 'center'},
                {title: 'No', key: 'comId'},
                {title: '企业名', key: 'comName'},
                {title: '地址', key: 'address'},
                {title: '联系人', key: 'contact'},
                {title: '邮编', key: 'zipcode'},
                {title: '电话', key: 'tel'},
                {title: '邮箱', key: 'email'},
                {title: '操作', slot: 'action', width: 150, align: 'center'}
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
        };
    },
    methods: {
        handleSuccess(res, file) {
            this.$Modal.confirm({
                title: '删除',
                content: '是否确认提交',
                onOk: () => {
                    successBatchCom(this.selectedIds)
                        .then(res => {
                            this.$Message.success({
                                content: res.msg,
                            });
                            this.fetchData();
                        });
                },
                onCancel: () => {
                    console.log('cancel');
                },
            });
        },
        openAddCompanyModal() {
            this.addComModalVisible = true;
        },
        handleSelectionChange(selection) {
            this.selectedIds = selection.map(item => item.comId);
        },
        handleBatchDelete() {
            this.$Modal.confirm({
                title: '删除',
                content: '是否确认删除该公司？',
                onOk: () => {
                    deleteBatchCom(this.selectedIds)
                        .then(res => {
                            this.$Message.success({
                                content: res.msg,
                            });
                            this.fetchData();
                        });
                },
                onCancel: () => {
                    console.log('cancel');
                },
            });
        },
        handleSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    createCom(this.formValidate).then(res => {
                        this.$Message.success({
                            content: res.msg,
                        });
                        this.fetchData();
                        this.addComModalVisible = false; // 关闭弹窗
                    });
                } else {
                    this.$Message.error('提交失败，请检查表单输入');
                }
            });
        },
        handleReset(name) {
            this.$refs[name].resetFields();
        },
        handleCancel() {
            this.addComModalVisible = false; // 关闭弹窗
        },
        show(row, index) {
            console.log(row);
            console.log(index);
        },
        handleDelete(obj) {
            this.$Modal.confirm({
                title: '删除',
                content: '是否确认删除该企业？',
                onOk: () => {
                    deleteCom(obj.comId)
                        .then(res => {
                            this.$Message.success({
                                content: res.msg,
                            });
                            this.fetchData();
                        });
                },
                onCancel: () => {
                    console.log('cancel');
                },
            });
        },
        showDetailModal(row) {
            this.currentDetailData = {...row}; // 将当前行数据赋值给详情数据
            this.detailModalVisible = true; // 显示详情弹窗
        },
        fetchData() {
            queryCom(this.curPage, this.email, this.comName)
                .then(res => {
                    this.tableData1 = res.data.list.filter(item => item.status !== '9');
                    this.total = this.tableData1.length; // 更新总数
                });
        },
        changePage(page) {
            this.curPage = page;
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
};
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
