***Settings***
Library    SeleniumLibrary
Resource    variaveis.robot

***Keywords***
Delay de Execucção de teste
    Set Selenium Speed    1.5s

Abrir Navegador
    Open Browser    ${Url}    ${Browser}
    Maximize Browser Window

Clicar no Link "Criar Conta"
    Click Link    ${Link_CriarConta}
    
Clicar no Botão "Criar Conta"
    Click Button    ${Botao_CriarConta}
Fechar Navegador
    Close Browser
