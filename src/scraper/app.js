const puppeteer = require('puppeteer')
const WebSocketServer = require('ws').Server

const wss = new WebSocketServer({ port: 5000 })

var wsList = []
var data = []

wss.on('connection', ws => {
  wsList.push(ws)

  if (data.length) {
    ws.send(`${JSON.stringify(data)}`)
  }
})

/**
 * Иницилизирует скрапер.
 */

let scrape = async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  const mutationFlag = '__mutation__'

  try {
    await page.goto('https://demoserver.dev/#/')
    await page.waitForSelector('.event')

    page.on('console', async (msg) => {
      if (msg._text.startsWith(mutationFlag)) {
        let json = msg._text.substr(mutationFlag.length)

        data = JSON.parse(json)
        wsList = wsList.map(ws => {
          try {
            ws.send(`${JSON.stringify(data)}`)
            return ws
          } catch (e) {
            return null
          }
        }).filter(e => e !== null)
      }
    })

    /**
       * Создание MutationObserver и отслеживание изменяемых значений.
       */
    await page.evaluate(_mutationFlag => {
      let data = []

      const observer = new MutationObserver(
        function () {
          let elements = document.querySelectorAll('.event')
          let newData = []

          for (const element of elements) {
            let title = element.querySelector('.event-title')
            let eventData = element.querySelectorAll('.event-dataset')
            let formData = []

            for (const event of eventData) {
              let eventDataset = []
              let setData = event.querySelectorAll('.dataset-value')

              for (const set of setData) {
                if (parseInt(set.innerText) !== null) {
                  eventDataset.push(parseInt(set.innerText))
                } else {
                  eventDataset.push(-1)
                }
              }

              formData.push(eventDataset)
            }

            newData.push({
              title: {
                time: title.querySelectorAll('span')[0].innerText,
                name1: title.querySelectorAll('span')[1].innerText,
                name2: title.querySelectorAll('span')[2].innerText,
                code: title.querySelectorAll('span')[3].innerText
              },
              data: formData
            })
          }

          if (JSON.stringify(data) !== JSON.stringify(newData)) {
            data = newData
            console.log(`${_mutationFlag}${JSON.stringify(data)}`)
          }
        }
      )
      const config = {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true
      }

      observer.observe(document.querySelector('.main-data'), config)
    }, mutationFlag)
  } catch (e) {
    /**
       * Перезапуск в случае ошибки привёдшей к падению браузера.
       */
    browser.close()
    return scrape()
  }
}

scrape()
