import request from '@/utils/request'

export function getAssignmentBulletin() {
    return request({
        url: 'Notice/Duty/query',
        method: 'GET',
    })
}
export function getIndexBulletin() {
    return request({
        url: 'Notice/Practice/query',
        method: 'GET',
    })
}
export function getUserNotes() {
    return request({
        url: 'Notice/UserNotes',
        method: 'GET',
    })
}
export function changeUserNotes(data) {
    return request({
        url: 'Notice/UserNotes/Update',
        method: 'POST',
        data,
    })
}
export function addBulletin(data) {
    return request({
        url: 'Notice/Add',
        method: 'POST',
        data,
    })
}
export function delBulletin(id) {
    return request({
        url: 'Notice/' + id + '/delete',
        method: 'POST',
    })
}
export function updateBulletin(id, data) {
    return request({
        url: 'Notice/' + id + '/update',
        method: 'POST',
        data,
    })
}
