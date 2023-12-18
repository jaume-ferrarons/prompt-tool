# Getting Started
To begin using this tool effectively, you'll need to set up API keys for at least one of the supported models:

## 1. Set up API Keys

**IMPORTANT: This webapp stores the API Keys only in your browser (Local Storage)**

### Huggingface Inference API

1. **Register or Sign In**: Login or create an account on [Huggingface](https://huggingface.co/).
2. **Generate a Token**: Go to [Access Tokens setting](https://huggingface.co/settings/tokens) and create a new token. Copy the token.
3. **Configure API Key**: Paste the copied token into the API Keys configuration dialog accessible from the top bar.

### Cohere API

1. **Register or Sign In**: Login or create an account on [Cohere](https://dashboard.cohere.com/)
2. **Get an API Key**: Access [API Keys section](https://dashboard.cohere.com/api-keys) in Cohere's dashboard and create a new token. Copy the API Key.
3. **Configure API Key**: Paste the copied API Key into the API Keys configuration dialog accessible from the top bar.

## 2. Start prompting

1. **Create a New Project**: Use the top bar to create a new project.
2. **Configure Model**: Select your desired model.
3. **Write Prompt**: Input your prompt in the dedicated field.
4. **Execute**: Click "Run" to trigger prompt generation!

That's it! You're now ready to explore the capabilities of this tool. Create projects, experiment with different models, and refine your prompts for optimal results.

# Features

## Variables support
You can easily parametrize your prompts using curly braces { }. For example: `Tell me a joke about {topic}` will let you easily try different values for `topic`.