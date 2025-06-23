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
    Delay de Execução de teste
    Abrir Navegador
    Fazer Login
E tenha criado um quadro
    Element Should Contain    xpath=(//span[@class='sidebar-text'][contains(.,'Quadro de Teste')])[1]   Quadro de Teste
E clique no botão de opções do quadro
    Click Element    xpath=//button[@class='board-settings-btn'and contains(.,'⋯')]

E selecione a opção "Editar"
    Click Button    ${Botão_EditarQuadro}

E altere as informações desejadas
    Input Text    ${Campo_Quadro}    Quadro de Testes 2

Quando clicar no botão "Salvar"
    Click Button    ${Botao_SalvarEdiQuadro}

Então o sistema deve salvar as alterações e redirecionar para a página inicial
    Element Should Contain    xpath=(//span[@class='sidebar-text'][contains(.,'Quadro de Teste')])[1]    Quadro de Testes 2
    Fechar Navegador