export function getUserEventsAnalyticsData(userEvents) {
  const result = {
    commits: 0,
    comments: 0,
  }
  for (const event of userEvents) {
    if (event.action_name.includes("pushed")) {
      result.commits = result.commits + event.push_data.commit_count
    }
    if (event.action_name.includes("commented")) {
      result.comments++
    }
  }
  return result
}
