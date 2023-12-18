import React, { useState, useEffect } from "react";
import { Alert, Link, Paper, Typography } from "@mui/material";

import ReactMarkdown from 'react-markdown';
import Text from './GettingStarted.md';

const GettingStarted = (() => {
    const [content, setContent] = useState();

    useEffect(() => {
        console.log({ Text });
        fetch(Text)
            .then(response => response.text())
            .then(setContent);
    }, []);

    return <Paper sx={{ margin: 1, padding: 4 }}>
        <ReactMarkdown components={{
            blockquote(props) {
                const { node, ...rest } = props
                return <Alert severity="success" {...rest} />
            },
            h1(props) {
                const { node, ...rest } = props
                return <Typography variant="h3" {...rest} />
            },
            h2(props) {
                const { node, ...rest } = props
                return <Typography variant="h4" {...rest} />
            },
            h3(props) {
                const { node, ...rest } = props
                return <Typography variant="h5" {...rest} />
            },
            // Rewrite a
            a(props) {
                const { node, ...rest } = props
                return <Link {...rest} target="_blank" />
            }
        }}>
            {content}
        </ReactMarkdown>
    </Paper >
});

export default GettingStarted;