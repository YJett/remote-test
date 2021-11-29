import request from '@/utils/request'

export function getPreservation(page) {
    return request({
        url: 'DutyPreservation/Current',
        method: 'GET',
        params: {
            limit: 10,
            page,
        },
    })
}
export function getDetail(id) {
    return request({
        url: 'DutyPreservation/detail/' + id,
        method: 'GET',
    })
}


export function adddPreservation(data) {
    return request({
        url: 'DutyPreservation/CreatePreservation',
        method: 'POST',
        data,
    })
}
export function openPreservation() {
    return request({
        url: 'DutyPreservation/Open',
        method: 'POST',
    })
}
export function closePreservation() {
    return request({
        url: 'DutyPreservation/close',
        method: 'POST',
    })
}
export function getStatus() {
    return request({
        url: 'DutyPreservation/IsOpen',
        method: 'GET',
    })
}
export function DutyPreservation(id) {
    return request({
        url: 'PracticePreservation/detail/' + id,
        method: 'GET',
    })
}
export function updateDPreservation(data) {
    return request({
        url: 'DutyPreservation/Update',
        method: 'POST',
        data,
    })
}
export function deleteDPreservation(id) {
    return request({
        url: 'DutyPreservation/Delete/' + id,
        method: 'POST',
    })
}
export function queryByTime(start, end) {
    return request({
        url: 'DutyPreservation/QueryByTime',
        method: 'POST',
        data: {
            starttime: start,
            endtime: end,
        },
    })
}
export function queryOnesDPreservation(id) {
    return request({
        url: 'DutyPreservation/' + id + '/Duty',
        method: 'GET',
    })
}
