***Settings***
Library    SeleniumLibrary
Resource    variaveis.robot

***Keywords***
Delay de Execução de teste
    Set Selenium Speed    1.5s

Abrir Navegador
    Open Browser    ${Url}    ${Browser}
    Maximize Browser Window

Fazer Login
    Input Text    ${Campo_Email}    pedro01@email.com
    Input Text    ${Campo_Senha}    123456
    Click Button    xpath=//button[contains(@type,'submit')]

Abrir Página Inicial
    Open Browser    ${Url_Home}    ${Browser}
    Maximize Browser Window

Clicar no Link "Criar Conta"
    Click Link    ${Link_CriarConta}

Clicar no Botão "Criar Conta"
    Click Button    ${Botao_CriarConta}

Fechar Navegador
    Close Browser
