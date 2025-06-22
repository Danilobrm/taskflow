*** Settings ***
Library    SeleniumLibrary
Resource    ../recursos/variaveis.robot
Resource    ../recursos/palavrasChaves.robot

*** Test Cases ***
Cenário 01: Criar Quadros para tarefa
    Dado que estou na página inicial do sistema
    E clico no botão "Criar Quadro"
    Quando dou um nome para o quadro
    E clico no botão "Criar"
    Então o quadro é criado com sucesso
    
*** Keywords ***
Dado que estou na página inicial do sistema
    Delay de Execução de teste
    Abrir Navegador
    Fazer Login
E clico no botão "Criar Quadro"
    Click Button    ${Botao_CriarQuadro}
Quando dou um nome para o quadro
    Input Text    ${Campo_Quadro}    Quadro de Teste

E clico no botão "Criar"
    Click Button    ${Botao_Criar}

Então o quadro é criado com sucesso
    Element Should Contain    xpath=//span[contains(@class,'sidebar-text')]    Quadro de Teste
    Fechar Navegador
