*** Settings ***
Library    SeleniumLibrary
Resource    palavrasChaves.robot

*** Variables ***
${Url}    http://localhost:3000
${Url_Home}    http://localhost:3000/home
${Browser}    Chrome
${Link_CriarConta}    xpath=//a[contains(.,'Crie sua conta')]
${Campo_Nome}    xpath=//input[contains(@placeholder,'Digite seu nome')]
${Campo_Email}    xpath=//input[contains(@placeholder,'Digite seu email')]
${Campo_Senha}    xpath=//input[contains(@placeholder,'Digite sua senha')]
${Campo_Quadro}    xpath=//input[contains(@placeholder,'Nome do quadro')]
${Botao_Entrar}    xpath=//button[@type='submit'and contains(.,'Entrar')]
${Botao_CriarConta}    xpath=//button[contains(@type,'submit')]
${CriarQuadro}    id:criarQuadro
${Botao_Criar}    xpath=//button[contains(.,'Criar')]
${Botão_EditarQuadro}    xpath=//button[@type='button'and contains(.,'Editar')]
${Botao_SalvarEdiQuadro}    xpath=//button[@type='submit'and contains(.,'Salvar')]

