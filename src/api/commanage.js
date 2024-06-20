import request from '@/utils/request'


export function queryCom(page, email, comName) {
    return request({
        url: 'com/page',
        method: 'GET',
        params: {
            pageNum: page,
            pageSize: 10,
            email,
            comName
        },
    })
}

export function deleteCom(id) {
    return request({
        url: 'com/' + id,
        method: 'DELETE',
    })
}

export function createCom(data) {
    return request({
        url: 'com/create',
        method: 'POST',
        data,
    });
}

export function deleteBatchCom(ids) {
    return request({
        url: 'com/batchdelete',
        method: 'PUT', // 使用 POST/PUT 方法来发送数据
        data: ids
    });
}


export function successBatchCom(ids) {
    return request({
        url: 'com/batchsuccess',
        method: 'PUT', // 使用 POST/PUT 方法来发送数据
        data: ids
    });
}

export function updateCom(comId,comName,address,zipcode,contact,tel,email,filepath,comment,status,updateTime){
    return request({
        url: 'com/update',
        method: 'PUT',
        data: {
            comId,comName,address,zipcode,contact,tel,email,filepath,comment,status,updateTime
        }
    })
}
