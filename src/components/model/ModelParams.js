import React, { useCallback } from "react";
import { TextField, Select, MenuItem, FormControl, InputLabel, FormControlLabel, Checkbox, Autocomplete } from '@mui/material';

const ModelParams = ({ values, onChange, parametersConfig }) => {
    const handleIfNumeric = useCallback((parameterId, value) => {
        const config = parametersConfig.find((parameter) => parameter.id === parameterId && (parameter.type === "int" || parameter.type === "float"));
        if (config) {
            if (value === "" || value === undefined) return config.default;
            if (config.type === "int") value = parseInt(value, 10);
            else value = parseFloat(value);
            if (config.min !== undefined && value < config.min) return config.min;
            if (config.max !== undefined && value > config.max) return config.max;
            return value;
        } else {
            return value;
        }
    }, [parametersConfig]);

    const reportParameter = useCallback((parameter, value) => {
        onChange({
            ...values,
            [parameter]: value
        });
    }, [values, onChange]);

    const reportTextParameter = useCallback((parameter) => (event) => {
        let value = event.target.textContent || event.target.value;
        value = handleIfNumeric(parameter, value);
        reportParameter(parameter, value);
    }, [reportParameter, handleIfNumeric])

    const reportBoolParameter = useCallback((parameter) => (event) => {
        const value = event.target.checked;
        reportParameter(parameter, value);
    }, [reportParameter])

    const renderer = (parameter, index) => {
        if (parameter.type === "select") {
            return <FormControl sx={{ margin: 1 }} key={index}>
                <InputLabel htmlFor="model">{parameter.label}</InputLabel>
                <Select
                    id="model"
                    label={parameter.label}
                    value={values[parameter.id] || parameter.default}
                    onChange={reportTextParameter(parameter.id)}
                    size='small'
                >
                    {parameter.options.map((option, index) =>
                        <MenuItem value={option} key={index}>{option}</MenuItem>)}
                </Select>
            </FormControl>
        }
        else if (parameter.type === "text") {
            return <TextField
                key={index}
                fullWidth={parameter.fullWidth}
                multiline
                size='small'
                label={parameter.label}
                value={values[parameter.id] || parameter.default}
                onChange={reportTextParameter(parameter.id)}
                sx={{ margin: 1 }}
            />
        }
        else if (parameter.type === "int" || parameter.type === "float") {
            return <TextField
                key={index}
                type="number"
                size='small'
                label={parameter.label}
                step={parameter.step}
                value={values[parameter.id] === undefined ? parameter.default : values[parameter.id]}
                onChange={reportTextParameter(parameter.id)}
                sx={{ margin: 1 }}
            />
        }
        else if (parameter.type === "bool") {
            return <FormControlLabel key={index}
                control={
                    <Checkbox
                        checked={values[parameter.id] === undefined ? parameter.default : values[parameter.id]}
                        onChange={reportBoolParameter(parameter.id)}
                        sx={{ margin: 1 }}
                    />
                }
                label={parameter.label}
            />;
        }
        else if (parameter.type === "autocomplete") {
            return <Autocomplete key={index}
                freeSolo
                disableClearable
                fullWidth={parameter.fullWidth}
                options={parameter.options.sort()}
                value={values[parameter.id] || parameter.default}
                renderInput={(params) => <TextField {...params} label={parameter.label} />}
                onChange={reportTextParameter(parameter.id)}
                sx={{ margin: 1 }}
            />
        }
    }

    return <>
        {parametersConfig.map(renderer)}
    </>;
}

export default ModelParams;