import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import './form.css';
import { useNavigate } from "react-router-dom";
import api from '../../services/api';

export default function form({ tipo }) {
    return (
        <>
            {(() => {
                if (tipo == "login") {

                    const [email, setEmail] = useState('');
                    const [senha, setSenha] = useState('');

                    const navigate = useNavigate();

                    function handleSubmit(event) {
                        event.preventDefault();

                        const bodyParam = {
                            email: email,
                            senha: senha
                        }

                        api.post('/login', bodyParam)
                            .then((response) => {
                                //console.log(response.data)
                                alert(" Token gerado para o usuario " + response.data.nome)
                                localStorage.setItem("token", response.data.token);
                                navigate("/");
                            })
                            .catch((err) => {
                                console.error(err.response.data) // Objeto de erro vindo do axios
                                alert(" Ocorreu um erro! " + err.response.data.msg)
                            })
                            .finally(() => {
                                setEmail("")
                                setSenha("")
                            })
                    }

                    return (
                        <div className="container">
                            <div className="row">
                                <div className="col-12 text-center my-4 text-muted">
                                    <h4>Login Cliente</h4>
                                </div>
                                <hr></hr>
                                <div className="col-lg-5 col-md-12"></div>
                                <div className="my-2 col-lg-2 col-md-12">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <input type="email" class="form-control text-center" id="email" placeholder="Email" onChange={(e) => { setEmail(e.target.value) }}></input>
                                        </div>
                                        <div className="mb-3">
                                            <input type="password" class="form-control text-center" id="pwd" placeholder="Senha" onChange={(e) => { setSenha(e.target.value) }}></input>
                                        </div>
                                        <div className="mb-3 text-center d-grid">
                                            <Link to="/cadastrar" className='btn btn-primary'>Cadastre-se aqui</Link>
                                        </div>
                                        <div className='mb-3 text-center d-grid'>
                                            <input type='submit' className='btn btn-success' value="Logar"></input>
                                        </div>
                                    </form>
                                </div>
                                <div className="col-lg-5 col-md-12"></div>
                            </div>
                        </div>
                    );
                }
                if (tipo == "cadastro") {
                    const [nome, setNome] = useState('');
                    const [telefone, setTelefone] = useState('');
                    const [endereco, setEnderecos] = useState('');
                    const [bancarios, setBancarios] = useState('');
                    const [cartao, setCartao] = useState('');
                    const [nomeCartao, setNomeCartao] = useState('');
                    const [cpf, setCpf] = useState('');
                    const [avatar, setAvatar] = useState('https://cdn-icons-png.flaticon.com/512/149/149071.png');
                    const [extensao, setExtensao] = useState('png');
                    const extensoes = ["jpg", "jpeg", "png", "bmp"];
                    const [email, setEmail] = useState('');
                    const [senha, setSenha] = useState('');



                    function handNomeChange(event) {
                        setNome(event.target.value);
                    }

                    const handleAvatar = async (e) => {
                        const file = e.target.files[0];
                        if (!(typeof e.target.files[0] === "undefined")) {
                            setExtensao(file["name"].split(".").pop());
                            const base64 = await convertToBase64(file);
                            setAvatar(base64);
                        } else {
                            setAvatar('https://cdn-icons-png.flaticon.com/512/149/149071.png');
                        }
                    }

                    //Putaria do matheus, poderia usar so o e.target.value no proprio onchange em muitas funcoes abaixo
                    function handNomeCartaoChange(event) {
                        setNomeCartao(event.target.value);
                    }

                    function handCpfChange(event) {
                        let cpfValue = event.target.value.replace(/\D/g, '');
                        cpfValue = cpfValue.slice(0, 11);
                        setCpf(cpfValue);
                    }

                    function handEmailChange(event) {
                        setEmail(event.target.value);
                    }

                    function handSenhaChange(event) {
                        setSenha(event.target.value);
                    }

                    function handTelefoneChange(event) {
                        let telefoneValue = event.target.value.replace(/\D/g, '');
                        telefoneValue = telefoneValue.slice(0, 13);
                        setTelefone(telefoneValue);
                    }

                    function handEnderecoChange(event) {
                        setEnderecos(event.target.value);
                    }

                    function handBancoChange(event) {
                        let cvcValue = event.target.value.replace(/\D/g, '');
                        cvcValue = cvcValue.slice(0, 3);
                        setBancarios(cvcValue);
                    }

                    function handCartaoChange(event) {
                        let cartaoValue = event.target.value.replace(/\D/g, '');
                        cartaoValue = cartaoValue.slice(0, 16);
                        setCartao(cartaoValue);
                    }

                    const convertToBase64 = (file) => {
                        return new Promise((res, rej) => {
                            const fileReader = new FileReader();
                            fileReader.readAsDataURL(file);
                            fileReader.onload = () => {
                                res(fileReader.result);
                            };
                            fileReader.onerror = (error) => {
                                rej(error);
                            };
                        });
                    };


                    async function handleSubmit(event) {
                        if (!email.includes('@')) {
                            alert('informe um email valido');
                            return;
                        }
                        if (extensoes.includes(extensao) !== true) {
                            alert("Arquivo no formato incorreto!\nExtensões permitidas: JPEG, JPG, PNG, BMP");
                            return;
                        }
                        if (nome.length < 1) {
                            alert('Informe o nome');
                            return;
                        }
                        if (endereco.length < 1) {
                            alert('Informe o endereço');
                            return;
                        }
                        if (cpf.length < 1) {
                            alert('Informe o cpf');
                            return;
                        }
                        if (email.length < 1) {
                            alert('Informe o email');
                            return;
                        }
                        if (senha.length < 1) {
                            alert('Informe a senha');
                            return;
                        }
                        if (cartao.length !== 16) {
                            alert('O número do cartão deve ter exatamente 20 dígitos.');
                            return;
                        }
                        if (bancarios.length !== 3) {
                            alert('O CVV deve ter pelo menos 3 digitos');
                            return;
                        }
                        event.preventDefault();

                        const bodyParam = {
                            foto: avatar,
                            nome: nome,
                            endereco: endereco,
                            telefone: telefone,
                            cpf: cpf,
                            cartao: {
                                nome: nomeCartao,
                                numero: cartao,
                                cvc: bancarios
                            },
                            email: email,
                            senha: senha
                        }
                
                        api.post('/cliente', bodyParam)
                            .then((response) => {
                                console.log(response.data)
                                alert(response.data.msg)
                            })
                            .catch((err) => {
                                console.error(err)
                                alert(" Ocorreu um erro! Veja no console ..")
                            })
                            .finally(() => {
                                setAvatar("https://cdn-icons-png.flaticon.com/512/149/149071.png");
                                setNome("");
                                setEnderecos("");
                                setTelefone("");
                                setCpf("");
                                setCartao("");
                                setNomeCartao("");
                                setBancarios("");
                                setEmail("");
                                setSenha("");
                            })
                        // enviar dados de cadastro para o servidor aqui
                    }

                    return (
                        <form onSubmit={handleSubmit}>
                            <div className='container text-center'>
                                <div className='row'>
                                    <div className='col-lg-1'></div>
                                    <div className='col-lg-4'>
                                        <h3>Dados Pessoais</h3>
                                        <div className='mb-3'>
                                            <input type="text" className='form-control text-center' value={nome} placeholder="Nome" onChange={handNomeChange} />
                                        </div>
                                        <div className='mb-3'>
                                            <input type="text" className='form-control text-center' value={endereco} placeholder="Endereço" onChange={handEnderecoChange} />
                                        </div>
                                        <div className='mb-3'>
                                            <input type="text" className='form-control text-center' value={telefone} placeholder="Telefone" onChange={handTelefoneChange} />
                                        </div>
                                        <div className='mb-3'>
                                            <input type="text" className='form-control text-center' value={cpf} placeholder="CPF" onChange={handCpfChange} />
                                        </div>
                                        <div className='mb-3'>
                                            <label For="avatar" className="form-label"><h3>Avatar</h3></label>
                                            <input type="file" className="form-control" id="avatar" accept="image/png,image/jpeg,image/jpg,image/bmp" onChange={(e) => handleAvatar(e)} />
                                        </div>
                                        <div className='mb-3'>
                                            <img className="foto rounded" src={avatar} alt="Foto" />
                                        </div>
                                    </div>
                                    <div className='col-lg-2'></div>
                                    <div className='col-lg-4'>
                                        <h3>Dados do Cartão</h3>
                                        <div className='mb-3'>
                                            <input type="text" className='form-control text-center' value={nomeCartao} placeholder="Nome do Cartão" onChange={handNomeCartaoChange} />
                                        </div>
                                        <div className='mb-3'>
                                            <input type="text" className='form-control text-center' value={cartao} placeholder="Número do Cartão" onChange={handCartaoChange} />
                                        </div>
                                        <div className='mb-3'>
                                            <input type="password" className='form-control text-center' value={bancarios} placeholder="CVV" onChange={handBancoChange} />
                                        </div>
                                        <div className='mb-3'>
                                            <h3>Login</h3>
                                            <input type="text" className='form-control text-center' value={email} placeholder="Email" onChange={handEmailChange} />
                                        </div>
                                        <div className='mb-3'>
                                            <input type="password" className='form-control text-center' value={senha} placeholder="Senha" onChange={handSenhaChange} />
                                        </div>
                                    </div>
                                    <div className='col-lg-1'></div>
                                    <div className='col-lg-4 col-md-3'></div>
                                    <div className='col-lg-4 col-md-6 text-center d-grid'>
                                        <button type="submit" className='btn btn-outline-primary'>Cadastrar</button>
                                    </div>
                                    <div className='col-lg-4 col-md-3'></div>
                                </div>
                            </div>
                        </form>
                    );
                }
            })()}
        </>
    );
}