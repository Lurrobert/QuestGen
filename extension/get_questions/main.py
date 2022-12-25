from typing import Union
import json
import logging
import logging.config

from fastapi import FastAPI
from bs4 import BeautifulSoup
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
import openai
from dotenv import load_dotenv
load_dotenv()


openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Data(BaseModel):
    article: str


prompt = """
make 2 pairs of questions and answers about this text:
According to weather reports, a white Christmas is due this year across much of the country. However, as opposed to a light dusting, a potential bomb cyclone over the Midwest and a blizzard in the Northwest are expected. Meanwhile, heavy rain across New England and high winds across the East coast are set to hit in tandem ahead of the Christmas holiday weekend.
=
Q: Where would be the potential bomb cyclone?
A: over the Midwest and a blizzard in the Northwest
-
Q: What will be the weather like across New England?
A: heavy rain
make 2 pairs of questions and answers about this text:

"""



@app.post("/get_questions")
def read_item(article: Data):
    result_sections = []
    soup = BeautifulSoup(article.article)
    for node in soup.findAll('p'):
        text = ''.join(node.findAll(text=True)).strip()
        if text:
            result_sections.append(text)
    responses = []
    for section in result_sections[10:14]:
        response = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt+section+'\n=\n',
        temperature=0.92,
        max_tokens=256,
        top_p=1,
        best_of=1,
        frequency_penalty=0,
        presence_penalty=0
        )
        responses.append(response['choices'][0]['text'])
    qa_pairs = {}
    for r in responses:
        for question_pair in r.split('-'):
            question_pair = question_pair.strip()
            if question_pair.strip():
                qa_pairs[question_pair.split("\n")[0][3:]] = question_pair.split("\n")[1][3:].strip()
    logger.info("msg='qa pairs: %s'", qa_pairs)
    return JSONResponse(content=qa_pairs)


    