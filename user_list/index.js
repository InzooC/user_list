// 設定抓取的位置
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const dataPanel = document.querySelector('#data-panel')
const users = []
const list = JSON.parse(localStorage.getItem('VIPmembers')) || []

// Render user-list
axios
  .get(INDEX_URL)
  .then((Response) => {
    users.push(...Response.data.results)
    renderUser(users)
  })
  .catch((err) => console.log('err'))

function renderUser(data) {
  let rawHTML = ""
  data.forEach(item => {
    rawHTML += `<div class="col-3">
        <div class="mb-2">
          <div class="card mambership-card">
            <img class="img" data-id ="${item.id}" data-bs-toggle="modal" data-bs-target="#userModal" src="${item.avatar}" class="card-img-top" alt="user-img">
            `
    if (list.some((user) => user.id === item.id)) {
      rawHTML +=
        `<button id="btn${item.id}" class="btn btn-add-vip isVIP btn${item.id}" data-id ="${item.id}">VIP</button>`
    } else {
      rawHTML +=
        `<button id="btn${item.id}" class="btn btn-add-vip btn${item.id}" data-id ="${item.id}">VIP</button>`
    }

    rawHTML += `
            <div class="card-body">
              <p class="card-text">${item.name} ${item.surname}</p>
            </div>
          </div>
        </div>
      </div>
  `
  });
  dataPanel.innerHTML = rawHTML
}


// 在圖片上設定監聽器，點擊後啟動抓資訊的function
dataPanel.addEventListener('click', function clickOnPanel(event) {
  if (event.target.matches('.img')) {
    getUserInfo(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-vip')) {
    setVIP(Number(event.target.dataset.id))
    buttontoggle(Number(event.target.dataset.id))
  }

})


function getUserInfo(id) {
  const userModalTitle = document.querySelector('#userModalTitle')
  const userImg = document.querySelector('#userImg')
  const userInfo = document.querySelector('#userInfo')
  let rawInfoText = ""
  axios
    .get(INDEX_URL + id)
    .then((Response) => {
      let data = Response.data
      userModalTitle.innerText = `${data.name} ${data.surname}`
      userImg.src = data.avatar
      rawInfoText = `
      Age: ${data.age}
      gender: ${data.gender}
      birthday: ${data.birthday}
      email: ${data.email}
      `
      userInfo.innerText = rawInfoText
    })
    .catch((err) => console.log(err))

}

// 點擊到VIP btn，如果已在local storage中，如果已在其中就刪掉。如果沒有，就把user資料放到 local storage 儲存起來
function setVIP(id) {
  const user = users.find((user) => user.id === id)
  if (list.some((user) => user.id === id)) {
    // 刪除list中的user
    const userIndex = list.findIndex((user) => user.id === id)
    list.splice(userIndex, 1)
    localStorage.setItem('VIPmembers', JSON.stringify(list))
    return alert('已取消此人VIP會員！')
  } else {
    list.push(user)
    localStorage.setItem('VIPmembers', JSON.stringify(list))
    return alert('已成功將此人設定為VIP會員！')
  }
}

function buttontoggle(id) {
  let btn = document.querySelector(`.btn${id}`)
  btn.classList.toggle('isVIP')
}