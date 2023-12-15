import React, { useState, useMemo, useCallback } from 'react';

import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    CircularProgress
} from '@mui/material';
import ModelSelection from './ModelSelection';
import PromptInputText from '../prompt/PromptInputText';
import ParametersForm from '../prompt/ParametersForm';
import Answer from '../prompt/answer';

const ComparisonMode = ({ executor }) => {
    const [scenarios, setScenarios] = useState([{
        "model": { "model": "cohere", "parameters": {} },
        "propmt": "",
        "parameters": []
    },
    {
        "model": { "model": "cohere", "parameters": {} },
        "propmt": "",
        "parameters": []
    }
    ]);
    const [examples, setExamples] = useState([]);
    const [responses, setResponses] = useState({})

    const run = useCallback(() => {
        scenarios.forEach(({ model, prompt }, scenario_index) => {
            if (examples.length === 0) {
                const response_key = `${scenario_index}_0`;
                setResponses((prevResponses) => ({
                    ...prevResponses,
                    [response_key]: {
                        isLoading: true,
                        prompt
                    }
                }));
                executor(prompt, model, (response) => {
                    setResponses((prevResponses) => ({
                        ...prevResponses,
                        [response_key]: {
                            ...prevResponses[response_key],
                            isLoading: false,
                            response
                        }
                    }));
                });
            } else {
                examples.forEach(({ parameters }, example_index) => {
                    const response_key = `${scenario_index}_${example_index}`;
                    let finalPrompt = prompt;
                    Object.keys(parameters).forEach((param) => {
                        finalPrompt = finalPrompt.replace(`{${param}}`, parameters[param]);
                    });
                    setResponses((prevResponses) => ({
                        ...prevResponses,
                        [response_key]: {
                            isLoading: true,
                            prompt: finalPrompt
                        }
                    }));
                    executor(finalPrompt, model, (response) => {
                        setResponses((prevResponses) => ({
                            ...prevResponses,
                            [response_key]: {
                                ...prevResponses[response_key],
                                isLoading: false,
                                response
                            }
                        }));
                    });
                })
            }
        });
    }, [executor, scenarios, examples]);

    const setScenarioAttribute = useCallback((index, attr, value) => {
        setScenarios((preScenarios) => preScenarios.map((scenario, currentIndex) => {
            if (currentIndex === index) return {
                ...scenario,
                [attr]: value
            }
            return scenario
        }));
    }, []);

    const handleScenarioAttributeChange = useCallback((index, attr) => (value) => {
        setScenarioAttribute(index, attr, value);
    }, [setScenarioAttribute]);

    const allParameters = useMemo(() => {
        let mergedParameters = new Set();
        scenarios.forEach((scenario) => {
            mergedParameters = new Set([...mergedParameters, ...scenario["parameters"]]);
        });
        return [...mergedParameters].sort();
    }, [scenarios]);

    const addExample = useCallback(() => {
        const parameters = {}
        allParameters.forEach((parameterName) => parameters[parameterName] = "");
        if (examples.length === 0) {
            setResponses({});   // Clean up entries with no examples
        }
        setExamples((prevExamples) => [...prevExamples, { parameters }]);
    }, [allParameters, examples])

    const updateExample = useCallback((index, attr) => (value) => {
        setExamples((prevExample) => prevExample.map((example, currentIndex) => {
            if (currentIndex === index) return {
                ...example,
                [attr]: value
            }
            return example
        }));
    }, []);

    const anyLoading = useMemo(() => {
        for (let key in responses) {
            if (responses[key].isLoading === true) return true;
        }
        return false;
    }, [responses])

    return <TableContainer>
        <Table>
            <TableBody>
                <TableRow>
                    <TableCell>
                        <Button variant="contained" color="primary" onClick={run} disabled={anyLoading}>
                            Run
                        </Button>
                        <Button variant="contained" color="primary" onClick={addExample} disabled={anyLoading}>
                            Add example
                        </Button>
                    </TableCell>
                    {scenarios.map((scenario, index) => {
                        return <TableCell key={index}>
                            <ModelSelection
                                model={scenario["model"]}
                                onSelectModel={handleScenarioAttributeChange(index, "model")}
                            />
                            <PromptInputText
                                prompt={scenario.prompt}
                                onChange={handleScenarioAttributeChange(index, "prompt")}
                                onParametersChange={handleScenarioAttributeChange(index, "parameters")} />
                        </TableCell>
                    })}
                </TableRow>
                {examples.map((example, example_index) =>
                    <TableRow key={example_index}>
                        <TableCell key="params">
                            <ParametersForm
                                title={`Example ${example_index + 1}`}
                                values={example.parameters}
                                parameters={allParameters}
                                onChange={updateExample(example_index, "parameters")}
                            />
                        </TableCell>
                        {scenarios.map((scenario, scenario_index) => {
                            const responseKey = `${scenario_index}_${example_index}`;
                            return <TableCell key={responseKey}>
                                {responses[responseKey] ?
                                    <>
                                        {responses[responseKey].isLoading === true && <CircularProgress size={24} sx={{ marginRight: 2 }} />}
                                        {responses[responseKey].isLoading === false && <Answer answer={responses[responseKey].response.answer} showRaw={false} />}
                                    </>
                                    : <div>Empty</div>
                                }
                            </TableCell>
                        })}
                    </TableRow>
                )}
                {examples.length === 0 && <TableRow>
                    <TableCell></TableCell>
                    {scenarios.map((scenario, scenario_index) => {
                        const responseKey = `${scenario_index}_0`;
                        return <TableCell key={responseKey}>
                            {responses[responseKey] ?
                                <>
                                    {responses[responseKey].isLoading === true && <CircularProgress size={24} sx={{ marginRight: 2 }} />}
                                    {responses[responseKey].isLoading === false && <Answer answer={responses[responseKey].response.answer} showRaw={false} />}
                                </>
                                : <div>Empty</div>
                            }
                        </TableCell>
                    })}
                </TableRow>}
            </TableBody>
        </Table>
    </TableContainer>
}

export default ComparisonMode;