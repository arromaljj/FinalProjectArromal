# %%
from datetime import date
import requests
from json import dump, load
# %%


class Search:
    def __init__(self, keyword, url="http://localhost:8080/search", getResult=True):
        self.keyword = keyword
        self.url = url
        self.resultMax = 2
        self.infoBoxMax = 1
        if getResult:
            self.fullResult = self._search()
            self.result = self.extractRelevant()

    def html(self):
        params = {'q': self.keyword}
        res = requests.post(self.url, params)
        return res

    def test_search(self):
        params = {'q': self.keyword,  'format': 'json'}
        res = requests.post(self.url, params)
        return res

    def _search(self):
        params = {'q': self.keyword,  'format': 'json'}
        res = requests.post(self.url, params)
        return res.json()

    def refresh(self):
        self.fullResult = self._search()

    def extractRelevant(self):
        if not self.fullResult:
            self.refresh()
        res = self.extract()
        if len(res['results']) > self.resultMax:
            res['results'] = [res['results'][i] for i in range(2)]
        if len(res['infoboxes']) > self.infoBoxMax:
            res['infoboxes'] = [res['infoboxes'][i] for i in range(1)]
        return res

    def extractResult(self, res):
        keys = ['url', 'title', 'content', 'category']
        return {k: res[k] for k in keys if k in res.keys()}

    def extactInfoBox(self, infoBox):
        keys = ['infoBox', 'id', 'content']
        return {k: infoBox[k] for k in keys if k in infoBox.keys()}

    def extract(self):
        results = [self.extractResult(result)
                   for result in self.fullResult['results']]
        answers = self.fullResult['answers']
        infoboxes = [self.extactInfoBox(info)
                     for info in self.fullResult['infoboxes']]
        suggestions = self.fullResult['suggestions']
        return {'results': results, 'answers': answers, 'infoboxes': infoboxes, 'suggestions': suggestions}

    def log(self, result=True, fullResult=False, fileName="searchLog.json"):
        with open(fileName, 'a') as f:
            if result or fullResult:
                f.write(date.today().strftime("%d/%m/%Y %H:%M:%S") + "\n \n")
            if result:
                f.write("\n \nExtracted Results\n")
                dump(self.result, f, indent=4)
            if fullResult:
                f.write("\n \nFull Results\n")
                dump(self.result, f, indent=4)


def writeToFile(content, fileName="sampleSearch.json"):
    with open(fileName, 'w') as f:
        dump(content, f, indent=4)


def read(fileName="sampleSearch.json"):
    with open(fileName, "r") as f:
        return load(f)
