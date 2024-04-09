import request from '@/utils/request'

export function searchUsers(data) {
    return request({
        url: '/api/users',
        method: 'GET',
        params: {
            user_name: data.user_name,
            email: data.email,
        },
    })
}
