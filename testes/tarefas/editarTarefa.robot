*** Settings ***
Library    SeleniumLibrary
Resource    ../recursos/variaveis.robot
Resource    ../recursos/palavrasChaves.robot

*** Test Cases ***
Cenário 01: Editar uma tarefa existente
    Dado que o usuário está na página inicial
    E faz login
    E clica no menu lateral "Tarefas"
    E cria uma tarefa para edição
    Quando altera o título da tarefa para "Tarefa Editada"
    E salva as alterações
    Então a tarefa deve ser atualizada com o novo título

*** Keywords ***
Dado que o usuário está na página inicial
    Abrir Navegador
    Go To    ${Url}

E faz login
    Fazer Login

E clica no menu lateral "Tarefas"
    Click Element    xpath=//li[contains(.,'Tarefas')]

E cria uma tarefa para edição
    Input Text    xpath=//input[@placeholder='Título da tarefa']    Tarefa para Editar
    Input Text    xpath=//textarea[@placeholder='Descrição']    Descrição para editar
    Click Button    xpath=//button[contains(.,'Criar Tarefa')]

Quando altera o título da tarefa para "Tarefa Editada"
    Input Text    xpath=//input[@placeholder='Título da tarefa']    Tarefa Editada

E salva as alterações
    Click Button    xpath=//button[contains(.,'Salvar')]

Então a tarefa deve ser atualizada com o novo título
    Element Should Contain    xpath=//div[contains(@class,'task-card')]    Tarefa Editada 