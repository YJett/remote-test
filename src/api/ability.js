import request from '@/utils/request'


export function fetchAllAbilities() {
    return request({
        url: 'jobAbility/getJobAbilityInfo', // Endpoint to fetch school names
        method: 'GET',
    });
}


