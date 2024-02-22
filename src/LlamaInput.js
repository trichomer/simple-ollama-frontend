import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import ollama from 'ollama';

const LlamaInput = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handleInputChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const result = await ollama.chat({
        model: 'llama2',
        messages: [{ role: 'user', content: prompt }],
      });
      setResponse(result.message.content);
      console.log(result.message.content);
    } catch (error) {
      console.error('Error fetching response from llama2:', error);
    }
  };

  return (
    <Box p={2}>
      <TextField
        label="Enter prompt..."
        variant="outlined"
        value={prompt}
        onChange={handleInputChange}
        fullWidth
      />
      <Button onClick={handleSubmit} variant="contained" style={{ marginTop: '10px' }}>
        Submit
      </Button>
      {response && <div><strong>Response:</strong> {response} </div>}
    </Box>
  );
};

export default LlamaInput;
