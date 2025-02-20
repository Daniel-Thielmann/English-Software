import React from 'react';
import './TelaFinal.css';

const TelaFinal = ({ acertos = 0, progresso = 0, voltarParaInicio}) => {
  return (
    <div className='container-final'>
        <h1 className='header-final'>Prática Concluída!</h1>
        <p className='sub-final'>Volte amanhã para seguir praticando</p>
        <p className='acertos-final'><span>Acertos:</span> {acertos} de 10</p>
        <p className='progress-final'><span>Progresso:</span> {progresso}%</p>
        <button className='btn-voltar' onClick={voltarParaInicio}>Voltar para o início</button>
    </div>
  )
}

export default TelaFinal