import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import { api } from '../helpers/api.js';
import { comTokenDeAdmin, comTokenDeAluno } from '../helpers/auth.js';
import { cadastrarAluno } from '../helpers/aluno.js';
import { matricularAluno } from '../helpers/matricula.js';
import trabalhos from '../fixtures/trabalhos.json' with { type: 'json' };

describe('Entrega de trabalho do aluno', () => {

    it.only('deve registrar a entrega de um trabalho como aluno', async () => {

        const novoAluno = await cadastrarAluno(); 

        const tokenAluno = await comTokenDeAluno(
                novoAluno.dados.email,
                novoAluno.dados.senha
            );
        
        const idAluno= jwt.decode(tokenAluno).sub;

        for (const trabalho of trabalhos) {
            //Vincula a disciplina ao aluno
            await matricularAluno(idAluno, trabalho.disciplinaId);

            const registroTrabalhoAluno = await api() 
                .post(`/api/alunos/${idAluno}/trabalhos`) 
                .set('Accept', 'application/json') 
                .set('Authorization', `Bearer ${tokenAluno}`) 
                .set('Content-Type', 'application/json') 
                .send({ disciplinaId: trabalho.disciplinaId, titulo: trabalho.titulo, descricao: trabalho.descricao }); 
                
                expect(registroTrabalhoAluno.status).to.equal(201); 
                expect(registroTrabalhoAluno.body.alunoId) .to.equal(idAluno); 
                expect(registroTrabalhoAluno.body.disciplinaId) .to.equal(trabalho.disciplinaId); 
                expect(registroTrabalhoAluno.body.titulo) .to.equal(trabalho.titulo); 
                expect(registroTrabalhoAluno.body.descricao) .to.equal(trabalho.descricao); 
                expect(registroTrabalhoAluno.body.status) .to.equal('entregue');
        }
    });
});
