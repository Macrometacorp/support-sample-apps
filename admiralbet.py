import scrapy
from scrapy.crawler import CrawlerProcess
from scrapy.selector import Selector

class Pauk(scrapy.Spider):
    name = 'paukcina'
    start_urls = [
       'https://admiralbet.rs/sport-prematch?sport=Fudbal'
    ]
    def parse(self, response):
        css_path = 'div _ngcontent-aps-c84.ng-tns-c84-0.ng-trigger.ng-trigger-blink'
        yield response.xpath(css_path).get()

process = CrawlerProcess()
process.crawl(Pauk)
process.start()