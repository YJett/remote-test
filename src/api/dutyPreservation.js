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
export function addPreservation(data) {
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
