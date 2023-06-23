import { useState } from 'react';
import './detalhes.css';

export default function Detalhes({ dados }) {

    console.log(dados)

    let produto = (
        [
            {
                codigo: dados._id,
                nome: dados.nome,
                preco: dados.preco,
                imagem: dados.imagem,
                descricao: dados.descricao,
                quantidade: 1
            }
        ]
    );

    function handleClick() {
// ----------------------------------------------------------------------------------------------------------
// -------------------     NAO MEXA POIS FUNCIONA NAO SEI COMO, AUTORIA MINHA -NATHAN     -------------------
// ----------------------------------------------------------------------------------------------------------
        let data = localStorage.getItem("carrinho");
        if (data) { //Verifica se tem algo no carrinho
            let storedCarrinho = JSON.parse(data);
            if(storedCarrinho.find(item => item.codigo == dados._id)){//Verifica se ja existe o produto no carrinho para add quantidade
                storedCarrinho.forEach(prod => {
                  if(prod.codigo == dados._id){
                    prod.quantidade++;
                  }  
                });
            }else{//Adiciona um novo produto caso nao exista o mesmo no carrinho
                storedCarrinho.push(
                    {
                        codigo: dados._id,
                        nome: dados.nome,
                        preco: dados.preco,
                        imagem: dados.imagem,
                        descricao: dados.descricao,
                        quantidade: 1
                    }
                );
            }
            localStorage.setItem("carrinho", JSON.stringify(storedCarrinho));

        } else {
            localStorage.setItem("carrinho", JSON.stringify(produto));
        }
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-4 text-center">
                    <img src={dados.imagem} className="img-fluid rounded shadow" alt={dados.nome}></img>
                </div>
                <div className="col-8 text-center">
                    <h3>{dados.nome}</h3>
                    <p>Categoria: {dados.categoria.nome}</p>
                    <p>Nota: {dados.nota} de 10</p>
                    <p>Total: R$ {dados.preco}</p>
                    <h6>Descrição:</h6>
                    <p className='sinopse m-auto mb-4'>{dados.descricao}</p>
                    <button className="btn btn-success" onClick={handleClick}>Adicionar ao carrinho</button>
                </div>
            </div>
        </div>
    );

}