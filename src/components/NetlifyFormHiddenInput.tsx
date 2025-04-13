
import React from 'react';

interface NetlifyFormHiddenInputProps {
  formName: string;
}

const NetlifyFormHiddenInput: React.FC<NetlifyFormHiddenInputProps> = ({ formName }) => {
  return (
    <>
      <input type="hidden" name="form-name" value={formName} />
      <div className="hidden">
        <label>
          Don't fill this out if you're human: <input name="bot-field" />
        </label>
      </div>
    </>
  );
};

export default NetlifyFormHiddenInput;
