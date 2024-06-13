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
 * @returns {Promise} - A promise that resolves to the result of the API call.
 */
export function getStudentInfo({ jobid, schid, abilityId, score, scoreComparison, types, minScores, minScoreComparisons }) {
    // 检查 jobid 和 schid 是否存在
    if (jobid === undefined || schid === undefined) {
        throw new Error('jobid and schid are required.');
    }

    // 检查第一组参数 (abilityId, score)
    const group1 = abilityId !== undefined && score !== undefined && scoreComparison !== undefined;

    // 检查第二组参数 (types, minScores, minScoreComparisons)
    const group2 = (types !== undefined && types.length > 0) ||
        (minScores !== undefined && minScores.length > 0) ||
        (minScoreComparisons !== undefined && minScoreComparisons.length > 0);

    if (!group1 && !group2) {
        throw new Error('Either group1 (abilityId, score, scoreComparison) or group2 (types, minScores, minScoreComparisons) must be provided.');
    }

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

    return request({
        url: 'studentInfo/query',
        method: 'POST',
        data: params
    });
}
