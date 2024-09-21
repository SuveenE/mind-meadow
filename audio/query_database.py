import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def summarize_conversation(texts):
    conversation = " ".join(texts)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {
                "role": "user",
                "content": f"Summarize the following conversation in 10 words or less: {conversation}",
            },
        ],
        max_tokens=1024,
    )
    return response.choices[0].message.content
