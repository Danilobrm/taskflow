*** Settings ***
Library    SeleniumLibrary
Resource    palavrasChaves.robot

*** Variables ***
${Url}    http://localhost:3000
${Browser}    Chrome
${Link_CriarConta}    xpath=//a[contains(.,'Crie sua conta')]
${Campo_Nome}    xpath=//input[contains(@placeholder,'Digite seu nome')]
${Campo_Email}    xpath=//input[contains(@placeholder,'Digite seu email')]
${Campo_Senha}    xpath=//input[contains(@placeholder,'Digite seu email')]
${Botao_CriarConta}    xpath=//button[contains(@type,'submit')]