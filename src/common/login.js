'use strict'

function getUser (def) {
  const curUrl = new URL(document.location.href)

  const user = curUrl.searchParams.get('user')
  if (!user) {
    window.location.search = '?user=' + def
  }

  return user
}

export default getUser
