*** Settings ***
Library    SeleniumLibrary
Resource    ../recursos/variaveis.robot
Resource    ../recursos/palavrasChaves.robot

*** Test Cases ***
Cenário 01: Criar uma nova tarefa
    Dado que o usuário está na página inicial
    E faz login
    E clica no menu lateral "Tarefas"
    Quando preenche os campos obrigatórios corretamente
    E clica no botão "Criar Tarefa"
    Então a tarefa é registrada com status "Pendente"

*** Keywords ***
Dado que o usuário está na página inicial
    Abrir Navegador
    Go To    ${Url}

E faz login
    Fazer Login

E clica no menu lateral "Tarefas"
    Click Element    xpath=//li[contains(.,'Tarefas')]

Quando preenche os campos obrigatórios corretamente
    Input Text    xpath=//input[@placeholder='Título da tarefa']    Nova Tarefa
    Input Text    xpath=//textarea[@placeholder='Descrição']    Descrição da tarefa

E clica no botão "Criar Tarefa"
    Click Button    xpath=//button[contains(.,'Criar Tarefa')]

Então a tarefa é registrada com status "Pendente"
    Element Should Contain    xpath=//div[contains(@class,'task-card')]    Pendente
