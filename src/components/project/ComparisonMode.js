import React, { useState, useMemo, useCallback } from 'react';

import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    CircularProgress,
    IconButton,
    Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import ModelSelection from './ModelSelection';
import PromptInputText from '../prompt/PromptInputText';
import ParametersForm from '../prompt/ParametersForm';
import Answer from '../prompt/answer';
import { trackEvent } from '../../services/analytics';

const getDefaultScenario = () => {
    return {
        "model": { "model": "cohere", "parameters": {} },
        "prompt": "",
        "parameters": []
    }
};

const ComparisonMode = ({ executor }) => {
    const [scenarios, setScenarios] = useState([getDefaultScenario()]);
    const [examples, setExamples] = useState([]);
    const [responses, setResponses] = useState({})

    const run = useCallback(() => {
        trackEvent("button", "click", "comparison_run");
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

    const addScenario = useCallback(() => {
        setScenarios((prevScenarions) => [...prevScenarions, getDefaultScenario()])
    }, [])

    const updateExample = useCallback((index, attr) => (value) => {
        setExamples((prevExample) => prevExample.map((example, currentIndex) => {
            if (currentIndex === index) return {
                ...example,
                [attr]: value
            }
            return example
        }));
    }, []);

    const deleteExample = useCallback((index) => () => {
        setResponses((prevResponses) => {
            const updated = {};
            for (let key in prevResponses) {
                const [scenario_index, example_index] = key.split("_").map(v => parseInt(v, 10));
                if (example_index < index) updated[key] = prevResponses[key];
                else if (example_index > index) updated[`${scenario_index}_${example_index - 1}`] = prevResponses[key];
            }
            return updated
        });
        setExamples((prevExamples) => prevExamples.filter((_, currentIndex) => currentIndex !== index));
    }, []);

    const deleteScenario = useCallback((index) => () => {
        setResponses((prevResponses) => {
            const updated = {};
            for (let key in prevResponses) {
                const [scenario_index, example_index] = key.split("_").map(v => parseInt(v, 10));
                if (scenario_index < index) updated[key] = prevResponses[key];
                else if (scenario_index > index) updated[`${scenario_index - 1}_${example_index}`] = prevResponses[key];
            }
            return updated
        });
        setScenarios((prevScenario) => prevScenario.filter((_, currentIndex) => currentIndex !== index));
    }, []);

    const copyScenario = useCallback((index) => () => {
        setScenarios((prevScenarios) => [...prevScenarios, prevScenarios[index]]);
    }, []);

    const copyExample = useCallback((index) => () => {
        setExamples((prevExamples) => [...prevExamples, prevExamples[index]]);
    }, []);

    const anyLoading = useMemo(() => {
        for (let key in responses) {
            if (responses[key].isLoading === true) return true;
        }
        return false;
    }, [responses]);

    return <TableContainer>
        <Table>
            <TableBody>
                <TableRow>
                    <TableCell>
                        <Button variant="contained" color="primary" onClick={run} disabled={anyLoading}>
                            Run
                        </Button>
                        <Button variant="contained" color="secondary" onClick={addExample} disabled={anyLoading}>
                            Add example
                        </Button>
                        <Button variant="contained" color="secondary" onClick={addScenario} disabled={anyLoading}>
                            Add scenario
                        </Button>
                    </TableCell>
                    {scenarios.map((scenario, scenario_index) => {
                        return <TableCell key={scenario_index} sx={{ verticalAlign: 'top' }}>
                            <Stack direction="row" justifyContent="end">
                                <IconButton color="secondary" onClick={copyScenario(scenario_index)} disabled={anyLoading}>
                                    <ContentCopyIcon />
                                </IconButton>
                                <IconButton color="secondary" onClick={deleteScenario(scenario_index)} disabled={anyLoading}>
                                    <DeleteIcon />
                                </IconButton>
                            </Stack>
                            <ModelSelection
                                model={scenario["model"]}
                                onSelectModel={handleScenarioAttributeChange(scenario_index, "model")}
                            />
                            <PromptInputText
                                prompt={scenario.prompt}
                                onChange={handleScenarioAttributeChange(scenario_index, "prompt")}
                                onParametersChange={handleScenarioAttributeChange(scenario_index, "parameters")} />
                        </TableCell>
                    })}
                </TableRow>
                {examples.map((example, example_index) =>
                    <TableRow key={example_index}>
                        <TableCell key="params"  sx={{ verticalAlign: 'top' }}>
                            <Stack direction="row" justifyContent="end">
                                <IconButton color="secondary" onClick={copyExample(example_index)} disabled={anyLoading}>
                                    <ContentCopyIcon />
                                </IconButton>
                                <IconButton color="secondary" onClick={deleteExample(example_index)} disabled={anyLoading}>
                                    <DeleteIcon />
                                </IconButton>
                            </Stack>
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