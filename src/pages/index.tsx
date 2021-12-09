import type { NextPage } from "next"
import React, { useState } from "react"
import { API_ROUTES } from "../constants/apiRoutes"
import { getUserEventsAnalyticsData } from "../utils"

const Home: NextPage = () => {
  const [usersData, setUsersData] = useState([])
  const [userTitles, setUserTitles] = useState<string[]>([])

  const onSubmitHandler = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = new FormData(e.target as HTMLFormElement)
    const userName = form.get("username")

    if (userTitles.includes(userName as string)) return
    const searchStart = form.get("search-start")
    const searchEnd = form.get("search-end")

    const query = {
      userName,
      searchStart,
      searchEnd,
    }

    const response = await fetch(API_ROUTES.userEvents, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(query),
    })

    const userEventsData = await response.json()

    setUserTitles((prevUsersTitles) => {
      return [...prevUsersTitles, userName]
    })

    setUsersData((prevUserData) => {
      const { commits, comments } = getUserEventsAnalyticsData(userEventsData)
      return [...prevUserData, [userName, commits, comments]]
    })
  }

  const onDownloadClick = () => {
    let csvContent =
      "data:text/csv;charset=utf-8," +
      usersData.map((item: string[]) => item.join(",")).join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "users.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  debugger
  return (
    <div>
      <form className="" action="submit" onSubmit={onSubmitHandler}>
        <label htmlFor="start">User email adress or gitlab username:</label>
        <input type="text" name="username" />

        <label htmlFor="start">Start date:</label>
        <input
          type="date"
          id="start"
          name="search-start"
          defaultValue={
            new Date(new Date().setFullYear(new Date().getFullYear() - 1))
              .toISOString()
              .split("T")[0]
          }
          min={
            new Date(new Date().setFullYear(new Date().getFullYear() - 1))
              .toISOString()
              .split("T")[0]
          }
          max={new Date().toISOString().split("T")[0]}
        ></input>

        <label htmlFor="end">End date:</label>
        <input
          type="date"
          id="end"
          name="search-end"
          defaultValue={new Date().toISOString().split("T")[0]}
          min={
            new Date(new Date().setFullYear(new Date().getFullYear() - 1))
              .toISOString()
              .split("T")[0]
          }
          max={new Date().toISOString().split("T")[0]}
        ></input>
        <button type="submit">Search</button>
      </form>
      <div>
        <button onClick={onDownloadClick}>Download XLS file</button>
      </div>
      <div>
        <ul>
          {userTitles.map((title) => (
            <li key={title}>{title}</li>
          ))}
        </ul>
      </div>
      <style></style>
    </div>
  )
}

export default Home
