import request from '@/utils/request'




export function fetchAllJobs() {
    return request({
        url: 'job/jobInfo', // Endpoint to fetch school names
        method: 'GET',
    });
}


