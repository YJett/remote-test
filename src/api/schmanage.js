import request from '@/utils/request'


export function querySch(page, email, schName) {
    return request({
        url: 'sch/page',
        method: 'GET',
        params: {
            pageNum: page,
            pageSize: 10,
            email,
            schName
        },
    })
}

export function deleteSch(id) {
    return request({
        url: 'sch/' + id,
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
