import React from "react";

import { Alert } from '@mui/material'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'

import './answer.css';
import ImageView from "../common/ImageView";

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
            if (answer.kind === "image") {
                return <ImageView src={answer.answer} alt={answer.answer} size={200}/>
            }
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