import cohereApiRequest, {cohereParameters} from './cohereService';
import openAIApiRequest, {openAIParameters} from './openaiService';
import hfInferenceApiRequest, {hfParametersText2Text, hfParametersText2Image} from './hfInferenceAPIService';

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
    "hfInferenceAPI": {
        displayName: 'HuggingFace API (text2text)',
        apiRequest: hfInferenceApiRequest("text2text"),
        parameters: hfParametersText2Text
    },
    "hfInferenceAPIText2Image": {
        displayName: 'HuggingFace API (text2image)',
        apiRequest: hfInferenceApiRequest("text2image"),
        parameters: hfParametersText2Image
    },
};

export { models };