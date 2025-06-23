*** Settings ***
Library    SeleniumLibrary
Resource    ../recursos/variaveis.robot
Resource    ../recursos/palavrasChaves.robot

*** Test Cases ***
Cenário 01: Alterar senha do usuário
    Dado que o usuário está na página inicial
    E faz login
    E clica no menu lateral "Perfil"
    Quando informar a senha atual "Robot123"
    E informar a nova senha "SenhaSuper@789"
    E confirmar a nova senha "SenhaSuper@789"
    E salvar a alteração
    Então deve aparecer a mensagem de sucesso "Senha alterada com sucesso!"

*** Keywords ***
Dado que o usuário está na página inicial
    Abrir Navegador
    Go To    ${Url}

E faz login
    Fazer Login

E clica no menu lateral "Perfil"
    Click Element    //*[@id="root"]/div/div/div/div/aside/nav/div[3]/ul/li[contains(.,'Perfil')]

Quando informar a senha atual "Robot123"
    Input Text    xpath=//input[@placeholder='Senha atual']    Robot123
E informar a nova senha "SenhaSuper@789"
    Input Text    xpath=//input[@placeholder='Nova senha']    SenhaSuper@789
E confirmar a nova senha "SenhaSuper@789"
    Input Text    xpath=//input[@placeholder='Confirmar nova senha']    SenhaSuper@789
E salvar a alteração
    Click Button    xpath=//button[contains(.,'Salvar')]
Então deve aparecer a mensagem de sucesso "Senha alterada com sucesso!"
    Element Should Contain    xpath=//div[contains(@class,'alert-success')]    Senha alterada com sucesso! 