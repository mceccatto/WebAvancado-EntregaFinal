import Menu from "../components/Menu";
import Titulo from "../components/Titulo";
import Card from "../components/Card";
import jwt from 'jwt-decode';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from '../services/api';

export default function Carrinho() {

    const [endereco, setEndereco] = useState('');
    const [cartao, setCartao] = useState('');
    const [data, setData] = useState({});
    const storedToken = localStorage.getItem("token");

    const dataProd = localStorage.getItem("carrinho");
    let carrinho = [];

    let value = 0;
    if (dataProd) {
        carrinho = JSON.parse(dataProd);
        carrinho.forEach(prod => {
            value += prod.preco * prod.quantidade;
        });
    }

    useEffect(() => {
        if (storedToken) {
            setData(jwt(storedToken));
        }
        setEndereco(data.endereco);
        setCartao(data.cartao);
    }, [endereco, cartao])

    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();

        if (storedToken) {
            try {
                const data = jwt(storedToken)
                //console.log(data)
                if (dataProd) {
                    const listaProdutos = JSON.parse(dataProd);
                    let bodyParam = {
                        custo: value.toFixed(2),
                        produtos: [],
                        cliente: data._id
                    }
                    listaProdutos.forEach(prod => { //Carregando produtos do carrinho para o json
                        bodyParam.produtos.push({
                            produto:prod.codigo,
                            quantidade:prod.quantidade
                        });
                    });
                    //console.log(bodyParam);
                    api.post('/pedido', bodyParam, {headers: {Authorization: 'Bearer '+storedToken}})
                        .then((response) => {
                            //console.log(response.data)
                            alert(response.data.msg)
                        })
                        .catch((err) => {
                            console.error(err)
                            alert(" Ocorreu um erro! Veja no console ..")
                        })
                    alert("Compra efetuada com sucesso para o cliente codigo: " + data.codigo + ".")
                } else {
                    alert("Carrinho vazio")
                }
            } catch (error) {
                console.log(error)
            }
        } else {
            alert('Usuario não autenticado! Por favor fazer o login!')
            navigate("/logar");
        }
    }

    function handleClick() {
        localStorage.removeItem("carrinho");
        navigate("/carrinho");
    }

    return (
        <>
            <Menu menu='checkout' />
            <Titulo title='Carrinho' text='Lista de produtos selecionados.' />
            <div className="container pb-5">
                <div className="row">
                    <div className="col-lg-6 col-sm-12">
                        <h5>Produtos selecionados:</h5>
                        {carrinho.map((produto) => (
                            <Card dados={produto} tipo="checkout" />
                        ))}
                        <div className="text-center">
                            <h6>Total: R$ {value.toFixed(2)}</h6>
                        </div>
                    </div>
                    <div className="col-lg-6 col-sm-12">
                        <h5>Endereço para entrega:</h5>
                        <p className="text-muted">{endereco}</p>
                        <h5>Cartao para compra:</h5>
                        <p className="text-muted">{cartao}</p>
                        {(() => {
                            if (dataProd) {
                                return (
                                    <div>
                                        <button className="btn btn-outline-danger" onClick={handleClick}>Esvaziar carrinho</button>
                                    </div>
                                );
                            }
                        })()}
                    </div>
                    <div className="col-12"><hr></hr></div>
                    <div className="col-lg-4 col-12"></div>
                    <div className="col-lg-4 col-12 text-center">
                        <form onSubmit={handleSubmit}>
                            <button className="btn btn-success" type='submit'>Finalizar compra</button>
                        </form>
                    </div>
                    <div className="col-lg-4 col-12"></div>
                </div>
            </div>
        </>
    );
}