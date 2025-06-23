*** Settings ***
Library    SeleniumLibrary
Resource    ../recursos/variaveis.robot
Resource    ../recursos/palavrasChaves.robot

*** Test Cases ***
Cenário 01: Excluir um quadro existente
    [Documentation]    Verifica se o usuário consegue excluir um quadro
    Dado que o usuário está na página inicial
    E tenha criado um quadro
    Quando clicar no botão de opções do quadro
    E selecionar a opção "Excluir"
    E confirmar a exclusão
    Então o quadro não deve mais aparecer na lista

*** Keywords ***
Quando clicar no botão de opções do quadro
    Click Element    xpath=//button[@class='board-settings-btn'and contains(.,'⋯')]
E selecionar a opção "Excluir"
    Click Button    xpath=//button[contains(.,'Excluir')]
E confirmar a exclusão
    Click Button    xpath=//button[contains(.,'Confirmar')]
Então o quadro não deve mais aparecer na lista
    Element Should Not Be Visible    xpath=//span[@class='sidebar-text'][contains(.,'Quadro de Teste')]
    Fechar Navegador 