*** Settings ***
Library    SeleniumLibrary
Resource    ../recursos/variaveis.robot
Resource    ../recursos/palavrasChaves.robot

*** Test Cases ***
Cenário 01: Cadastro de um novo usuário
    Dado que o usuário está na tela de login
    E clica no link "Crie sua conta"
    E inserir os dados de nome válido "Robot"
    E inserir os dados de email válido "robot@email.com"
    E inserir os dados de senha válida "Robot123"
    Quando clicar o botão de “Criar Conta”
    Então o usuário deve ser registrado no sistema e aparecer a mensagem de sucesso "Usuário cadastrado com sucesso!"
    E deve ser redirecionado para a pagina de Login

*** Keywords ***
Dado que o usuário está na tela de login
    Abrir Navegador
    Go To    ${Url}

E clica no link "Crie sua conta"
    Click Element    xpath=//a[contains(.,'Crie sua conta')]

E inserir os dados de nome válido "Robot"
    Input Text    ${Campo_Nome}    Robot

E inserir os dados de email válido "robot@email.com"
    Input Text    ${Campo_Email}    robot@email.com

E inserir os dados de senha válida "Robot123"
    Input Text    ${Campo_Senha}    Robot123

Quando clicar o botão de “Criar Conta”
    Clicar no Botão "Criar Conta"
Então o usuário deve ser registrado no sistema e aparecer a mensagem de sucesso "Usuário cadastrado com sucesso!"
    Element Should Contain    xpath=//div[contains(@class,'alert-success')]    Usuário cadastrado com sucesso!
E deve ser redirecionado para a pagina de Login
    Location Should Contain    ${Url}



