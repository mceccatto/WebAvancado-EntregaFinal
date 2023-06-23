import Card from '../components/Card';
import Menu from '../components/Menu/index';
import Titulo from '../components/Titulo';
import { useState, useEffect } from 'react';

export default function Home() {

    const [filtro, setFiltro] = useState('nome');
    const [nome, setNome] = useState('');
    const [data, setData] = useState('');

    useEffect(() => {
        fetch('http://localhost:8080/produto')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(err => console.error(err))
    }, []);

    //console.log(data);

    return (
        <div className='pb-5'>
            <Menu menu='home-produto' />
            <Titulo title="Produtos" text="Lista de produtos disponiveis" />
            <div className='rounded shadow container'>
                <div className='row'>
                    <div className='container'>
                        <div className='row my-3'>
                            <div className='col-4'></div>
                            <div className='col-4'>
                                <input type='text' className='form-control text-center' placeholder='Pesquisar produto' onChange={e => setNome(e.target.value)}></input>
                            </div>
                            <div className='col-2'></div>
                            <div className='col-2'>
                                <select className='form-select' onChange={e => setFiltro(e.target.value)}>
                                    <option selected value="nome">Nome</option>
                                    <option value="preco-ma">Preco Maior</option>
                                    <option value="preco-me">Preco Menor</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <hr></hr>
                    {(() => {
                        if (!data) {
                            return (
                                <div className="text-center my-2 col-12">
                                    <h4>Carregando...</h4>
                                </div>
                            );
                        }if(data.msg){ //Caso nao tenha nenhum produto cadastrado
                            return (
                                <div className="text-center my-2 col-12">
                                    <h4>{data.msg}</h4>
                                </div>
                            );
                        } else {
                            //console.log(data);
                            return (
                                data.map((item) => ( //Basicamente um FOR de matriz, le as categorias no json e pega os produtos de cada categoria
                                    <>
                                        {(() => {
                                            if (item.produtos.length > 0) {
                                                return (<Titulo tipo="categoria" title={item.categoria} />);
                                            }
                                        })()}
                                        {(() => {
                                            if (filtro == "nome") {
                                                return (
                                                    item.produtos.filter((produtosF) => { return produtosF.nome.toLowerCase().includes(nome.toLowerCase()) }).sort((a, b) => a.nome > b.nome ? 1 : -1).map((result, index) => (
                                                        <Card tipo="home" dados={result} />
                                                    ))
                                                );
                                            }
                                            if (filtro == "preco-ma") {
                                                return (
                                                    item.produtos.filter((produtosF) => { return produtosF.nome.toLowerCase().includes(nome.toLowerCase()) }).sort((a, b) => a.preco > b.preco ? -1 : 1).map((result, index) => (
                                                        <Card tipo="home" dados={result} />
                                                    ))
                                                );
                                            }
                                            if (filtro == "preco-me") {
                                                return (
                                                    item.produtos.filter((produtosF) => { return produtosF.nome.toLowerCase().includes(nome.toLowerCase()) }).sort((a, b) => a.preco > b.preco ? 1 : -1).map((result, index) => (
                                                        <Card tipo="home" dados={result} />
                                                    ))
                                                );
                                            }
                                        })()}
                                    </>
                                ))
                            );
                        }
                    })()}
                </div>
            </div>
        </div>
    );
}