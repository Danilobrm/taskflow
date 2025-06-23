*** Settings ***
Library    SeleniumLibrary
Resource    ../recursos/variaveis.robot
Resource    ../recursos/palavrasChaves.robot

*** Test Cases ***
Cenário 01: Excluir uma tarefa existente
    Dado que o usuário está na página inicial
    E faz login
    E clica no menu lateral "Tarefas"
    E cria uma tarefa para exclusão
    Quando clica no botão de excluir tarefa
    E confirma a exclusão
    Então a tarefa não deve mais aparecer na lista

*** Keywords ***
Dado que o usuário está na página inicial
    Abrir Navegador
    Go To    ${Url}

E faz login
    Fazer Login

E clica no menu lateral "Tarefas"
    Click Element    xpath=//li[contains(.,'Tarefas')]

E cria uma tarefa para exclusão
    Input Text    xpath=//input[@placeholder='Título da tarefa']    Tarefa para Excluir
    Input Text    xpath=//textarea[@placeholder='Descrição']    Descrição para excluir
    Click Button    xpath=//button[contains(.,'Criar Tarefa')]

Quando clica no botão de excluir tarefa
    Click Button    xpath=//button[contains(.,'Excluir')]

E confirma a exclusão
    Click Button    xpath=//button[contains(.,'Confirmar')]

Então a tarefa não deve mais aparecer na lista
    Element Should Not Be Visible    xpath=//div[contains(@class,'task-card') and contains(.,'Tarefa para Excluir')] 