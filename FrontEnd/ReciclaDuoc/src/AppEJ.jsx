import './App.css'

function App() {

  return (
    <>
      <h1 className="titulo font-bold">ReciclaDUOC</h1>

      <div className='Botones'>
        <button className='boton'>Reciclar</button>
        <h1 className='Puntos-Actuales'>750 Puntos</h1>
        <button className='boton boton-2' id='Ganar'>Ganar Puntos</button>
        <button className='boton boton-2' id='Canje'>Canjear Premios</button>
      </div>

      <div className="Ranking">
        <h1>Ranking</h1>
        <div className="rank">
          <img src="src\assets\Icons\Top1 1.svg" alt="Top 1 Medal" />
          <p className='rank-name'>Maria</p>
          <p className='rank-point'>1,200 pts</p>
        </div>

      </div>



    </>
  )
}

export default App
