const handleInputChange = (hook: (newValue: string) => void) => {
  return (updateEvent: React.ChangeEvent<HTMLInputElement>) => {
    hook(updateEvent.currentTarget.value);
  };
};

const handleCheckoxChange = (hook: (newValue: boolean) => void) => {
  return (updateEvent: React.ChangeEvent<HTMLInputElement>) => {
    hook(updateEvent.currentTarget.checked);
  };
};

export { handleInputChange, handleCheckoxChange };
