import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'


function App() {
return (
<div>
<h1>Olá, React!</h1>
<p>Estou alterando meu primeiro componente.</p>
<Saudacao/>
<Perfil nome= "Scherrer" cargo= "Dono da Empresa"/>
<Painel/>
<Time nomes="Corinthians" titulos= "55" anos= "115"/>
<Produto nome="Notebook" preco={5320.00} categoria="Eletrônicos" />
<Dashboard />
</div>
)
}
export default App

function Saudacao() {
  return (
  <div style={{backgroundColor: '#f0f0f0', padding: '10px',
    borderRadius: '8px', marginBottom: '10px'}}>
      <h2 style={{color: '#007bff'}}>Olá Mundo!</h2>
      <p>Este componente foi criado separadamente</p>
    </div>
  );
}

function Perfil({nome, cargo}) {
  return (
  <div style={{
    border: '2px solid #2e7d32',
    borderRadius: '12px',
    padding: '15px',
    margin: '10px 0',
    backgroundColor: '#f1f8e9',
    boxShadow: '2px 2px 5px rgba(0,0,0,0.1'
  }}>
    <h3 style={{margin: '0 0 5px', color: '1b5e20'}}>
      Nome: {nome}
    </h3>
    <p style={{margin: 0, color: '#444'}}>
      Cargo: <strong>{cargo}</strong>
    </p>
    </div>
  );
}

function Painel() {
  const [texto, setTexto] = useState('');

  return(
      <div style={{backgroundColor: 'darkgreen',  padding: '10px',
    borderRadius: '8px', marginBottom: '10px'}}>
      <h4 style={{color: 'pink'}}>Escreva uma mensagem</h4>
      <input type="text"
      placeholder='Digite o algo...'
      onChange={(e) => setTexto(e.target.value)}
      style={{padding: '8px', width: '80%'}} 
      />
      <p>O que Você digitou: <span style={{color: 'red'}}>{texto}</span></p>
    </div>
  );
}

function Time({nomes, titulos, anos}) {
  return (
    <div style={{
      border: '2px solid black',
    borderRadius: '12px',
    padding: '15px',
    margin: '10px 0',
    backgroundColor: 'white',
    boxShadow: '2px 2px 5px rgba(0,0,0,0.1'
    }}>
      <h3 style={{
        margin: '0 0 5px', color: 'gray'
      }}>
        Nome do Time: {nomes}
      </h3>
      <p style={{margin: 0, color: '#444'}}>
      Titulos: <strong>{titulos}</strong>
    </p>
    <p style={{margin: 0, color: '#444'}}>
      Anos: <strong>{anos}</strong>
    </p>
    </div>
  );
}

// Crie 1 novo componemte que receba ao menos 3 propriedades e as utilize para alguma exibição. Obs: não esqueça de passar essas propriedades quando chamar esse componente no App

function Produto({ nome, preco, categoria }) {
  return (
    <div style={{
      border: '2px solid orange',
      borderRadius: '12px',
      padding: '15px',
      margin: '10px 0',
      backgroundColor: '#fff8f0',
      boxShadow: '2px 2px 5px rgba(0,0,0,0.2)'
    }}>
      <h3 style={{ margin: '0 0 5px 0', color: 'orange' }}>{nome}</h3>
      <p style={{ margin: '4px 0', color: 'gray' }}>Categoria: <strong>{categoria}</strong></p>
      <p style={{ margin: '4px 0', color: 'green', fontSize: '1.2rem' }}>
        R$ {preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
    </div>
  );
}

function Dashboard() {
  const [texto, setTexto] = useState('Bem-vindo ao Dashboard!');

  return (
    <div style={{ backgroundColor: '#79ff51', padding: '20px', border: '2px solid #ccc', marginTop: '20px', borderRadius: '8px' }}>
      <h4>Escreva uma mensagem: </h4>
      <input
        type="text"
        placeholder="Digite algo..."
        onChange={(e) => setTexto(e.target.value)}
        style={{ padding: '8px', width: '100%'}}
      />
      <p style={{ marginTop: '15px', color: '#333' }}><strong>{texto}</strong></p>
    </div>
  );
}
