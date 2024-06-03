import request from '@/utils/request'

export function getAbilityScores(jobId, schId, studentId, lv, upabilityId) {
    return request({
        url: 'radarData/getAbilityScores', // Endpoint to fetch ability scores
        method: 'GET',
        params: {
            jobId: jobId || 82, // Default value is 82
            schId: schId || 102, // Default value is 102
            studentId: studentId || '2021051201', // Default value is '2021051201'
            lv: lv || 1, // Default value is 1
            upabilityId: upabilityId || null // Default value is null
        }
    });
}

export function getAverageScoreByType( schId, studentId) {
    return request({
        url: 'abilityScore/averageScore', // Endpoint to fetch ability scores
        method: 'GET',
        params: {
            schId: schId || 102, // Default value is 102
            studentId: studentId || '2021051201', // Default value is '2021051201'
        }
    });
}

export function getScoreAndKnowledgeName(schId, studentId,type) {
    return request({
        url: 'abilityScore/scoreAndKnowledgeName', // Endpoint to fetch ability scores
        method: 'GET',
        params: {// Default value is 82
            schId: schId || 102,
            studentId: studentId || '2021051201',// Default value is 102
            type: type || '专业基础课',
        }
    });
}

