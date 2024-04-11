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
                <Button type="success" class="button">删除所选</Button>
                <Button type="warning" class="button" @click="queryUnSigned">审核所选</Button>
            </div>
        </div>
        <Table :data="tableData1" :columns="tableColumns1" stripe>
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" style="margin-right: 5px" @click="show(row,index)">查看</Button>
                <Button type="error" size="small" @click="handleDelete(row)">删除</Button>
            </template>
        </Table>
        <Modal v-model="addComModalVisible" title="添加企业">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="企业名" prop="comName">
                    <Input v-model="formValidate.comName" placeholder="请输入学校名"/><br/>
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
                    <Upload multiple action="//jsonplaceholder.typicode.com/posts/">
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
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page :total=total :current=curPage @on-change="changePage" show-total></Page>
            </div>
        </div>
    </div>
</template>
<script>

// eslint-disable-next-line import/no-unresolved
import {querySignedDRecord, queryUnsignedDRecord} from "@/api/dutyPreservation";
import {querySignedPRecord, queryUnsignedPRecord} from "@/api/pPreservation";
import {queryCom, froze, unForze, deleteCom} from '../api/commanage';
import PreservationRecord from '../components/PreservationRecord';

export default {
    name: 'commanage',
    // eslint-disable-next-line vue/no-unused-components
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
                comment: ''
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
        openAddCompanyModal() {
            this.addComModalVisible = true;
        },
        handleSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$Message.success('Success!');
                } else {
                    this.$Message.error('Fail!');
                }
            })
        },
        handleReset(name) {
            this.$refs[name].resetFields();
        }
    },
    cancelAddCom() {
        this.addComModalVisible = false;
        this.clearInputs();
    },
    clearInputs() {
        this.comName = '';
        this.address = '';
        this.zipcode = '';
        this.contact = '';
        this.tel = '';
        this.email = '';
        this.qualification = '';
        this.status = '';
        this.remark = '';
    },
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
        const baseUrl = 'https://xiaochengxu-1391155-1308220348.ap-shanghai.run.tcloudbase.com/api/'
        let url = baseUrl + 'DutyPreservation/export?starttime='
            + this.timerange[0].toISOString()
                .split('.')[0]
            + '&endtime=' + this.timerange[1].toISOString()
                .split('.')[0]
            + '&token=' + localStorage.getItem('token')
        // eslint-disable-next-line max-len
        // eslint-disable-next-line max-len
        window.location = url
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
    froze(obj) {
        froze(obj.guid)
            .then(res => {
                this.$Message.success({
                    content: res.msg,
                })
                this.fetchData()
            })
    },
    unfroze(param) {
        unForze(param.guid)
            .then(res => {
                this.$Message.success({
                    content: res.msg,
                })
                this.fetchData()
            })
    },
    showRecord(row, isDuty) {
        if (isDuty) {
            this.isDuty = true
        } else {
            this.isDuty = false
        }
        this.curObj = row
        this.showDetail = true
    },
    querySigned() {
        if (!this.status) {
            querySignedDRecord(this.timerange[0], this.timerange[1], this.curPage)
                .then(res => {
                    this.tableData = res.data.content
                    this.total = res.data.allCount
                    console.log(res)
                })
        } else {
            querySignedPRecord(this.timerange[0], this.timerange[1], this.curPage)
                .then(res => {
                    this.tableData = res.data.content
                    this.total = res.data.allCount
                    console.log(res)
                })
        }
        this.isSigned = true
    },
    queryUnSigned() {
        if (!this.status) {
            queryUnsignedDRecord(this.timerange[0], this.timerange[1], this.curPage)
                .then(res => {
                    this.tableData = res.data.content
                    this.total = res.data.allCount
                    console.log(res)
                })
        } else {
            queryUnsignedPRecord(this.timerange[0], this.timerange[1], this.curPage)
                .then(res => {
                    this.tableData = res.data.content
                    this.total = res.data.allCount
                    console.log(res)
                })
        }
        this.isSigned = false
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
