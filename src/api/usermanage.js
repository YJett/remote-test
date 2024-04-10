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
