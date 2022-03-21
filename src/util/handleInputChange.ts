const handleInputChange = (hook: (newValue: string) => void) => {
  return (updateEvent: React.ChangeEvent<HTMLInputElement>) => {
    hook(updateEvent.currentTarget.value);
  };
};

export default handleInputChange;
