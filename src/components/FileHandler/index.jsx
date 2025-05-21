import React from 'react';
import { Button } from '@mui/material';
import { FileHandlerContainer } from './styles';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const FileHandler = ({ onImport, songs }) => {
  const handleExport = () => {
    const content = JSON.stringify({ songs }, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meu_repertorio.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = JSON.parse(e.target.result);
          if (content.songs && Array.isArray(content.songs)) {
            onImport(content.songs);
          } else {
            alert('Arquivo inválido. Deve conter uma lista de músicas.');
          }
        } catch (error) {
          alert('Erro ao ler arquivo. Certifique-se que é um JSON válido.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <FileHandlerContainer direction="row" spacing={2}>
      <Button
        variant="outlined"
        component="label"
        startIcon={<FileUploadIcon />}
      >
        Importar Repertório
        <input
          type="file"
          accept=".json"
          hidden
          onChange={handleImport}
        />
      </Button>
      <Button
        variant="outlined"
        onClick={handleExport}
        startIcon={<FileDownloadIcon />}
      >
        Exportar Repertório
      </Button>
    </FileHandlerContainer>
  );
};

export default FileHandler;
