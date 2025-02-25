import PageConstructor from '../../Components/PageConstructor';
import axios from 'axios';
import React, { useState, useEffect } from "react";
import {getCookie} from "../../Components/CookiesHandler";
import Select from 'react-select'
import makeAnimated from "react-select/animated"
import './styles.css'
const animatedComponents = makeAnimated()

function AtualizarPerfil() {
    const [nome, setListName] = useState('')
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
    const [estado, setEstado] = useState(null)
    const [uf, setUf] = useState('')
    const [token, setToken] = useState(getCookie('auth'))
    const [id] = useState(getCookie('id'))
    const [auth, setAuth] = useState(token)
    const selectContent = value => { setUf(value) }

    const getUsuario = async () => {
        try {
            const resposta = await axios.post(`http://localhost:3030/usuario/${id}`, {token:auth})
            setListName(resposta.data.nome_completo)
            setEmail(resposta.data.email)
            setListsenha(resposta.data.senha)
            setCpf(resposta.data.cpf)
            setTelefone(resposta.data.telefone)
            let data_nascimento = new Date(resposta.data.data_nascimento)                
            data_nascimento = (data_nascimento.getFullYear()+"-"+String(data_nascimento.getMonth()+1)+"-"+String(data_nascimento.getDate()+1))
            setNascimento(data_nascimento)
            setCnh(resposta.data.cnh)
            let validade_cnh = new Date(resposta.data.validade_cnh)                
            validade_cnh = (validade_cnh.getFullYear()+"-"+String(String(validade_cnh.getMonth()+1).padStart(2, '0'))+"-"+String(validade_cnh.getDate()+1));
            setValidade(validade_cnh)
        } catch (err) {
            console.log(err)
        }
    }
     const getCartao = async () => {

        try {
            const resposta = await axios.post(`http://localhost:3030/cartao/usuario/${id}`, {token:auth})
            setNomeCartao(resposta.data[0].nome)
            setNumCartao(resposta.data[0].numero)
            let validade = new Date(resposta.data[0].validade)                
            validade = (validade.getFullYear()+"-"+String(String(validade.getMonth()+1).padStart(2, '0'))+"-"+String(validade.getDate()+1));
            setDataValidade(validade)
            setCvc("")
        } catch (err) {
            console.log(err)
        }
    } 
    const getEndereco = async () => {
        try {
            const resposta = await axios.get(`http://localhost:3030/endereco/user/${id}`)
            setCep(resposta.data[0].cep)
            setRua(resposta.data[0].logadouro)
            setCidade(resposta.data[0].cidade)
            setUf(resposta.data[0].estado)
            setComplemento(resposta.data[0].complemento)
            
        }catch (err) {
            console.log(err)
        }
    }
    //Select Estados
    useEffect(() => {
        getCartao()
        getUsuario()
        getEndereco()
        setToken(getCookie("auth"))
        axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados/')
            .then(response => response.data)
            .then(response => response.map(element => { return { value: element.nome, label: element.nome } }))
            .then(response => {
                setEstado(response)
            })
    }, [])
    const customTheme = (theme) => {
        return {
            ...theme,
            colors: {
                ...theme.colors,
                primary25: '#7986CB',
                primary: 'black'
            }
        }
    }
    //----------------------------------------------

    //Axios
    //Atualizar a forma como o put funciona na api
    const sendCartao = async () => {
        const usuarioCartao = { nome: nomeCartao, numero: numCartao, validade: dataValidade, cvc: cvc }

        try {
            const resposta = await axios.put("http://localhost:3030/cartao", usuarioCartao)
            alert(resposta.data.nome_completo)
            setNomeCartao("")
            setNumCartao("")
            setDataValidade("")
            setCvc("")
        } catch (err) {
            console.log(err)
        }
    }
    //Atualizar a forma como o put funciona na api
    const sendEndereco = async () => {
        const usuarioEndereco = { id: 2,cep: cep, logadouro: rua, cidade: cidade, estado: uf, complemento: complemento }

        try {
            const resposta = await axios.put("http://localhost:3030/endereco", usuarioEndereco)
            alert(resposta.data)
            setCep("")
            setRua("")
            setCidade("")
            setUf("")
            setComplemento("")
        } catch (err) {
            console.log(err)
        }
    }
    
    const sendUsuario = async () => {
        const usuarioCliente = {token: auth, id: id, nome_completo: nome, email: email, senha: senha, cpf: cpf, telefone: telefone, data_nascimento: nascimento, cnh: cnh, validade_cnh: validade, fk_id_tipo_usuario: 2 }
        console.log(auth)
        try {
            const resposta = await axios.put("http://localhost:3030/usuario", usuarioCliente, {token:auth})
            alert(resposta.data)
            setListName("")
            setEmail("")
            setListsenha("")
            setCpf("")
            setTelefone("")
            setNascimento("")
            setCnh("")
            setValidade("")
        } catch (err) {
            console.log(err)
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
                alert("Data de Nascimento inválida.")
            }
        } else {
            diferencaAno--
            if (diferencaAno <= 18) {
                alert("Data de Nascimento inválida.")
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
            alert("CPF Inválido!")
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
            alert("CEP Inválido!")
            setCep("")
        }
    }

    return (
        <PageConstructor >
            <>
            <div className="App">
                <main className="section">
                    {
                        overlay ? <div id="overlay">
                            <div className="message">
                                <h2 className="corCadastro"> Cadastro realizado com sucesso!</h2>
                                <button onClick={setOverlay(false)}> Ok</button>
                            </div>
                        </div>
                            : ""
                    }
                    <form name="dadosCliente">
                        <h1>
                            Atualizar Cadastro de Cliente
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
                                            <input type="text" maxLength="14" name="cpf" id="cpf" onKeyUp={() => false/*mascaraCpf('###.###.###-##', this)*/} value={cpf} onChange={event => setCpf(event.target.value)} onKeyPress={cpfPress} onBlur={cpfBlur} />
                                        </div>
                                        <div className="formshdivs">
                                            <label htmlFor="telefone"> Celular:</label>
                                            <input type="text" name="telefone" id="telefone" value={telefone} onChange={event => setTelefone(event.target.value)} />
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
                                            options={estado}styles={{
                                                indicatorSeparator: () => {},
                                                dropdownIndicator: defaultStyles => ({ display: 'none' })
                                            }}
                                            placeholder="Selecione seu Estado"
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
                                <input type="text" maxLength="20" name="numcartao" id="numcartao" className="size3" value={numCartao} onChange={event => setNumCartao(event.target.value)} />
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
                            <button onClick={() => {sendCartao(); sendEndereco(); sendUsuario()}}>Salvar</button>
                        </div>
                    </form>

                </main>
            </div>
        </>
        </PageConstructor>
    )
}

export default AtualizarPerfil