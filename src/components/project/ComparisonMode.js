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
    Stack,
    Typography,
    Box
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
    const [examples, setExamples] = useState([{"parameters": {}}]);
    const [responses, setResponses] = useState({});

    const executeByCoordinate = useCallback((scenario_index, example_index) => {
        const { model, prompt } = scenarios[scenario_index];
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
            const response_key = `${scenario_index}_${example_index}`;
            const { parameters } = examples[example_index];
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
        }
    }, [executor, scenarios, examples]);

    const runOne = useCallback((scenario_index, example_index) => () => {
        trackEvent("button", "click", "comparison_run_all");
        executeByCoordinate(scenario_index, example_index);
    }, [executeByCoordinate]);

    const runAll = useCallback(() => {
        trackEvent("button", "click", "comparison_run_all");
        scenarios.forEach((_, scenario_index) => {
            if (examples.length === 0) {
                executeByCoordinate(scenario_index, 0);
            } else {
                examples.forEach((_, example_index) => {
                    executeByCoordinate(scenario_index, example_index);
                })
            }
        });
    }, [executeByCoordinate, scenarios, examples]);

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
                        <Button fullWidth variant="contained" color="primary" onClick={runAll} disabled={anyLoading}>
                            Run All
                        </Button>
                        <Button fullWidth variant="contained" color="secondary" onClick={addExample} disabled={anyLoading}>
                            Add example
                        </Button>
                        <Button fullWidth variant="contained" color="secondary" onClick={addScenario} disabled={anyLoading}>
                            Add scenario
                        </Button>
                    </TableCell>
                    {scenarios.map((scenario, scenario_index) => {
                        return <TableCell key={scenario_index} sx={{ verticalAlign: 'top' }}>
                            <Stack direction="row" alignItems="center">
                                <Typography variant='h6'>Scenario {scenario_index + 1}</Typography>
                                <Box flexGrow={1}/>
                                <IconButton color="secondary" onClick={copyScenario(scenario_index)} disabled={anyLoading}>
                                    <ContentCopyIcon />
                                </IconButton>
                                <IconButton color="secondary" onClick={deleteScenario(scenario_index)} disabled={anyLoading || scenarios.length === 1}>
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
                        <TableCell key="params" sx={{ verticalAlign: 'top' }}>
                            <Stack direction="row" alignItems="center">
                                <Typography variant='h6'>Example {example_index + 1}</Typography>
                                <Box flexGrow={1}/>
                                <IconButton color="secondary" onClick={copyExample(example_index)} disabled={anyLoading}>
                                    <ContentCopyIcon />
                                </IconButton>
                                <IconButton color="secondary" onClick={deleteExample(example_index)} disabled={anyLoading || examples.length === 1}>
                                    <DeleteIcon />
                                </IconButton>
                            </Stack>
                            <ParametersForm
                                values={example.parameters}
                                parameters={allParameters}
                                onChange={updateExample(example_index, "parameters")}
                            />
                        </TableCell>
                        {scenarios.map((scenario, scenario_index) => {
                            const responseKey = `${scenario_index}_${example_index}`;
                            return <TableCell key={responseKey} align='center'>
                                {responses[responseKey] ?
                                    <>
                                        {responses[responseKey].isLoading === true && <CircularProgress size={24} sx={{ marginRight: 2 }} />}
                                        {responses[responseKey].isLoading === false && <Answer answer={responses[responseKey].response.answer} showRaw={false} />}
                                    </>
                                    : <div>
                                        <Button variant="contained" color="primary" onClick={runOne(scenario_index, example_index)} disabled={anyLoading}>
                                            Run
                                        </Button>
                                    </div>
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
                                : <Button variant="contained" color="primary" onClick={runOne(scenario_index, 0)} disabled={anyLoading}>
                                    Run
                                </Button>
                            }
                        </TableCell>
                    })}
                </TableRow>}
            </TableBody>
        </Table>
    </TableContainer>
}

export default ComparisonMode;