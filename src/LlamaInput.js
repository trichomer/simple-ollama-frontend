import React, { useState } from 'react';
import { TextField, Button, Box, Card, CardContent, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import ollama from 'ollama';

const LlamaInput = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState('llama2');
  const [sdPrompt, setSDPrompt] = useState('');
  const [sdResponse, setSDResponse] = useState('');
  const [isLoadingSD, setIsLoadingSD] = useState(false);

  const handleInputChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleModelChange = (event) => {
    setModel(event.target.value);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setResponse('');
    try {
      const streamResponse = await ollama.chat({
        model: model,
        messages: [{ role: 'user', content: prompt }],
        stream: true,
      });

      for await (const stream of streamResponse) {
        setResponse((prevResponse) => prevResponse + stream.message.content);
      }

    } catch (error) {
      console.error('Error fetching response from llama2:', error);
    } finally {
        setIsLoading(false);
    }
  };

  const handleStableDiffusionInputChange = (event) => {
    setSDPrompt(event.target.value);
    };

    const handleStableDiffusionSubmit = async () => {
        setIsLoadingSD(true);
        setSDResponse('');
        try {
            const response = await fetch('http://localhost:5000/generate-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: sdPrompt }),
            });
            const data = await response.json();
            setSDResponse(data.path);
        } catch (error) {
            console.error('Error fetching response from backend:', error);
        } finally {
            setIsLoadingSD(false);
        }
    };

  return (
    <Box p={2}>
        <FormControl>
            <InputLabel id="model-label">Model</InputLabel>
            <Select
                labelId="model-label"
                id="model-label"
                value={model}
                label="Model"
                onChange={handleModelChange}
                style={{ marginBottom: '10px' }}
            >
                <MenuItem value="llama2">Llama2</MenuItem>
                <MenuItem value="mistral">Mistral</MenuItem>
                <MenuItem value="dolphin-phi">Dolphin Phi</MenuItem>
                <MenuItem value="phi">Phi-2</MenuItem>
                <MenuItem value="codellama">Code Llama</MenuItem>
                <MenuItem value="llama2-uncensored">Llama 2 Uncensored</MenuItem>
                <MenuItem value="orca-mini">Orca Mini</MenuItem>
            </Select>
        </FormControl>
        <TextField
            label="Enter prompt..."
            variant="outlined"
            value={prompt}
            onChange={handleInputChange}
            fullWidth
        />
        <Button
            onClick={handleSubmit}
            variant="contained"
            style={{ marginTop: '10px' }}
            disabled={isLoading}
        >
            {isLoading ? 'Loading...' : 'Submit'}
        </Button>
        {response &&
            <Card>
                <CardContent>
                    <Typography>
                        Response: {response}
                    </Typography>
                </CardContent>
            </Card>
            }


        <TextField
                label="Enter Stable Diffusion prompt..."
                variant="outlined"
                value={sdPrompt}
                onChange={handleStableDiffusionInputChange}
                fullWidth
                style={{ marginTop: '20px', marginBottom: '10px' }}
            />
            <Button
                onClick={handleStableDiffusionSubmit}
                variant="contained"
                disabled={isLoadingSD}
            >
                {isLoadingSD ? 'Loading...' : 'Generate Image'}
            </Button>
            {sdResponse &&
                <Card>
                    <CardContent>
                        <Typography>
                            Generated Image:
                            <img src={sdResponse} alt="Generated" />
                        </Typography>
                    </CardContent>
                </Card>
            }
    </Box>
  );
};

export default LlamaInput;
