import "./styles.css"
import garage from "../../img/garagem.svg"
import buscar from "../../img/busca.svg"
import { useState } from "react"
import Carrossel from "../Carrossel"
import Resultados from "../Resultados"
import axios from "axios";




function Searchbar() {
    const [showResults, setShowResults] = useState(false)
    const [localRetirada, setLocalRetirada] = useState("")
    const [localEntrega, setLocalEntrega] = useState("")
    const [dataRetirada, setDataRetirada] = useState("")
    const [dataEntrega, setDataEntrega] = useState("")
    const [horarioRetirada, setHorarioRetirada] = useState("")
    const [horarioEntrega, setHorarioEntrega] = useState("")
    const [resultados, setResultados] = useState("")

    async function buscarVeiculos() {

        try {

            let string_entrega = `${dataEntrega}T${horarioEntrega}Z`;
            let string_retirada = `${dataRetirada}T${horarioRetirada}Z`;


            const busca = {
                data_retirada: string_retirada,
                data_entrega: string_entrega,
                cidade_origem:localRetirada,
                cidade_destino:localEntrega,
                estado_origem:localRetirada,
                estado_destino:localEntrega
            }
            console.log(busca);

            const resposta = await axios({ method: "POST", url: "http://localhost:3030/busca/", data: busca })
            
            setResultados(resposta.data);


        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <form name="searchbar">
                <div className="searchbar">
                    <div className="searchbar-v">
                        <img src={garage} alt="Icone de garagem" className="garicon" />
                    </div>
                    <div className="searchbar-h">
                        <div className="searchbar-v">

                            <input className="searchbar-item size3" type="text" name="localRetirada" step={60} value={localRetirada} onChange={local => setLocalRetirada(local.target.value)} id="localRetirada" placeholder="Digite aqui o local de retirada" />
                            <input className="searchbar-item size2" type="date" name="diaRetirada" step={60} value={dataRetirada} onChange={data => setDataRetirada(data.target.value)} id="diaRetirada" placeholder="Dia da retirada" />
                            <input className="searchbar-item size1" type="time" name="horarioRetirada" step={60} value={horarioRetirada} onChange={horario => setHorarioRetirada(horario.target.value)} id="horarioRetirada" placeholder="Horário da retirada" />
                        </div>
                        <div className="searchbar-v">
                            <input className="searchbar-item size3" type="text" name="localEntrega" step={60} value={localEntrega} onChange={local => setLocalEntrega(local.target.value)} id="localEntrega" placeholder="Digite aqui o local de entrega" />
                            <input className="searchbar-item size2" type="date" name="diaEntrega" step={60} value={dataEntrega} onChange={data => setDataEntrega(data.target.value)} id="diaEntrega" placeholder="Dia da devolução" />
                            <input className="searchbar-item size1" type="time" name="horarioEntrega" step={60} value={horarioEntrega} onChange={horario => setHorarioEntrega(horario.target.value)} id="horarioEntrega" placeholder="Horário da retirada" />
                        </div>
                    </div>
                    {/*LINK ABAIXO SOMENTE PARA DEMONSTRAÇÃO, O BOTÃO BUSCAR NÂO FUNCIONARA POR A HREF !!!!*/}
                    <button type="button" className="searchbar-button" id="buscaveiculo" onClick={() => { buscarVeiculos(); setShowResults(true) }}> Buscar<img src={buscar} alt="Buscar" className="buscaicon" /> </button>
                </div>
            </form>

            {showResults ?
                <Resultados resultados={resultados} /> :
                <Carrossel />
            }


        </>
    )
}

export default Searchbar