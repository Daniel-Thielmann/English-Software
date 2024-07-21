import './BarraProgresso.css'

const BarraProgresso = ({ progresso }) => {

  const progressoAtualizado = Math.min(Math.max(progresso, 0), 100);

  return (
    <>
      <div className="progress-text">
        Progresso: {progresso}% / 100%
      </div>
      <div className='progress-container'>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressoAtualizado}%` }}></div>
        </div>
      </div>
    </>
  )
}

export default BarraProgresso