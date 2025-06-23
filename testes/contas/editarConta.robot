*** Settings ***
Library    SeleniumLibrary
Resource    ../recursos/variaveis.robot
Resource    ../recursos/palavrasChaves.robot

*** Test Cases ***
Cenário 01: Editar dados do usuário
    Dado que o usuário está na página inicial
    E faz login
    E clica no menu lateral "Perfil"
    Quando alterar o nome para "Robot Editado"
    E salvar as alterações
    Então deve aparecer a mensagem de sucesso "Dados atualizados com sucesso!"

*** Keywords ***
Dado que o usuário está na página inicial
    Abrir Navegador
    Go To    ${Url}

E faz login
    Fazer Login

E clica no menu lateral "Perfil"
    Click Element    //*[@id="root"]/div/div/div/div/aside/nav/div[3]/ul/li[contains(.,'Perfil')]

Quando alterar o nome para "Robot Editado"
    Input Text    ${Campo_Nome}    Robot Editado
E salvar as alterações
    Click Button    xpath=//button[contains(.,'Salvar')]
Então deve aparecer a mensagem de sucesso "Dados atualizados com sucesso!"
    Element Should Contain    xpath=//div[contains(@class,'alert-success')]    Dados atualizados com sucesso! 