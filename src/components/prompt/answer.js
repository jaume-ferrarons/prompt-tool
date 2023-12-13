import React from "react";

import { Alert } from '@mui/material'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'

import './answer.css';

const Answer = ({ answer, showRaw }) => {
    if (answer == null) {
        return <></>
    }
    if (answer["status"] === 200) {
        if (showRaw) {
            return (
                <pre style={{ "whiteSpace": "pre-wrap" }}>{answer["answer"]}</pre>
            );
        }
        else {
            return (
                <ReactMarkdown remarkPlugins={[remarkGfm]} style={{ "whiteSpace": "pre-wrap" }} className="markdown">
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