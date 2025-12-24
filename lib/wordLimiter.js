const limitWords = (text, maxWords) => {
  const words = text.trim().split(/\s+/);
  return words.length <= maxWords ? text : words.slice(0, maxWords).join(" ");
};

export default limitWords;