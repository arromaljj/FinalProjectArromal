from backend_core.models import factoid_model


def getAnswer(question, context):
    return factoid_model(question=question, context=context)
