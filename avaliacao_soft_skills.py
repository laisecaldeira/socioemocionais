import streamlit as st
import pandas as pd
import os
import datetime
import plotly.express as px

# Nome do arquivo CSV onde os dados serão armazenados
HISTORICO_FILE = "historico_avaliacoes.csv"

# Criar sessão para armazenar estado da tela e login do usuário
if "tela_login" not in st.session_state:
    st.session_state.tela_login = False
if "usuario_logado" not in st.session_state:
    st.session_state.usuario_logado = None  # Armazena o e-mail do usuário logado

# Função para salvar os dados no CSV
def salvar_respostas(dados):
    dados["Data"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    if not os.path.exists(HISTORICO_FILE):
        df = pd.DataFrame(columns=list(dados.keys()))  # Cria um CSV com colunas ordenadas
    else:
        try:
            df = pd.read_csv(HISTORICO_FILE)
        except Exception as e:
            st.error(f"Erro ao ler o arquivo CSV: {e}")
            return
    
    novo_dado = pd.DataFrame([dados])
    df = pd.concat([df, novo_dado], ignore_index=True)

    # Corrigindo possíveis inconsistências de colunas
    df = df[list(dados.keys())]
    
    df.to_csv(HISTORICO_FILE, index=False)


# Configuração da página
st.set_page_config(page_title="Avaliação Socioemocional SENAI", layout="wide")

# Header com botão de acesso
col1, col2 = st.columns([8, 2])
with col2:
    if not st.session_state.usuario_logado:
        if st.button("🔐 Acessar Área Restrita"):
            st.session_state.tela_login = True

# 🔒 **TELA DE LOGIN**
if st.session_state.tela_login and not st.session_state.usuario_logado:
    st.title("🔒 Área Restrita")

    email = st.text_input("E-mail:")
    senha = st.text_input("Senha:", type="password")

    EMAILS_AUTORIZADOS = {"laise.pedroso@senaicni.com.br", "lleao@senaicni.com.br"}

    def validar_email(email):
        return email.strip().lower() in EMAILS_AUTORIZADOS


    col1, col2 = st.columns(2)
    with col1:
        if st.button("🔑 Entrar"):
            if senha == "minhasenha123" and validar_email(email):
                st.success(f"Bem-vindo, {email.split('@')[0].capitalize()}!")
                st.session_state.usuario_logado = email
                st.session_state.tela_login = False
                st.rerun()
            else:
                if not validar_email(email):
                    st.error("Apenas os e-mails autorizados podem acessar.")
                elif senha != "minhasenha123":
                    st.error("Senha incorreta. Tente novamente.")

    with col2:
        if st.button("❌ Voltar"):
            st.session_state.tela_login = False
            st.rerun()

    st.stop()

# SEÇÃO DE ÁREA RESTRITA PARA GESTORES
if st.session_state.usuario_logado:
    st.title("📊 Relatório de Avaliações")
    
    if os.path.exists(HISTORICO_FILE):
        try:
            df_historico = pd.read_csv(HISTORICO_FILE)
            if df_historico.empty:
                st.warning("Nenhuma avaliação registrada até o momento.")
            else:
                st.dataframe(df_historico)
        except Exception as e:
            st.error(f"Erro ao carregar os dados: {e}")

    
    if st.button("🚪 Sair"):
        st.session_state.usuario_logado = None
        st.rerun()
    st.stop()

# TELA PRINCIPAL
st.title("Avaliação de Competências Socioemocionais")

st.markdown("""
### **Sobre esta Avaliação**
Este formulário tem como objetivo avaliar **competências socioemocionais**, com foco na **Inteligência Emocional**.  
As respostas serão analisadas para ajudar no crescimento profissional da equipe.
""")

# Divisão do layout: Formulário na esquerda, gráficos na direita
col_form, col_graficos = st.columns([1, 1])

with col_form:
    nome_avaliador = st.text_input("Digite seu nome completo:", value="", placeholder="Nome completo obrigatório").strip()
    email_colaborador = st.text_input("Digite seu e-mail SENAI:", value="", placeholder="E-mail obrigatório").strip()
    tipo_avaliacao = st.selectbox("Selecione o tipo de avaliação", ["Autoavaliação", "Avaliação do Gestor", "Avaliação de Pares"])
    
    # Lista de nomes disponíveis para a Avaliação de Pares
    lista_nomes = [
        "Amanda Silva de Deus",
        "Ana Maria Sousa da Silva",
        "Anderson Garcia Scarlassara",
        "Anna Christina Theodora Aun de Azevedo Nascimento",
        "Brenda Kamilly da Silva Alves",
        "Bruno Silveira Duarte",
        "Cyro Visgueiro Maciel",
        "Decio Campos da Silva",
        "Elisie Coelho Lima",
        "Fabio Lima de Deus",
        "Flavio Oscar Hahn",
        "Frankwaine Pereira de Melo",
        "Germana Arcoverde Bezerra Zapata",
        "Giseli Almeida de Araujo",
        "Hugo Nakatani",
        "Jeferson Leandro Mateucci",
        "Juliana Gavini Uliana Pappetti",
        "Laise Caldeira Pedroso",
        "Lucas de Freitas Sousa",
        "Luciana Brasil Marques",
        "Luis Alberto Silva Monti",
        "Monica de Castro Mariano Carneiro",
        "Natalia Schultz de Souza",
        "Nelson Massaia Borsi Junior",
        "Rosamaria Capo Sobral",
        "Tricia Miranda Araujo"
    ]

    # Seção de seleção do nome do avaliado
    if tipo_avaliacao == "Avaliação de Pares":
        nome_avaliado = st.selectbox("Selecione o colaborador avaliado:", lista_nomes)
    elif tipo_avaliacao == "Avaliação do Gestor":
        nome_avaliado = "Luiz Eduardo Leão"  # Nome fixo para avaliação do gestor
    else:
        nome_avaliado = nome_avaliador  # Na autoavaliação, o próprio avaliador é o avaliado


    # Definição das descrições dinâmicas para cada nível (1 a 4)
    descricoes_niveis = {
        "1. Expressar opiniões divergentes de forma construtiva": {
            1: "Reconhece opiniões divergentes.",
            2: "Entende opiniões divergentes de forma construtiva, de maneira franca e respeitosa.",
            3: "Expressa opiniões divergentes de forma construtiva, de maneira franca e respeitosa, não se intimidando em posicionar-se.",
            4: "Acolhe e expressa opiniões divergentes de forma construtiva, de maneira franca e respeitosa, não se intimidando em posicionar-se."
        },
        "2. Comunicar de forma objetiva e clara": {
            1: "Comunica-se pouco de forma objetiva, simples e clara.",
            2: "Comunica-se de forma objetiva, simples e clara, muitas vezes adequando sua linguagem aos diferentes públicos.",
            3: "Comunica-se de forma objetiva, simples e clara, adequando sua linguagem aos diferentes públicos e checando o entendimento das pessoas.",
            4: "Sempre se comunica de forma objetiva, simples e clara, adequando sua linguagem aos diferentes públicos, checando o entendimento das pessoas e sendo uma referência para o grupo."
        },
        "3. Trabalhar de forma colaborativa": {
            1: "Trabalha pouco de forma colaborativa em atividades que envolvem diferentes áreas ou pessoas.",
            2: "Trabalha em algumas situações de forma colaborativa em atividades que envolvem diferentes áreas ou pessoas.",
            3: "Trabalha de forma colaborativa em atividades que envolvem diferentes áreas ou pessoas.",
            4: "Incentiva e trabalha sempre de forma colaborativa em atividades que envolvem diferentes áreas ou pessoas."
        },
        "4. Resolver problemas e dar devolutivas construtivas": {
            1: "Identifica problemas.",
            2: "Compreende problemas e pensa em algumas devolutivas de maneira construtiva.",
            3: "Resolve problemas e dá devolutivas de maneira construtiva.",
            4: "Identifica e resolve problemas, aplicando soluções de maneira construtiva."
        },
        "5. Adaptabilidade a mudanças e novos ambientes": {
            1: "Adapta-se pouco a diferentes grupos e ambientes.",
            2: "É capaz de se adaptar a diferentes grupos e ambientes, lidando bem com mudanças e situações novas.",
            3: "É capaz de se adaptar a diferentes grupos e ambientes, lidando razoavelmente bem com mudanças e situações novas.",
            4: "Adapta-se muito bem a diferentes grupos e ambientes, lidando bem com mudanças e situações novas dos seus colegas e da empresa."
        },
        "6. Abertura a feedback e aprendizado contínuo": {
            1: "Está pouco aberto a feedback.",
            2: "Está aberto em situações pontuais a feedback e busca algumas vezes aprendizados para alavancar seu crescimento profissional e do grupo.",
            3: "Está aberto a feedback e busca novos aprendizados para alavancar seu crescimento pessoal, desempenho profissional e do grupo.",
            4: "Está sempre aberto a feedback, buscando novos aprendizados para alavancar seu crescimento pessoal, desempenho profissional e do grupo."
        }
}

    # Exibição dos sliders com tooltips dinâmicos
    st.write("### 🎯 **Avalie cada competência de 1 a 4**")
    st.write("1 - Iniciante | 2 - Intermediário | 3 - Proficiente | 4 - Avançado")

    # Exibição dos sliders com tooltips dinâmicos
    perguntas = {}
    for pergunta, descricao in descricoes_niveis.items():
        # Criar um contêiner com borda e espaçamento para cada pergunta
        with st.container():
            st.markdown(
                f"""
                <div style="
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 5px;">
                    <p style="font-size:18px; font-weight:bold; margin-bottom:5px;">{pergunta}</p>
                    <div style="padding: 5px 0px;">
                """, unsafe_allow_html=True
            )

            # Criar o slider dentro do bloco
            nota = st.slider(pergunta, 1, 4, 2, key=f"slider_{pergunta}", label_visibility="hidden")
            perguntas[pergunta] = nota

            # Fechar a div e exibir tooltip alinhado
            st.markdown(
                f"""
                    </div>
                    <p style="font-size:14px; color:gray; margin-top:15px; text-align:left;">
                        <span style="color:#3498db;">ℹ️</span> {descricoes_niveis[pergunta][nota]}
                    </p>
            </div>
                """, unsafe_allow_html=True
            )

    if st.button("📩 Enviar Respostas"):
        dados = {
            "E-mail do Colaborador": email_colaborador,
            "Nome do Avaliador": nome_avaliador,
            "Tipo de Avaliação": tipo_avaliacao,
            "Nome do Avaliado": nome_avaliado,
            "Data": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            **perguntas
        }
        salvar_respostas(dados)
        st.success("✅ Respostas registradas com sucesso!")

        st.session_state["respostas_enviadas"] = False  # Marca que o usuário enviou as respostas
        st.rerun()  # Recarrega a página para exibir os gráficos somente após o envio

with col_graficos:
    if os.path.exists(HISTORICO_FILE):
        st.subheader("📊 Seu Histórico de Avaliações")

        df_historico = pd.read_csv(HISTORICO_FILE)
        email_colaborador = email_colaborador.strip().lower()

        if "E-mail do Colaborador" in df_historico.columns:
            df_historico["E-mail do Colaborador"] = df_historico["E-mail do Colaborador"].astype(str).str.strip().str.lower()
            df_filtrado = df_historico[df_historico["E-mail do Colaborador"] == email_colaborador]


            if df_filtrado.empty:
                st.warning("Você precisa preencher os campos obrigatórios.")
            else:
                st.write("📈 **Evolução das Competências ao Longo do Tempo**")

                col1, col2 = st.columns(2)  # Criando duas colunas para exibição dos gráficos lado a lado
                
                # Criar uma lista das perguntas
                lista_perguntas = list(perguntas.keys())
                
                import plotly.graph_objects as go

                # Criar gráficos organizados em pares com a cor #E94C4F e borda ao redor
                col1, col2 = st.columns(2)
                lista_perguntas = list(perguntas.keys())

                for i in range(0, len(lista_perguntas), 2):
                    with col1:
                        if i < len(lista_perguntas):
                            with st.container():
                                st.markdown(
                                    f"""
                                    <div style="border: 1px solid #ddd; border-radius: 8px; padding: 10px; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);">
                                        <b>{lista_perguntas[i]}</b>
                                    </div>
                                    """,
                                    unsafe_allow_html=True
                                )
                                fig1 = go.Figure()
                                fig1.add_trace(go.Scatter(
                                    x=df_filtrado["Data"],
                                    y=df_filtrado[lista_perguntas[i]],
                                    mode="lines+markers",
                                    line=dict(color="#E94C4F", width=3),  # Cor personalizada
                                    marker=dict(color="#E94C4F")
                                ))
                                fig1.update_layout(template="plotly_white", margin=dict(l=20, r=20, t=40, b=20))
                                st.plotly_chart(fig1, use_container_width=True, key=f"grafico_{lista_perguntas[i]}")

                    with col2:
                        if i + 1 < len(lista_perguntas):
                            with st.container():
                                st.markdown(
                                    f"""
                                    <div style="border: 1px solid #ddd; border-radius: 8px; padding: 10px; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);">
                                        <b>{lista_perguntas[i + 1]}</b>
                                    </div>
                                    """,
                                    unsafe_allow_html=True
                                )
                                fig2 = go.Figure()
                                fig2.add_trace(go.Scatter(
                                    x=df_filtrado["Data"],
                                    y=df_filtrado[lista_perguntas[i + 1]],
                                    mode="lines+markers",
                                    line=dict(color="#E94C4F", width=3),  # Cor personalizada
                                    marker=dict(color="#E94C4F")
                                ))
                                fig2.update_layout(template="plotly_white", margin=dict(l=20, r=20, t=40, b=20))
                            st.plotly_chart(fig2, use_container_width=True, key=f"grafico_{lista_perguntas[i+1]}")


