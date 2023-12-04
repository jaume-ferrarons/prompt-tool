// src/components/project/PromptForm.styles.js
import { styled } from '@mui/system';

const FormContainer = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  marginTop: '16px',
});

const Label = styled('label')({
  marginBottom: '8px',
});

const Textarea = styled('textarea')({
  resize: 'vertical',
  marginBottom: '16px',
});

const SubmitButton = styled('button')({
  alignSelf: 'flex-start',
});

export { FormContainer, Label, Textarea, SubmitButton };
