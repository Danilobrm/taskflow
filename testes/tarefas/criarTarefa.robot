*** Settings ***
Library    SeleniumLibrary
Resource    ../recursos/variaveis.robot
Resource    ../recursos/palavrasChaves.robot

*** Test Cases ***
Cenário 01: Criar uma nova tarefa
    [Documentation]    Verifica se o usuário consegue criar uma nova tarefa com sucesso
    Dado que estou na tela de tarefa
    Quando preencho os campos obrigatórios corretamente
    Então a tarefa é registrada com status "Pendente"
*** Keywords ***
