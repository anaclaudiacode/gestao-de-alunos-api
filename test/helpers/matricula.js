import { api } from './api.js';
import { comTokenDeAdmin } from './auth.js';

export async function matricularAluno(alunoId, disciplinaId) {
    return api()
        .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
        .set('Content-Type', 'application/json')
        .set('Authorization', await comTokenDeAdmin())
        .send({
            alunoId
        });
}