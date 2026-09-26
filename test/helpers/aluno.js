import { api } from './api.js';
import { comTokenDeAdmin } from '../helpers/auth.js';
import { novoAluno } from '../factories/alunosFactory.js';

export async function cadastrarAluno() {
    const aluno = novoAluno();

    const resposta = await api()
        .post('/api/admin/alunos')
        .set('Content-Type', 'application/json')
        .set('Authorization', await comTokenDeAdmin())
        .send(aluno);

    return {
        resposta,
        dados: aluno
    };
}