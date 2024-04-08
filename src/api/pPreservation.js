import request from '@/utils/request'

export function getPreservation(page) {
    return request({
        url: 'PracticePreservation/Current',
        method: 'GET',
        params: {
            limit: 10,
            page,
        },
    })
}
export function addpPreservation(data) {
    return request({
        url: 'PracticePreservation/CreatePreservation',
        method: 'POST',
        data,
    })
}
export function openPreservation() {
    return request({
        url: 'PracticePreservation/Open',
        method: 'POST',
    })
}
export function closePreservation() {
    return request({
        url: 'PracticePreservation/close',
        method: 'POST',
    })
}
export function getStatus() {
    return request({
        url: 'PracticePreservation/IsOpen',
        method: 'GET',
    })
}
export function getDetail(id) {
    return request({
        url: 'PracticePreservation/detail/' + id,
        method: 'GET',
    })
}
export function queryByTime(start, end) {
    return request({
        url: 'PracticePreservation/QueryByTime',
        method: 'POST',
        data: {
            starttime: start,
            endtime: end,
        },
    })
}
export function updatePPreservation(data) {
    return request({
        url: 'PracticePreservation/Update',
        method: 'POST',
        data,
    })
}
export function deletePPreservation(id) {
    return request({
        url: 'PracticePreservation/Delete/' + id,
        method: 'POST',
    })
}
export function queryOnesPPreservation(id) {
    return request({
        url: 'PracticePreservation/' + id + '/Duty',
        method: 'GET',
    })
}

export function deletePRecord(guid, time) {
    return request({
        url: 'PracticePreservation/DeleteRecoder',
        data: {
            AccountId: guid,
            timeid: time,
        },
        method: 'POST',
    })
}

export function queryUnsignedPRecord(start, end, page) {
    return request({
        url: 'PracticePreservation/UnsignedTask',
        params: {
            limit: 10,
            page,
        },
        data: {
            starttime: start,
            endtime: end,
        },
        method: 'POST',
    })
}
export function querySignedPRecord(start, end, page) {
    return request({
        url: 'PracticePreservation/SignedTask',
        params: {
            limit: 10,
            page,
        },
        data: {
            starttime: start,
            endtime: end,
        },
        method: 'POST',
    })
}