// 設定抓取的位置
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const users = []
const list = JSON.parse(localStorage.getItem('VIPmembers')) || []

const dataPanel = document.querySelector('#data-panel')

// Render user-list
// axios
//   .get(INDEX_URL)
//   .then((Response) => {
//     users.push(...Response.data.results)
//     renderUser(users)
//   })
//   .catch((err) => console.log(err))

renderUser(list)

function renderUser(data) {
  let rawHTML = ""
  data.forEach(item => {
    rawHTML += `<div class="col-3">
        <div class="mb-2">
          <div class="card mambership-card">

            <img class="img" data-id ="${item.id}" data-bs-toggle="modal" data-bs-target="#userModal" src="${item.avatar}" class="card-img-top" alt="user-img">
            
            <button id="btn${item.id}" class="btn btn-remove" data-id ="${item.id}">X</button>

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
    getUserInfo(event.target.dataset.id)
  } else if (event.target.matches('.btn-remove')) {
    removeVIP(Number(event.target.dataset.id))
  }
})

// 在modal顯示顯示資訊
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

function removeVIP(id) {
  const listIndex = list.findIndex((user) => user.id === id)
  list.splice(listIndex, 1)
  localStorage.setItem('VIPmembers', JSON.stringify(list))
  renderUser(list)
}
