import React, { useEffect, useState } from 'react';
import api from './services/api';
import DevItem from './components/DevItem';
import DevForm from './components/DevForm';


import './global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';

/* 
Componente -> uma função que retorna algum conteúdo HTML/CSS ou JS para a interface
              sempre iniciado com letra maiúscula
              um componente por arquivo
              bloco isolado de html/css e JS o qual não interfere no restante da aplicação

Estado -> informações que o componente vai manipular (imutabilidade)
          nunca vou alterar um dado: sempre cria-se um novo dado a partir do valor anterior


Propriedade -> atributo (informações que um componente PAI passa para o componente FILHO)
*/

function App() {
  const [devs, setDevs] = useState([]);

  useEffect(() => {
    async function loadDevs() {
      const response = await api.get('/devs');

      setDevs(response.data);
    }
    loadDevs();
  }, []);

  async function handleAddDev(data) {
    // previnindo o comportamento padrão do formulário (geralmente de ir para outra tela)

    const response = await api.post('/devs', data);

    setDevs([...devs, response.data]); // adição dentro de um array que é um estado

  }

  return (
    <div id="app">
      {/* aside -> tag no HTML para fazer uma sidebar */}
      <aside>
        <strong>Cadastrar</strong>
        {/* passando para o componente filho uma função como propriedade */}
        <DevForm onSubmit={handleAddDev} /> 
      </aside>

      <main>
        <ul>
          {devs.map(dev => (
            <DevItem key={dev._id} dev={dev} />
          ))}

          
        </ul>
      </main>

    </div>
  );
}

export default App;
