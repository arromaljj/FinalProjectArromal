# %%
# from backend_core.summarization import summarize
# from backend_core.qa import getAnswer
from backend_core.main import process
from flask_cors import CORS
from flask import Flask, request, jsonify


# %%

app = Flask(__name__)
CORS(app)


@app.route("/", methods=["POST"])
def get_answer():
    try:
        if (request.json):
            body = request.json
            print(body)
            check_options = 'question' in body
            if check_options:
                try:
                    if 'questionType' in body:
                        return process(body['question'], body['questionType']).to_dict()
                    else:
                        return process(body['question']).to_dict()
                except Exception as e:
                    print(e)
                    return {"error": "Didnt return a valid response from search"}, 400
        return {"error": "issues present with input"}, 400
    except Exception as e:
        print("Early exception")
        print(e)
        return {"error": "Early Exception"}, 400


# @app.route('/summarize/', methods=['POST'])
# def get_summary():
#     if (request.json):
#         if 'text' in request.json:
#             text = request.json['text']
#             if type(text) is str and text != '':
#                 return {'summary': summarize(text)}
#         else:
#             return {'error': "Please input valid text"}


# @app.route('/qa/', methods=['POST'])
# def get_qa():
#     if (request.json):
#         question = request.json['question'] if 'question' in request.json else None
#         context = request.json['context'] if 'context' in request.json else None
#         is_valid_question = question is not None and type(
#             question) is str and question != ''
#         is_valid_context = context is not None and type(
#             context) is str and context != ''
#         if is_valid_question and is_valid_context:
#             return getAnswer(question, context)
#         else:
#             return {'error': "Please input valid text"}


"""
- Extracting documents from search.
"""


if __name__ == "__main__":
    from waitress import serve
    host = "0.0.0.0"
    port = 105
    print("Application running on " + host + "::" + str(port))
    serve(app, host=host, port=port)

    # app.run(host="0.0.0.0", port=105)

# %%

# %%
