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
