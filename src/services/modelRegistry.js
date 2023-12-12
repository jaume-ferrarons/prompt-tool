import cohereApiRequest from './cohereService';
import openchatApiRequest from './openchatService';

const models = {
    "cohere": {
        displayName: 'Cohere',
        apiRequest: cohereApiRequest
    },
    "openchat": {
        displayName: 'OpenChat 3.5',
        apiRequest: openchatApiRequest
    },
};

export { models };