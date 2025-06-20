*** Settings ***
Library    SeleniumLibrary
Resource    recursos/variaveis.robot
Resource    recursos/palavrasChaves.robot

*** Test Cases ***
Cenário 01: Cadastro de um novo usuário
    [Documentation]    Verifica se o usuário consegue se cadastrar com sucesso
    Dado que o usuário não está cadastrado no sistema e acessa a tela de cadastro
    E inserir os dados de nome válido "Maria"
    E inserir os dados de email válido "teste@gmail.com"
    E inserir os dados de senha válida "Te123@"
    Quando clicar o botão de “Criar Conta”
    Então o usuário deve ser registrado no sistema e aparecer a mensagem de sucesso "Usuário cadastrado com sucesso!"
    E deve ser redirecionado para a pagina de Login


*** Keywords ***
#Cenário 01: Cadastro de um novo usuário
Dado que o usuário não está cadastrado no sistema e acessa a tela de cadastro
    Delay de Execucção de teste
    Abrir Navegador
    Clicar no Link "Criar Conta"

E inserir os dados de nome válido "Maria"
    Input Text    ${Campo_Nome}    Maria

E inserir os dados de email válido "teste@gmail.com"
    Input Text    ${Campo_Email}    teste@gmail.com

E inserir os dados de senha válida "Te123@"
    Input Text    ${Campo_Senha}    Te123@

Quando clicar o botão de “Criar Conta”
    Clicar no Botão "Criar Conta"
Então o usuário deve ser registrado no sistema e aparecer a mensagem de sucesso "Usuário cadastrado com sucesso!"
    Element Should Contain    xpath=//div[contains(@class,'alert-success')]    Usuário cadastrado com sucesso!
E deve ser redirecionado para a pagina de Login
    Location Should Contain    ${Url}



