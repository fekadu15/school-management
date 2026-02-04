export const scoreToPoint = (score) => {
  if (score >= 90) return 4.0;
  if (score >= 80) return 3.0;
  if (score >= 70) return 2.0;
  if (score >= 60) return 1.0;
  return 0.0;
};

export const calculateGPA = (grades) => {
  if (grades.length === 0) return 0;

  const totalPoints = grades.reduce((sum, grade) => {
    return sum + scoreToPoint(Number(grade.score));
  }, 0);

  return Number((totalPoints / grades.length).toFixed(2));
};
