import React, { useState, useMemo, useCallback } from 'react';

import {
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
} from '@mui/material';
import ModelSelection from './ModelSelection';
import PromptInputText from '../prompt/PromptInputText';

const ComparisonMode = () => {
    const [scenarios, setScenarios] = useState([{
        "model": { "model": "cohere" },
        "propmt": "",
        "parameters": []
    },
        // {
        //     "model": { "model": "cohere" },
        //     "propmt": "",
        //     "parameters": []
        // }
    ]);
    const [allParameters, setAllParameters] = useState([]);
    const [examples, setExamples] = useState([]);

    const setScenarioAttribute = useCallback((index, attr, value) => {
        console.log("setScenarioAttribute called", {index, attr, value})
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

    const handleParametersChange = useCallback((index) => (parameters) => {
        var mergedParameters = new Set(parameters);
        console.log(scenarios);
        scenarios.forEach((scenario, currentIndex) => {
            if (currentIndex !== index) {
                mergedParameters = new Set([...mergedParameters, ...scenario["parameters"]]);
            }
        });
        console.log(mergedParameters);
        setAllParameters([...mergedParameters].sort());
        setScenarioAttribute(index, "parameters", parameters);
    }, [scenarios, setScenarioAttribute]);

    const parametersChangeHandlers = useMemo(() => {
        console.log("Creating parametersChangeHandlers")
        return scenarios.map((scenario, index) => {
            return (parameters) => handleParametersChange(index, parameters);
        })
    }, [scenarios, handleParametersChange]);

    const setModelsHandlers = useMemo(() => {
        console.log("creating setModelsHandlers");
        return scenarios.map((scenario, index) => {
            return (model) => setScenarioAttribute(index, "model", model);
        });
    }, [scenarios, setScenarioAttribute]);


    const scenarioCells = useMemo(() => {
        console.log("running scenarioCells");
        return scenarios.map((scenario, index) => {
            return <TableCell key={index}>
                <ModelSelection onSelectModel={handleScenarioAttributeChange(index, "model")} />
                {/* <ModelSelection onSelectModel={() =>console.log("onSelectModel called")} /> */}
                <PromptInputText onChange={console.log}
                                onParametersChange={handleParametersChange(index)} />
            </TableCell>
        });
    }, [scenarios, handleParametersChange]);

    console.log({ scenarios });
    return <TableContainer>
        <Table>
            <TableBody>
                <TableRow>
                    <TableCell />
                    {/* {scenarios.map((scenario, index) => {
                        return <TableCell key={index}>
                            <ModelSelector index={index}/>
                            <ModelSelection onSelectModel={setModelsHandlers[index]} />
                            <PromptInputText onChange={console.log}
                                onParametersChange={handleParametersChange(index, "parameters")} />
                        </TableCell>
                    })} */}
                    {scenarioCells}
                </TableRow>
                <TableRow>
                    <TableCell>
                        {allParameters.map((text, index) => <pre key={index}>{text}</pre>)}
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </TableContainer>
}

export default ComparisonMode;