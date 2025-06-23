*** Settings ***
Library    SeleniumLibrary
Resource    ../recursos/variaveis.robot
Resource    ../recursos/palavrasChaves.robot

*** Test Cases ***
Cenário 01: Login com sucesso
    [Documentation]    Verifica se o usuário consegue fazer login com sucesso
    Dado que o usuário está na tela de login
    Quando inserir email válido "teste@gmail.com"
    E inserir senha válida "Te123@"
    E clicar no botão de login
    Então o usuário deve ser redirecionado para a página inicial
    E deve aparecer a mensagem de boas-vindas

Cenário 02: Login com senha incorreta
    [Documentation]    Verifica se o sistema exibe mensagem de erro ao tentar login com senha incorreta
    Dado que o usuário está na tela de login
    Quando inserir email válido "teste@gmail.com"
    E inserir senha inválida "errada"
    E clicar no botão de login
    Então deve aparecer a mensagem de erro "Email ou senha inválidos"

*** Keywords ***
Dado que o usuário está na tela de login
    Abrir Navegador
Quando inserir email válido "teste@gmail.com"
    Input Text    ${Campo_Email}    teste@gmail.com
E inserir senha válida "Te123@"
    Input Text    ${Campo_Senha}    Te123@
E clicar no botão de login
    Click Button    ${Botao_Entrar}
Então o usuário deve ser redirecionado para a página inicial
    Location Should Contain    /home
E deve aparecer a mensagem de boas-vindas
    Element Should Contain    xpath=//div[contains(@class,'welcome-message')]    Bem-vindo
E inserir senha inválida "errada"
    Input Text    ${Campo_Senha}    errada
Então deve aparecer a mensagem de erro "Email ou senha inválidos"
    Element Should Contain    xpath=//div[contains(@class,'alert-danger')]    Email ou senha inválidos 