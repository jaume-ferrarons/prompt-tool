import React from "react";

import { Alert } from '@mui/material'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'

const Answer = ({ answer, showRaw }) => {
    if (answer == null) {
        return <></>
    }
    if (answer["status"] === 200) {
        if (showRaw) {
            return (
                <pre style={{ "white-space": "pre-wrap" }}>{answer["answer"]}</pre>
            );
        }
        else {
            return (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {answer["answer"] || ''}
                </ReactMarkdown>
            );
        }
    }
    else {
        return <Alert severity="error">{answer["errorMessage"]}</Alert>;
    }
}

export default Answer