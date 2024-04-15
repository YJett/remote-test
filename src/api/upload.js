import request from '@/utils/request'


export function importSchData(data) {
    return request({
        url: 'home/',
        method: 'POST',
        data
    });
}

export function importComData(data) {
    return request({
        url: 'home/',
        method: 'POST',
        data
    });

}

