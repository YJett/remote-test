import request from '@/utils/request'

/**
 * Fetches student information based on the given parameters.
 *
 * @param {Object} params - The query parameters.
 * @param {number} params.jobid - Job ID (required).
 * @param {number} params.schid - School ID (required).
 * @param {number} [params.abilityId] - Ability ID.
 * @param {number} [params.score] - Score.
 * @param {string} [params.scoreComparison] - Score comparison.
 * @param {string[]} [params.types] - List of types.
 * @param {number[]} [params.minScores] - List of minimum scores.
 * @param {string[]} [params.minScoreComparisons] - List of minimum score comparisons.
 * @param {string} [params.party] - Party.
 * @param {string} [params.binfo] - binfo、竞赛.
 * @param {string} [params.ainfo] - ainfo/奖学金.
 * @param {string} [params.cinfo] - cinfo证书.
 * @param {string} [params.hometown] - Hometown.
 * @returns {Promise} - A promise that resolves to the result of the API call.
 */
export function getStudentInfo({ jobid, schid, abilityId, score, scoreComparison, types, minScores, minScoreComparisons, party, binfo, ainfo, cinfo, hometown }) {
    // 检查 jobid 和 schid 是否存在
    if (jobid === undefined || schid === undefined) {
        throw new Error('jobid and schid are required.');
    }

    // 检查第一组参数 (abilityId, score)
    const group1 = abilityId !== undefined && score !== undefined && scoreComparison !== undefined;

    // 检查第二组参数 (types, minScores, minScoreComparisons)
    const group2 = (types !== undefined && types.length > 0) &&
        (minScores !== undefined && minScores.length > 0) &&
        (minScoreComparisons !== undefined && minScoreComparisons.length > 0);

    const group3 = party !== undefined ||
        binfo !== undefined ||
        ainfo !== undefined ||
        cinfo !== undefined ||
        hometown !== undefined;

    // if (!group1 && !group2 && !group3) {
    //     throw new Error('Either group1 (abilityId, score, scoreComparison) or group2 (types, minScores, minScoreComparisons) or group3333 must be provided.');
    // }

    const params = {};
    params.jobid = jobid;
    params.schid = schid;

    if (group1) {
        params.abilityId = abilityId;
        params.score = score;
        params.scoreComparison = scoreComparison;
    }

    if (group2) {
        params.types = types;
        params.minScores = minScores;
        params.minScoreComparisons = minScoreComparisons;
    }

    if (group3) {
        params.party = party;
        params.binfo = binfo;
        params.ainfo = ainfo;
        params.cinfo = cinfo;
        params.hometown = hometown;
    }

    return request({
        url: 'studentInfo/query',
        method: 'POST',
        data: params
    });
}
