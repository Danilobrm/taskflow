*** Settings ***
Library    SeleniumLibrary
Resource    ../recursos/variaveis.robot
Resource    ../recursos/palavrasChaves.robot

*** Test Cases ***
Cenário 01: Editar um Quadro Existente
    Dado que o usuário esteja na página inicial
    E tenha criado um quadro
    E clique no botão de opções do quadro
    E selecione a opção "Editar"
    E altere as informações desejadas
    Quando clicar no botão "Salvar"
    Então o sistema deve salvar as alterações e redirecionar para a página inicial

*** Keywords ***
Dado que o usuário esteja na página inicial
    Abrir Navegador
    Fazer Login
E tenha criado um quadro
    Verificar se Quadro foi criado
E clique no botão de opções do quadro
    Click Element    xpath=//button[@class='board-settings-btn'and contains(.,'⋯')]

E selecione a opção "Editar"
    Click Button    ${Botão_EditarQuadro}

E altere as informações desejadas
    Input Text    ${Campo_Quadro}    Quadro de Testes 2

Quando clicar no botão "Salvar"
    Click Button    ${Botao_SalvarEdiQuadro}

Então o sistema deve salvar as alterações e redirecionar para a página inicial
    Element Should Contain    xpath=//div[@class='board-item-content'and contains(.,'📋Quadro de Testes 2')]    Quadro de Testes 2
    Fechar Navegador