# %%
import wikipedia


class ScrapedResult:
    def __init__(self, scraped, website, resultSource) -> None:
        self.scraped = scraped
        self.website = website
        self.resultSource = resultSource

    def to_dict(self):
        return {"scraped": self.scraped, "website": self.website, "resultSource": self.resultSource}


def process(res):
    results = [scrape(r) for r in res['results']]
    suggestions = res['suggestions']
    # infoBox = [processInfoBox(i) for i in res['infobox']]
    answers = [ScrapedResult(ans, None, "SearchAnswer")
               for ans in res['answers']]
    infoBox = []
    return {'scraped': results, 'answers': answers,  'infoboxContent': infoBox, 'suggestions': suggestions}


def isWikipedia(url):
    keywords = url.split('.')
    if 'wikipedia' in keywords:
        return True
    return False


def extractFromWikipedia(url):
    title = url.split('/')
    title = title[len(title) - 1]
    return wikipedia.summary(title, auto_suggest=False)


def scrape(res):
    url = res['url']
    content = None
    if isWikipedia(url):
        content = extractFromWikipedia(url)
    else:
        content = res['content']
    return ScrapedResult(content, res['url'], 'SearchResult')
