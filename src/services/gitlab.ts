import { getAuthorizationHeader } from "./utils"

export const GitlbabService = {
  async getUserEventsById(
    userName: string,
    options: {
      page?: number
      perPage?: number
      after?: string
      before?: string
    }
  ) {
    const { page = 1, perPage = 300, after = "", before = "" } = options
    const response = await fetch(
      `${process.env.LPD_GITLAB_API}/users/${userName}/events?&after=${after}&before=${before}&per_page=${perPage}`,
      {
        headers: {
          Authorization: getAuthorizationHeader(process.env.LPD_GITLAB_TOKEN!),
        },
      }
    )

    const userEventsData = await response.json()

    return userEventsData
  },

  async getUser(userName: string) {
    const response = await fetch(
      `${process.env.LPD_GITLAB_API}/users/?username=${userName}`,
      {
        headers: {
          Authorization: getAuthorizationHeader(process.env.LPD_GITLAB_TOKEN!),
        },
      }
    )

    const userData = await response.json()

    return userData
  },
}
