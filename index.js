import inquirer from 'inquirer'
import chalk from 'chalk'
import fs from 'fs'
import prompt from 'prompt-sync'

Operation()

function Operation(){

    inquirer
    .prompt([
        {
            type: 'list',
            name: 'action',
            message: 'O que deseja fazer?',
            choices: [
                "Exibir lista",
                "Criar Lista",
                "Adicionar regra CSS",
                "Remover regra CSS",
                "Sair"
            ]
        }
    ])
    .then((resposta) => {
        const action = resposta['action']

        if(action == "Exibir lista"){
            showList()
        }else if(action == "Criar Lista"){
            questionCreate()
        }else if(action == "Adicionar regra CSS"){
            addRule()
        }else if(action == "Remover regra CSS"){
            removeRule()
        }else if(action == "Sair"){
            console.log('Saindo...')
        }
    })
}

function questionCreate(){

    inquirer
    .prompt([
        {
            name: 'criarLista',
            message:'Você quer criar uma lista ?'
        }
    ])
    .then((answer) => {
        const resposta = answer['criarLista']

        if(resposta == 'sim'){
            createList()
            Operation()
        }else if(resposta == 'não'){
            console.log('Encerrando...')
        }

    })
}

const command = prompt()

const addRule = (propCss) => {
    
    const listaed = getList()

    let listavelha = listaed.list
    let lista = []
    for (let cot = 0; cot < listavelha.length; cot++) {
    lista.push(`"${listavelha[cot]}"`)
    }


    while (propCss != 'sair'){
        propCss = command("Insira uma propriedade CSS ou 'sair' para Encerrar:").toLocaleLowerCase()
        if(lista.indexOf(`"${propCss}"`) == -1 && propCss != 'sair'){
            lista.push(`"${propCss}"`)
        }else if(propCss == 'sair'){
            console.log('saindo')
        }else if(lista.indexOf(`"${propCss}"`) != -1){
            console.log('ja existe')
        }
    }
    let result = lista.sort().join('\n')
    console.log(result)
    createList(lista)
}

function checkList() {
    if (!fs.existsSync('listaCSS.json')) {
      return false
    }
    return true
  }

function createList(lista){
    console.log(lista)

    if(fs.existsSync('listaCSS')){
        return addRule()
    }else if(!fs.existsSync('listaCSS')){

        fs.writeFileSync(
            `listaCSS.json`,
            `{"list":[${lista}]}`,
            function(err){
                console.log(err)
            }
        )
    }
    Operation()
}

function getList() {
    const accountJSON = fs.readFileSync(`listaCSS.json`, {
      encoding: 'utf8',
      flag: 'r',
    })
  
    return JSON.parse(accountJSON)
  }

function showList(){

    if(!checkList()){
        console.log(chalk.bgRed.black('Lista não existente!')),
        function(err){
            console.log(err)
        }
    }

    const listData = getList()
    console.log(`Essa é sua lista: `,chalk.bgWhite.blue(`[${listData.list}]`))
}

const removeRule = (removeProp) => {

    const listaed = getList()

    let listavelha = listaed.list
    let lista = []
    for (let cot = 0; cot < listavelha.length; cot++) {
    lista.push(`"${listavelha[cot]}"`)
    }
    
    while (removeProp != "sair") {
        removeProp = command("Insira uma propriedade CSS ou 'sair' para Encerrar:").toLocaleLowerCase()
        if (lista.indexOf(`"${removeProp}"`) == -1 && removeProp != 'sair') {
            console.log(chalk.bgYellow('Não existe esse elemento na lista'))
        } else if (removeProp == 'sair') {
            console.log(chalk.yellow('Finalizando ...'))
        } else if (lista.indexOf(`"${removeProp}"`) != -1) {
            lista.splice(lista.indexOf(`"${removeProp}"`), 1)
            console.log(chalk.bgGreenBright.black(`A propriedade ${removeProp} foi removida da lista`))
        }
    }
    let result = lista.sort().join("\n")
    console.log(chalk.bgCyanBright(result))
    createList(lista)
}