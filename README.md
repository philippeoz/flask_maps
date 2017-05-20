Maps with Flask
====

Pequena aplicação Flask, para coletar dados de marcadores adicionados ao mapa do google.

---
Como executar?
---
1. Criar e ativar um [ambiente virtual](http://docs.python-guide.org/en/latest/dev/virtualenvs/)
    * `mkvirtualenv flask_maps` para criar um virtualenv chamado flask_maps
    * `workon flask_maps` para ativar o virtualenv sempre que for trabalhar no projeto

2. Instalar as dependências
    * `pip install -r requirements.txt`

3. Criar um arquivo chamado `settings.ini` dentro da pasta flask_app com o seguinte conteúdo:
```
[settings]
KEY_G_ST_VIEW=SUA-KEY-DO-GOOGLE-STREET-VIEW
KEY_G_MAPS=SUA-KEY-DO-GOOGLE-MAPS
```

4. Depois de criado o arquivo, basta executar o comando:
    * `python run.py` (o arquivo run.py está na pasta flask_app)
    * O sistema criará o banco de dados caso não exista.
