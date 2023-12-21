import cohereApiRequest, {cohereParameters} from './cohereService';
import openAIApiRequest, {openAIParameters} from './openaiService';
import openchatApiRequest, {hfParameters} from './openchatService';

const models = {
    "cohere": {
        displayName: 'Cohere',
        apiRequest: cohereApiRequest,
        parameters: cohereParameters
    },
    "openai": {
        displayName: 'OpenAI',
        apiRequest: openAIApiRequest,
        parameters: openAIParameters
    },
    "openchat": {
        displayName: 'OpenChat 3.5',
        apiRequest: openchatApiRequest,
        parameters: hfParameters
    },
};

export { models };