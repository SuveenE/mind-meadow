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
            {
                "role": "system",
                "content": "You are a memory assistant helping users recall important details.",
            },
            {
                "role": "user",
                "content": f"Summarize the key details from the following conversation in one sentence (10 words or less) to help the user recall what they were told: {conversation}",
            },
        ],
        max_tokens=1024,
    )
    return response.choices[0].message.content


# This function can be called using a wake word. Ex: Hey "MindBuddy" I can't remember what my mother wanted me to get
def recall_things(query, texts):
    """
    Parameters:
    query (str): The user's query which shows what the user wants to recall.
    texts (list of str): A list of conversation strings that are related to the query.
    """

    conversation = " ".join(texts)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are a memory assistant helping users recall important details.",
            },
            {
                "role": "user",
                "content": f"""Your task is to help the user recall what they are trying to recall. The user is a patient having 
                 dimentia. Use the following query that user did and the conversation snippets that are most related to the query to 
                 come up with the answer. 
                ### QUERY: {query} 
                ### CONVERSATION SNIPPETS: {conversation}

                ### GUIDELINES:
                Make the output as short as possible. Make sure it's less than 5 words no matter what.
                """, #Try few short prompting
            },
        ],
        max_tokens=1024,
    )
    return response.choices[0].message.content
