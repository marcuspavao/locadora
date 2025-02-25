import axios from 'axios';
import React, { useState, useEffect } from "react";
import api from '../../api'
import Select from 'react-select'
import makeAnimated from "react-select/animated"
import { getCookie } from '../CookiesHandler';




const animatedComponents = makeAnimated()
function PageCadastroCliente() {
    const [nome, setListName] = useState('')
    const [fkid, setFkid] = useState('')
    const [overlay, setOverlay] = useState(false)
    const [email, setEmail] = useState('')
    const [senha, setListsenha] = useState('')
    const [nascimento, setNascimento] = useState('')
    const [cnh, setCnh] = useState('')
    const [telefone, setTelefone] = useState('')
    const [cpf, setCpf] = useState('')
    const [repetirSenha, setRepetirSenha] = useState('')
    const [cep, setCep] = useState('')
    const [cidade, setCidade] = useState('')
    const [rua, setRua] = useState('')
    const [validade, setValidade] = useState('')
    const [complemento, setComplemento] = useState('')
    const [numCartao, setNumCartao] = useState('')
    const [dataValidade, setDataValidade] = useState('')
    const [cvc, setCvc] = useState('')
    const [nomeCartao, setNomeCartao] = useState('')
    const [estado, setEstado] = useState('')
    const [holderEstado, setHolderEstado] = useState('Selecione seu Estado')
    const [uf, setUf] = useState({})
    const [erro, setErro] = useState(null)
    const selectContent = value => { setUf(value) }

    //Select Estados
    useEffect(() => {
        axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados/')
            .then(response => response.data)
            .then(response => response.map(element => { return { value: element.nome, label: element.sigla } }))
            .then(response => {
                setEstado(response)
            })
    }, [])

    useEffect(()=>{
    },[overlay])

function showOverlay(){
    setOverlay(true);

}
    
    const styleSelect = {
        indicatorSeparator: () => { },
        dropdownIndicator: defaultStyles => ({ display: 'none' })
    }

    const customTheme = (theme) => {
        return {
            ...theme,
            colors: {
                ...theme.colors,
                primary25: '#7986CB',
                primary: 'black',
            }
        }
    }
    //----------------------------------------------

    //Axios
    const sendCartao = async () => {
        const usuarioCartao = { nome: nomeCartao, numero: numCartao, validade: dataValidade, cvc: cvc, fk_id_usuario: fkid }
        try {
            const resposta = await axios.post("http://localhost:3030/cartao", usuarioCartao)
            setNomeCartao("")
            setNumCartao("")
            setDataValidade("")
            setCvc("")
            
        } catch (err) {
            setErro(err)
        }
    }

    const sendEndereco = async () => {
        const usuarioEndereco = { cep: cep, logadouro: rua, cidade: cidade, estado: uf, complemento: complemento,fk_id_usuario : fkid }

        try {
            const resposta = await axios.post("http://localhost:3030/endereco", usuarioEndereco)
            setCep("")
            setRua("")
            setCidade("")
            setUf("")
            setComplemento("")
        } catch (err) {
            setErro(err)
        }
    }

    const sendUsuario = async () => {
        const usuarioCliente = { nome_completo: nome, email: email, senha: senha, cpf: cpf, telefone: telefone, data_nascimento: nascimento, cnh: cnh, validade_cnh: validade, fk_id_tipo_usuario: 2 }

        try {
            const resposta = await axios.post("http://localhost:3030/usuario", usuarioCliente)
            setListName("")
            setEmail("")
            setListsenha("")
            setCpf("")
            setTelefone("")
            setNascimento("")
            setCnh("")
            setValidade("")
            setFkid(resposta.data.id)
        } catch (err) {
            setErro(err)
        }
    }
    //----------------------------------------------


    //  Validação Nascimento
    const validaNascimento = () => {
        const data = new Date()
        let diaAtual = data.getDate()
        let mesAtual = data.getMonth() + 1
        let anoAtual = data.getFullYear()
        let arrayNascimento = nascimento.split('-')
        let diaNascimento = arrayNascimento[2]
        let mesNascimento = arrayNascimento[1]
        let anoNascimento = arrayNascimento[0]
        let diferencaAno = anoAtual - anoNascimento
        if (mesAtual >= mesNascimento && diaAtual >= diaNascimento) {
            if (diferencaAno <= 18) {
                setErro("Data de Nascimento inválida.")
            }
        } else {
            diferencaAno--
            if (diferencaAno <= 18) {
                setErro("Data de Nascimento inválida.")
            }
        }
    }
    //----------------------------------------------

    //  Validação && Formatação CPF
    const cpfPress = () => {
        let inputLenght = cpf.length
        if (inputLenght === 3 || inputLenght === 7) {
            setCpf(cpf + '.')
        } else if (inputLenght === 11) {
            setCpf(cpf + '-')
        }
    }

    const cpfBlur = () => {
        let validarRegExCpf = /^\d{3}.\d{3}.\d{3}-\d{2}$/;
        if (cpf.match(validarRegExCpf)) {
        } else if (cpf === "") { }
        else {
            setErro("CPF Inválido!")
        }
    }
    //----------------------------------------------

    //  Formatação Cartão
    const cartaoPress = () => {
        let inputLenght = numCartao.length
        if (inputLenght === 4 || inputLenght === 9 || inputLenght === 14) {
            setNumCartao(numCartao + '-')
        }
    }
    //----------------------------------------------
    
    //  Validação && Formatação CEP
    const cepPress = () => {
        let inputLenght = cep.length
        if (inputLenght === 5)
            setCep(cep + '-')
    }

    const cepBlur = () => {
        let validarRegExCep = /[0-9]{5}-[\d]{3}/
        if (cep.match(validarRegExCep)) {
        } else if (cep === "") { }
        else {
            setErro("CEP Inválido!")
            setCep("")
        }

        axios.get(`https://viacep.com.br/ws/${cep}/json/`)
            .then(res => res.data)
            .then(data => {
                setCidade(data.localidade)
                setRua(data.logradouro)
                setUf({ value: data.uf, label: data.uf })
            })
    }
    //----------------------------------------------

    //Formatação && Validação de Telefone
    let inputLenght = telefone.length
    const formatoPress = () => {
        console.log(inputLenght)
        if (inputLenght === 0) {
            setTelefone(telefone + '(')
        } else if (inputLenght === 3) {
            setTelefone(telefone + ') ')
        } else if (inputLenght === 10) {
            setTelefone(telefone + '-')
        }
    }
    //----------------------------------------------




    return (
        <>
            <div className="App">
                <main className="section">
                  <div id="overlay" style={{display:overlay ? 'flex' : 'none' }}>
                            <div className="message">
                                <h2 className="corCadastro" > {erro? "Houve algum erro, tente novamente.": "Cadastro realizado com sucesso!"}</h2>
                                <button onClick={()=>setOverlay(false)}> Ok</button>
                            </div>
                        </div>
                    
                    <form name="dadosCliente">
                        <h1>
                            Cadastro de Cliente
                        </h1>
                        <div className="forms">
                            <h2>Dados do Cliente</h2>
                            <div className="formshdivs">
                                <div className="formsvdivs">
                                    <div className="formshdivs">
                                        <label htmlFor="nome" > Nome Completo:</label>
                                        <input type="text" name="nome" id="nome" value={nome} onChange={event => setListName(event.target.value)} />
                                    </div>
                                    <div className="formshdivs">
                                        <label htmlFor="emailcad" > E-mail:</label>
                                        <input type="email" name="emailcad" id="emailcad" value={email} onChange={event => setEmail(event.target.value)} />
                                    </div>
                                    <div className="formshdivs">
                                        <label htmlFor="senhacad" > Senha:</label>
                                        <input type="password" name="senhacad" id="senhacad" value={senha} onChange={event => setListsenha(event.target.value)} />
                                    </div>
                                    <div className="formshdivs">
                                        <label htmlFor="nascimento" > Data de Nascimento:</label>
                                        <input type="date" name="nascimento" id="nascimento" value={nascimento} onChange={event => setNascimento(event.target.value)} onBlur={validaNascimento} />
                                    </div>
                                    <div className="formshdivs">
                                        <label htmlFor="validade" > Validade:</label>
                                        <input type="date" name="validade" id="validade" value={validade} onChange={event => setValidade(event.target.value)} />
                                    </div>
                                </div>
                                <div className="formsvdivs">
                                    <div className="formsvdivs">
                                        <div className="formshdivs">
                                            <label htmlFor="cpf"> CPF:</label>
                                            <input type="text" maxLength="14" name="cpf" id="cpf" value={cpf} onChange={event => setCpf(event.target.value)} onKeyPress={cpfPress} onBlur={cpfBlur} />
                                        </div>
                                        <div className="formshdivs">
                                            <label htmlFor="telefone"> Telefone:</label>
                                            <input type="text" name="telefone" id="telefone" maxLength="15" value={telefone} onChange={event => setTelefone(event.target.value)} onKeyPress={formatoPress}/>
                                        </div>
                                        <div className="formshdivs">
                                            <label htmlFor="repetirsenha"> Repetir a Senha:</label>
                                            <input type="password" name="repetirsenha" id="repetirsenha" value={repetirSenha} onChange={event => setRepetirSenha(event.target.value)} />
                                        </div>
                                        <div className="formshdivs">
                                            <label htmlFor="cnh">CNH:</label>
                                            <input type="text" maxLength="11" name="cnh" id="cnh" value={cnh} onChange={event => setCnh(event.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="forms">
                            <h2>Endereço</h2>
                            <div className="formshdivs">
                                <div className="formsvdivs">
                                    <div className="formshdivs">
                                        <label htmlFor="cep"> CEP:</label>
                                        <input type="text" maxLength="9" name="cep" id="cep" value={cep} onChange={event => setCep(event.target.value)} onKeyPress={cepPress} onBlur={cepBlur} />
                                    </div>
                                    <div className="formshdivs">
                                        <label htmlFor="cidade"> Cidade:</label>
                                        <input type="text" name="cidade" id="cidade"
                                            value={cidade}
                                            onChange={event => setCidade(event.target.value)}
                                        />
                                    </div>
                                    <div className="formshdivs">
                                        <label htmlFor="estado">Estado:</label>
                                        <Select className="select" name="estado" id="estado"
                                            value={uf}
                                            theme={customTheme}
                                            onChange={selectContent}
                                            components={animatedComponents}
                                            options={estado} styles={styleSelect}
                                            placeholder={holderEstado}
                                            isSearchable
                                            closeMenuOnSelect

                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="formsvdivs">
                                <div className="formshdivs">
                                    <label htmlFor="rua"> Rua:</label>
                                    <input type="text" className="size4" maxLength="20" name="rua" id="rua" value={rua} onChange={event => setRua(event.target.value)} />
                                </div>
                                <div className="formshdivs">
                                    <label htmlFor="complemento" >Complemento:</label>
                                    <input type="text" className="size4" name="complemento" id="complemento" value={complemento} onChange={event => setComplemento(event.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="forms">
                            <h2>Dados Bancários</h2>
                            <div className="formshdivs">
                                <label htmlFor="numcartao"> Número do Cartão:</label>
                                <input type="text" maxLength="19" name="numcartao" id="numcartao" className="size3" value={numCartao} onChange={event => setNumCartao(event.target.value)} onKeyPress={cartaoPress} />
                            </div>
                            <div className="formshdivs">
                                <label htmlFor="nomecartao"> Nome do Cartão:</label>
                                <input type="text" name="nomecartao" id="nomecartao" className="size3" value={nomeCartao} onChange={event => setNomeCartao(event.target.value)} />
                            </div>
                            <div className="formshdivs">
                                <label htmlFor="datavalidade">Data de Validade:</label>
                                <input type="date" name="datavalidade" id="datavalidade" className="size3" value={dataValidade} onChange={event => setDataValidade(event.target.value)} />
                            </div>
                            <div className="formshdivs">
                                <label htmlFor="cvc"> CVC:</label>
                                <input type="text" maxLength="3" name="cvc" id="cvc" value={cvc} onChange={event => setCvc(event.target.value)} className="size1" />
                            </div>
                        </div>
                        <div className="formsbuttons">
                            <button>Cancelar</button>
                            <button type={"button"} onClick={() => [sendCartao(), sendEndereco(), sendUsuario(),showOverlay()]}>Salvar</button>
                        </div>
                    </form>

                </main>
            </div>
        </>

    )
}


export default PageCadastroCliente;