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
        url: 'Account/a4350455-7bb2-471d-8e1d-88b50b6ac535' + guid + '/FreezeAccount',
        method: 'POST',
    })
}

export function unForze(guid) {
    return request({
        url: 'Account/a4350455-7bb2-471d-8e1d-88b50b6ac535' + guid + '/FreezeAccount',
        method: 'POST',
    })
}
