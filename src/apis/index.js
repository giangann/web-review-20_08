import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:8000/api'

export const getAllWebsites = async () => {
  const response = await axios.get(`${BASE_URL}/websites`)
  const responses = await Promise.all(response.data.map((website) => axios.get(website.api)))

  return response.data.reduce((total, item) => {
    const data_web = responses.find(
      (res) => res.data.data.title.toLowerCase() === item.name.toLowerCase()
    )

    return [
      ...total,

      {
        ...item,
        data_api: data_web ? data_web?.data?.data : null
      }
    ]
  }, [])
}

export const getWebsite = async (id) => {
  const res = await axios.get(`${BASE_URL}/websites/show/${id}`)
  const data = await axios.get(res.data.api)

  return {
    ...res.data,
    data_api: data.data.data
  }
}

export const getDataDetail = async (slug) => {
  const res = await axios.get(`https://api.affplus.com/v1/entity/${slug}`)

  return res.data.data
}

export const getApiResource = async (name) => {
  const res = await axios.get(`${BASE_URL}/${name}`)
  return res.data
}

export const getListComments = async (id, page, per_page = 10) => {
  const res = await axios.get(`${BASE_URL}/reviews`, {
    params: { websiteId: id, page, per_page }
  })
  return res.data
}

export const getTop10Networks = async () => {
  const res = await axios.get(`${BASE_URL}/websites/top-10`)

  return res.data
}

export const getRecentReviews = async () => {
  const res = await axios.get(`${BASE_URL}/reviews/recent`)

  return res.data.data
}

export const login = async (url, data) => {
  const res = await axios.post(`${BASE_URL}/${url}`, data)
  return res
}

export const loginWithGG = async (url, data) => {
  const res = await axios.post(`${BASE_URL}/${url}`, data)
  return res
}

export const getGoogleLoginUrl = async (name) => {
  const res = await axios.get(`${BASE_URL}/${name}`)
  return res.data
}

export const addNetWork = async (data) => {
  const res = await axios.post(`${BASE_URL}/websites`, data)
  return res
}