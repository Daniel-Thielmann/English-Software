import React from 'react';
import './TelaFinal.css';

const TelaFinal = ({ acertos, progresso, voltarParaInicio}) => {
  return (
    <div className='container-final'>
        <h1>Prática Concluída!</h1>
        <p>Você concluiu sua prática diária de 10 áudios</p>
        <p>Acertos: {acertos} de 10</p>
        <p>Progresso: {progresso}%</p>
        <button className='btn-voltar' onClick={voltarParaInicio}>Voltar para o início</button>
    </div>
  )
}

export default TelaFinal