from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)  # Permite que seu site HTML fale com o Python

ARQUIVO_EXCEL = 'livros.xlsx'

# Garante que o Excel existe com os cabeçalhos corretos
def verificar_excel():
    if not os.path.exists(ARQUIVO_EXCEL):
        colunas = ['id', 'titulo', 'autor', 'capa', 'descricao', 'generol', 'quantidade']
        df = pd.DataFrame(columns=colunas)
        df.to_excel(ARQUIVO_EXCEL, index=False)

@app.route('/cadastrar', methods=['POST'])
def cadastrar():
    try:
        dados = request.get_json()
        
        # Lê o Excel atual
        df = pd.read_excel(ARQUIVO_EXCEL)
        
        # Adiciona o novo livro
        novo_df = pd.DataFrame([dados])
        df = pd.concat([df, novo_df], ignore_index=True)
        
        # Salva de volta no Excel
        df.to_excel(ARQUIVO_EXCEL, index=False)
        
        return jsonify({"status": "sucesso", "mensagem": "Livro salvo no Excel!"}), 200
    except Exception as e:
        return jsonify({"status": "erro", "mensagem": str(e)}), 500

@app.route('/listar', methods=['GET'])
def listar():
    try:
        df = pd.read_excel(ARQUIVO_EXCEL)
        # Converte o Excel para uma lista que o JavaScript entende
        dados = df.to_dict(orient='records')
        return jsonify(dados), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

if __name__ == '__main__':
    verificar_excel()
    print("Servidor rodando em http://127.0.0.1:5000")
    app.run(debug=True)
