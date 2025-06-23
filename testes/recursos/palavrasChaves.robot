***Settings***
Library    SeleniumLibrary
Resource    variaveis.robot

***Keywords***
Delay de Execução de teste
    Set Selenium Speed    0.75s

Abrir Navegador
    Open Browser    ${Url}    ${Browser}    
    Maximize Browser Window

Fazer Login
    Input Text    ${Campo_Email}    mar@email.com
    Input Text    ${Campo_Senha}    12
    Click Button    ${Botao_Entrar}

Abrir Página Inicial
    Open Browser    ${Url_Home}    ${Browser}
    Maximize Browser Window

Clicar no Link "Criar Conta"
    Click Link    ${Link_CriarConta}

Clicar no Botão "Criar Conta"
    Click Button    ${Botao_CriarConta}

Verificar se Quadro foi criado
    Element Should Be Visible    xpath=//span[@class='sidebar-text'][contains(., 'Quadro de Teste')]

Fechar Navegador
    Close Browser
