import request from '@/utils/request';

// Fetch a specific JbAbilityKnowledge by ID
export function getJbAbilityKnowledgeById(id) {
    return request({
        url: `api/jbAbilityKnowledge/${id}`,
        method: 'GET',
    });
}

// Insert a new JbAbilityKnowledge
export function insertJbAbilityKnowledge(schid, abilityid, knowledgeid) {
    return request({
        url: 'jbAbilityKnowledge/insert',
        method: 'POST',
        data: {
            schid,
            abilityid,
            knowledgeid
        },
    });
}

// Update an existing JbAbilityKnowledge
export function updateJbAbilityKnowledge(schid, abilityid, knowledgeid) {
    return request({
        url: 'jbAbilityKnowledge/update',
        method: 'PUT',
        data: {
            schid,
            abilityid,
            knowledgeid
        },
    });
}

// Delete a JbAbilityKnowledge by ID
export function deleteJbAbilityKnowledgeById(id) {
    return request({
        url: `jbAbilityKnowledge/${id}`,
        method: 'DELETE',
    });
}
