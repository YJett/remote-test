<template>
    <div>委托交易单
        <Table :columns="columns1" :data="data1"  :row-class-name="rowClassName"></Table>
    </div>
</template>

<script>
import { myStock } from '@/api/order'

export default {
    name: 'OrderBook',
    data() {
        return {
            columns1: [
                {
                    title: 'Name',
                    key: 'name',
                },
                {
                    title: 'Age',
                    key: 'age',
                },
                {
                    title: 'Address',
                    key: 'address',
                },
            ],
            data1: [
                {
                    name: 'John Brown',
                    age: 18,
                    address: 'New York No. 1 Lake Park',
                    date: '2016-10-03',
                },
                {
                    name: 'Jim Green',
                    age: 24,
                    address: 'London No. 1 Lake Park',
                    date: '2016-10-01',
                },
                {
                    name: 'Joe Black',
                    age: 30,
                    address: 'Sydney No. 1 Lake Park',
                    date: '2016-10-02',
                },
                {
                    name: 'Jon Snow',
                    age: 26,
                    address: 'Ottawa No. 2 Lake Park',
                    date: '2016-10-04',
                },
            ],
        }
    },
    methods: {
        rowClassName(row, index) {
            if (row.age == 18) {
                return 'demo-table-error-row'
            }
        },
    },
    mounted() {
        myStock().then(res => console.log(res.results))
    },
}
</script>

<style>
    .demo-table-error-row{
        background-color: #ff6600;
        color:rgb(246, 70, 93);
    }

</style>
