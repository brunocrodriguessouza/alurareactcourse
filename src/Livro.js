import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import BotaoSubmitCustomizado from './componentes/BotaoSubmitCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

class FormularioLivro extends Component {

    constructor() {

        super();
        this.state = { titulo:'', preco:'', autorId:''};
        this.enviarForm = this.enviarForm.bind(this);
        this.setTitulo = this.setTitulo.bind(this);
        this.setPreco = this.setPreco.bind(this);
        this.setAutorId = this.setAutorId.bind(this);
      }

    enviarForm(e) {

        e.preventDefault();
        var titulo = this.state.titulo.trim();
        var preco = this.state.preco.trim();
        var autorId = this.state.autorId;
        
        $.ajax({
        url:'https://cdc-react.herokuapp.com/api/livros',
        contentType: 'application/json',
        dataType:'json',
        type:'post',
        data: JSON.stringify({titulo:titulo, preco:preco, autorId:autorId}),
        success: function(novaListagem){
            PubSub.publish('atualizar-lista-livros',novaListagem);
            this.setState({titulo:'',preco:'', autorId:''})
        }.bind(this),
        error: function(resposta) {
            if (resposta.status === 400) {
                new TratadorErros().publicarErros(resposta.responseJSON);
            }
        },beforeSend: function() {
            
        }
        });
        this.setState({titulo: '', preco: '', autorId: ''});
    }

    setTitulo(e) {

        this.setState({titulo:e.target.value});
    }

    setPreco(e) {

        this.setState({preco:e.target.value});
    }

    setAutorId(e) {

        this.setState({autorId:e.target.value});
    }

    render() {
        var autores = this.props.autores.map(function(autor){
            return <option key={autor.id} value={autor.id}>{autor.nome}</option>;
          });
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviarForm.bind(this)} method="post">
                <InputCustomizado id="titulo" type="text" name="titulo" value={this.state.titulo} onChange={this.setTitulo} label="Titulo"/>                                              
                <InputCustomizado id="preco" type="text" name="preco" value={this.state.preco} onChange={this.setPreco} label="Preco"/>                                              
                <div className="pure-control-group">
                    <label htmlFor="autorId">Autor</label>
                    <select value={this.state.autorId} name="autorId" onChange={this.setAutorId}>
                        <option value="">Selecione autor</option>
                        {autores}
                    </select>
                </div>
                <BotaoSubmitCustomizado label="Gravar"/>
                </form>             
            </div> 
        );
    }

}

class TabelaLivros extends Component {

    constructor() {

        super();
        this.state = { lista : []};
    }

    componentWillMount() {
    
        $.ajax({
          url:'https://cdc-react.herokuapp.com/api/livros',
          dataType: 'json',
          success:function(resposta){
            this.setState({lista:resposta});
          }.bind(this)
        });

        PubSub.subscribe('atualizar-lista-livros', function(topico,novaLista){
            this.setState({lista:novaLista});
        }.bind(this));
      }

    render() {
        return (

            <div>            
            <table className="pure-table">
              <thead>
              <tr>
                <th>Titulo</th>
                <th>preço</th>
                <th>Autor</th>
              </tr>
              </thead>
              <tbody>
                {
                  this.props.lista.map(function(livro){
                    return (
                      <tr  key={livro.id}>
                        <td>{livro.titulo}</td>
                        <td>{livro.preco}</td>
                        <td>{livro.autor.nome}</td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table> 
          </div> 
        );
    }
}

export default class LivroBox extends Component {

    constructor() {
        super();
        this.state = {lista : [],autores:[]};
    }

    componentDidMount() {
        $.ajax({
          url: "https://cdc-react.herokuapp.com/api/livros",
          dataType: 'json',
          success: function(data) {
            this.setState({lista: data});
          }.bind(this)
        });
        
        $.ajax({
          url: "https://cdc-react.herokuapp.com/api/autores",
          dataType: 'json',
          success: function(data) {
            this.setState({autores: data});
          }.bind(this)
        });
    
        PubSub.subscribe('atualizar-lista-livros', function(topicName,lista){
          this.setState({lista:lista});
        }.bind(this));    
    }

    render(){
      return (
        <div>
            <div className="header">
            <h1>Cadastro de livros</h1>
            </div>
            <div className="content" id="content">
                <FormularioLivro autores={this.state.autores}/>
                <TabelaLivros lista={this.state.lista}/>
            </div>
        </div>
      );
    }   
  }