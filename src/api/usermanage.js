import request from '@/utils/request'


export function queryUser() {
    return request({
        url: '/Account/QueryAllUsers',
        method: 'GET',
        params: {
            limit: 5,
            page: 1,
        },
    })
}
