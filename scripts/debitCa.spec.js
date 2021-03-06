// Generated by Selenium IDE
const { BootCtf} = require('./bootctf.js');
const { By } = require('selenium-webdriver')
const dossier = process.env.npm_config_dossier;
const username = process.env.npm_config_username;
const password = process.env.npm_config_password;
const assert = require('assert')

describe('DebitCa', function() {
  this.timeout(900000)
  let driver
  let vars

  beforeEach(async function () {
    vars = {}
    driver = await BootCtf.create()
  })

  afterEach(async function () {
    await driver.quit();
  })

  it('DebitCa', async function() {


    await BootCtf.login(driver, vars, username, password)

    await BootCtf.openAppraisalFee(driver, vars, dossier)

    driver.executeScript("document.getElementById('debitCA').disabled = false")
    driver.executeScript("document.getElementById('debitCA').checked = false")

    await driver.findElement(By.id("startDebit")).click()
    vars["W_ERR"] = await BootCtf.waitForWindow(driver, vars, 2000)
    await driver.switchTo().window(vars["W_ERR"])
    html = await driver.findElement(By.css("html"))//.click()
    txt = await html.getText()
    console.log("html txt", txt = txt.replace(/(\r\n|\n|\r)/gm, ""))
    html.click()
    vars["var"] = await driver.findElements(By.xpath("//div[contains(.,'Debit Error - The C/A of the Customer has not been debited ')]")).length
    console.log("ESITO", (txt === 'Debit Error - The C/A of the Customer has not been debited '))
  })
})
