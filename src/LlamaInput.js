import React, { useState } from 'react';
import { TextField, Button, Box, Card, CardContent, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import ollama from 'ollama';

const LlamaInput = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState('llama2');

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
    </Box>
  );
};

export default LlamaInput;
