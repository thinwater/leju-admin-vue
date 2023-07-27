// const data = [
//   {
//     date: '2023-06-01',
//     order: 50,
//     returnOrder: 2
//   },
//   {
//     date: '2023-06-02',
//     order: 50,
//     returnOrder: 2
//   },
//   {
//     date: '2023-06-03',
//     order: 50,
//     returnOrder: 2
//   }
// ]

let data = []

export function getOrderData() {
  data = []
  for (let i = 1; i < 31; i++) {
    data.push({
      date: `2023-06-${i < 10 ? '0' + i : i}`,
      order: getRandomData(50, 200),
      returnOrder: getRandomData(5, 45)
    })
  }
  return data
}

function getRandomData(min, max) {
  const chooseNum = max - min
  return Math.floor(Math.random() * chooseNum + 1) + min
}

console.log(getOrderData())
