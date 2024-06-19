import request from '@/utils/request'


export function queryUser(page, email, userName) {
    return request({
        url: 'users/page',
        method: 'GET',
        params: {
            pageNum: page,
            pageSize: 10,
            email,
            userName
        },
    })
}

export function deleteUser(id) {
    return request({
        url: 'users/' + id,
        method: 'DELETE',
    })
}

export function createUser(userName,email,pwd,status,flg){
    return request({
        url: 'users/create',
        method: 'POST',
        data: {
            userName,
            email,
            pwd,
            status,
            flg
        }
    })
}

export function updateUser(userId,userName,email,pwd,status,flg,lastLogin, createTime, updateTime){
    return request({
        url: 'users/update',
        method: 'PUT',
        data: {
            user_id: userId,
            userName,
            email,
            pwd,
            status,
            flg,
            lastLogin,
            createTime,
            updateTime
        }
    })
}
export function froze(guid) {
    return request({
        url: 'Account/' + guid + '/FreezeAccount',
        method: 'POST',
    })
}

export function unForze(guid) {
    return request({
        url: 'Account/' + guid + '/UnFreezeAccount',
        method: 'POST',
    })
}
