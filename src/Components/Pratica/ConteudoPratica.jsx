import './ConteudoPratica.css'

const ConteudoPratica = () => {
  return (
    <div className='container-pratica'>
        <div className="texto-pratica">
            {/* Texto e áudio para a prática a serem implementados */}
            {/* Imagem / Ícone de som a ser implementado */}
            <p>Reproduza o áudio para ouvir sua frase.</p>
            <audio controls>
                <source src='caminho_para_audio' type='audio/mpeg'/>
                Seu navegador não suporta elemento de áudio
            </audio>
        </div>
        <div className="input-pratica">
            <textarea placeholder='Digite o que você ouviu: '/>
        </div>
        <div className="footer-pratica">
            <button className="btn-continue">
                Continue
            </button>
        </div>
    </div>
  )
}

export default ConteudoPratica