import React, { useCallback } from "react";

import { TextField, Typography, Alert, AlertTitle } from '@mui/material';

const ParametersForm = ({ values, parameters, title, onChange }) => {
    const setParameterValue = useCallback((parameter) => (event) => {
        onChange({
            ...values,
            [parameter]: event.target.value
        })
    }, [values, onChange]);

    return <>
        <Typography variant="subtitle1">{title}</Typography>
        {parameters.length === 0 ? <Alert severity="info">
            <AlertTitle>No parameters detected</AlertTitle>
            No parameters found in any prompt, you can add one like this {"{variable}"}
        </Alert> : null}
        {parameters.map((parameterName) =>
            <TextField
                key={parameterName}
                fullWidth
                multiline
                label={parameterName}
                variant="outlined"
                value={values[parameterName] || ''}
                placeholder={`Enter value for ${parameterName}`}
                onChange={setParameterValue(parameterName)}
                sx={{ margin: 1 }}
            />
        )}
    </>;
}

export default ParametersForm;