import request from '@/utils/request'

export function fetchUserData() {
    return request.get('https://api.github.com/users/woai3c')
}
export function testGet() {
    return request.get('http://127.0.0.1:8000/api/mystock/')
}
export function testPost(url, data) {
    return request({
        url,
        method: 'POST',
        data,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    })
}
