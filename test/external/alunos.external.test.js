import { api } from '../helpers/api.js';
import { expect } from 'chai';
import { novoAluno } from '../factories/alunosFactory.js';
import { comTokenDeAdmin, getToken } from '../helpers/auth.js';

describe('Login', () => {

    it('deve negar o cadastro de um aluno quando ele já existe', async () => {
        const token = await getToken('admin@escola.com', 'admin123');

        const cadastroAlunoResposta = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nome: 'Ana Souza', 
                email: 'ana.souza@example.com', 
                matricula: '2024001',
                senha: '123456'
            });

        // Validar que ele foi cadastrado
        expect(cadastroAlunoResposta.status).to.equal(409);
        expect(cadastroAlunoResposta.body.error).to.equal('Já existe um aluno cadastrado com essa matrícula ou e-mail.');

    });

    it('deve cadastrar um aluno quando ele informa dados válidos', async () => {
        const cadastroAlunoResposta = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send(novoAluno());

        console.log('Resposta do cadastro do aluno:', cadastroAlunoResposta.body);
        // Validar que ele foi cadastrado
        expect(cadastroAlunoResposta.status).to.equal(201);
        expect(cadastroAlunoResposta.body.nome).to.equal(cadastroAlunoResposta.body.nome);
        expect(cadastroAlunoResposta.body.email).to.equal(cadastroAlunoResposta.body.email);
        expect(cadastroAlunoResposta.body.matricula).to.equal(cadastroAlunoResposta.body.matricula);
    });
});