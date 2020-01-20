// pega uma função específica do express (de roteamento, no caso)
const { Router } = require('express');
const DevController = require('./controllers/DevController')
const SearchController = require('./controllers/SearchController')

const routes = Router();


// ao acessar a rota -> fazendo uma requisição e esta pode conter alguma info
// requisição -> tudo que vem do Front End (o que o cliente envia pro servidor)
// response -> é a resposta pro cliente (Front)

// Métodos HTTP: GET, POST, PUT, DELETE

// post -> querendo criar/cadastrar alguma informação (salvar um produto, cadastrar um usuário)
// put -> editar um recurso da aplicação (editar uma informação do usuário)

/* Tipos de parâmetros:
 Query Params: para realizar buscas (quase exclusivamente do GET) -> são incorporados na própria URL (requisição) com algum nome
               (para Filtros, ordenação, paginação, ...) -> request.query
 
  Route Params: quase exclusivamente dos PUT e DELETE
                 é incorporado na rota para acessar alguma informação específica (alterar ou deletar um usuário específico)
                 '/users/:id' (request.params) (identificar um recurso na alteração ou remoção)
  
  Body: quase exclusivamente do POST e PUT
        envia-se informações pelo corpo da requisição (as informações do cadastro de um usuário (email, idade, nome, ...))
        request.body (dados para criação ou alteração de um registro)
*/       

// pode-se ter a mesma rota lidando com coisas diferentes, desde que sejam métodos diferentes
routes.get('/devs', DevController.index);
routes.post('/devs', DevController.store);

routes.get('/search', SearchController.index);

module.exports = routes;