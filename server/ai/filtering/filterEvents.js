export async function filterEvents(state) {
  const now = new Date();

  let filtered = (state.events || []).filter((event) => {
    const deadline = event.metadata?.deadline;

    if (!deadline) return true;

    const parsedDate = new Date(deadline);

    if (isNaN(parsedDate.getTime())) return true;

    return parsedDate > now;
  });

  if (state.filters?.mode) {
    filtered = filtered.filter((event) => {
      return (
        event.metadata?.mode?.toLowerCase() ===
        state.filters.mode?.toLowerCase()
      );
    });
  }

  filtered.forEach((event) => {
    console.log(
      "Event:",
      event.metadata?.title,
      "| Deadline:",
      event.metadata?.deadline
    );
  });

  console.log("Filtered Events:", filtered.length);

  return {
    ...state,
    events: filtered,
  };
}