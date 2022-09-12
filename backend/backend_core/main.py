from backend_core import summarization
from backend_core import search
from backend_core import scraping
from backend_core import qa
from backend_core.scraping import ScrapedResult
from backend_core.search import Search
from json import dumps


class Result:
    def __init__(self, scrapedResult, answerType, answer, suggestions):
        self.answerType = answerType
        self.answer = answer
        self.scrapedResult = scrapedResult
        self.suggestions = suggestions

    def to_dict(self):
        res = {"answerType": self.answerType,
               "answer": self.answer, 'suggestions': self.suggestions}
        res.update(
            self.scrapedResult.to_dict())
        return res

    def json(self):
        return dumps(self.to_dict())


def pickResult(results):
    if len(results['answers']) != 0:
        return results['answers'][0]
    elif len(results['scraped']) != 0:
        return results['scraped'][0]


def process(question, questionType="summarization"):
    print("Processing...")
    search_obj = Search(question)
    results = search_obj.result
    print("Search completed...")
    print(results)
    search_obj.log(fullResult=True)
    scrapedContent = scraping.process(results)
    selectedContent: ScrapedResult = pickResult(scrapedContent)
    suggestions = scrapedContent['suggestions']
    if selectedContent is None:
        raise Exception("Cannot get a result")
    if questionType == "summarization":
        return Result(selectedContent, "summarization", summarization.summarize(selectedContent.scraped), suggestions)
    elif questionType == "factoid":
        return Result(selectedContent, "factoid", qa.getAnswer(question, selectedContent.scraped), suggestions)
