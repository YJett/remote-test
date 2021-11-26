import request from '@/utils/request'


export function queryUser(page) {
    return request({
        url: '/Account/QueryAllUsers',
        method: 'GET',
        params: {
            limit: 10,
            page,
        },
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
