export const secondsToYears = (seconds: number ) => {
    const daysPerYear = 365;
    const secondsPerYear = daysPerYear * 24 * 60 * 60;
    return (seconds / secondsPerYear).toFixed(0);
  };