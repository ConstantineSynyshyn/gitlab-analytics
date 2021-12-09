// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import { GitlbabService } from "../../services/gitlab"
import { getUserEventsAnalyticsData } from "../../utils"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userName, searchStart, searchEnd } = req.body

  try {
    const userDataArray = await GitlbabService.getUser(userName)

    const userData = userDataArray[0]
    const { id: userId } = userData

    const userEvents = await GitlbabService.getUserEventsById(userId, {
      before: searchEnd,
      after: searchStart,
    })

    res.status(200).json(userEvents)
  } catch (error) {
    res.status(500).json({ message: "Service Error", error })
  }
}

export default handler
