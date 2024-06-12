import request from '@/utils/request'


export function fetchAllAbilities() {
    return request({
        url: 'jobAbility/getJobAbilityInfo', // Endpoint to fetch school names
        method: 'GET',
    });
}



export function getNewData() {
    return request({
        url: 'studentInfo/getNewData', // Endpoint to fetch new data
        method: 'POST'
    });
}

