export async function evaluatorAgent(state) {

  const results = state.rankedResults || [];
  const retryCount = state.retryCount || 0;

  const MIN_RESULTS = 3;
  const MIN_AVG_SCORE = 0.65;
  const MIN_TOP_SCORE = 0.70;
  const MAX_RETRIES = 3;

  let shouldRetry = false;

  // No results at all
  if (results.length === 0) {
    shouldRetry = retryCount < MAX_RETRIES;
  } else {

    const scores = results.map(
      result =>
        result.finalScore ??
        result.score ??
        0
    );

    const avgScore =
      scores.reduce(
        (sum, score) => sum + score,
        0
      ) / scores.length;

    const topScore = scores[0];

    const insufficientResults =
      results.length < MIN_RESULTS;

    const poorQuality =
      avgScore < MIN_AVG_SCORE;

    const weakTopMatch =
      topScore < MIN_TOP_SCORE;

    if (
      (insufficientResults ||
       poorQuality ||
       weakTopMatch) &&
      retryCount < MAX_RETRIES
    ) {
      shouldRetry = true;
    }

    console.log("Evaluation Metrics:");
    console.log("Results:", results.length);
    console.log("Average Score:", avgScore.toFixed(3));
    console.log("Top Score:", topScore.toFixed(3));
    console.log("Should Retry:", shouldRetry);
  }

  return {
    ...state,
    shouldRetry
  };
}