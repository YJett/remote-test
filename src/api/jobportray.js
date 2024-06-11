import request from '@/utils/request'

/**
 * Fetches student information based on the given parameters.
 *
 * @param {Object} params - The query parameters.
 * @param {number} params.jobid - Job ID.
 * @param {number} params.abilityId - Ability ID.
 * @param {number} params.score - Score.
 * @param {string} params.scoreComparison - Score comparison.
 * @param {number} params.schid - School ID.
 * @param {string[]} params.types - List of types.
 * @param {number[]} params.minScores - List of minimum scores.
 * @param {string[]} params.minScoreComparisons - List of minimum score comparisons.
 * @returns {Promise} - A promise that resolves to the result of the API call.
 */
export function getStudentInfo({ jobid, abilityId, score, scoreComparison, schid, types, minScores, minScoreComparisons }) {
    const group1 = jobid !== undefined && abilityId !== undefined && score !== undefined && scoreComparison !== undefined;
    const group2 = schid !== undefined && types !== undefined && minScores !== undefined && minScoreComparisons !== undefined;

    if (!group1 && !group2) {
        throw new Error('Either group1 (jobid, abilityId, score, scoreComparison) or group2 (schid, types, minScores, minScoreComparisons) must be provided.');
    }

    const params = {};
    if (group1) {
        params.jobid = jobid;
        params.abilityId = abilityId;
        params.score = score;
        params.scoreComparison = scoreComparison;
    }
    if (group2) {
        params.schid = schid;
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
