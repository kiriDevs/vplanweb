const handleInputChange = (hook: (newValue: string) => void) => {
  return (updateEvent: React.ChangeEvent<HTMLInputElement>) => {
    hook(updateEvent.currentTarget.value);
  };
};

const handleCheckboxChange = (hook: (newValue: boolean) => void) => {
  return (updateEvent: React.ChangeEvent<HTMLInputElement>) => {
    hook(updateEvent.currentTarget.checked);
  };
};

export { handleInputChange, handleCheckboxChange };
