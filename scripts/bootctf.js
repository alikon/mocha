const { Builder, By, Key, until, Capabilities, WebElement } = require('selenium-webdriver')
const firefox = require('selenium-webdriver/firefox');
class BootCtf {
  
  static async create() {
    let options = new firefox.Options().setPreference('security.tls.version.min', 1);
    let driver = await new Builder().forBrowser('firefox')
      .setFirefoxOptions(options)
      .withCapabilities(Capabilities.firefox().set("acceptInsecureCerts", true))
      .build()
      return driver
  }

  static async waitForWindow(driver, vars, timeout = 2) {
    await driver.sleep(timeout)
    const handlesThen = vars["windowHandles"]
    const handlesNow = await driver.getAllWindowHandles()
    if (handlesNow.length > handlesThen.length) {
      return handlesNow.find(handle => (!handlesThen.includes(handle)))
    }
    throw new Error("New window did not appear before timeout")
  }

  static async logElements(elem, logTrace, second) {
    for (let i = 0; i < elem.length; i++) {
      el = elem[i]
      logTrace_ = logTrace + "[" + i + "]"
      //console.log(logTrace_ , el)
      id = await el.getAttribute("id")
      name_ = await el.getAttribute("name")
      console.log(logTrace_ + " Id", id)
      console.log(logTrace_ + " Name", name_)
      console.log("_________________________________________")
    }
    await wait(second * 1000)
  }

  static async login(driver, vars, username, password) {

      await driver.get("https://172.21.160.241/eflow/LoginServlet")
      await driver.sleep(3000)
      await driver.findElement(By.id("txtUID")).sendKeys(username)
      await driver.findElement(By.id("txtPsw")).sendKeys(password)
      vars["windowHandles"] = await driver.getAllWindowHandles()
      await driver.findElement(By.id("cmdConferma")).click()
      vars["win9803"] = await BootCtf.waitForWindow(driver, vars, 5000)
      vars["root"] = await driver.getWindowHandle()
      await driver.switchTo().window(vars["win9803"])
      await driver.sleep(5000)
      
  }

  static async openDossier(driver, vars, dossier) {
    await driver.findElement(By.id("header")).click();
    // 18 | sendKeys | id=menuSearch | ${KEY_DOWN}
    await driver.findElement(By.id("menuSearch")).click();
    // 19 | sendKeys | id=menuSearch | ${KEY_ENTER}
    await driver.findElement(By.id("menuSearch")).sendKeys("Working");
    await driver.sleep(1000);
    await driver.findElement(By.id("menuSearch")).sendKeys(Key.DOWN);
    await driver.findElement(By.id("menuSearch")).sendKeys(Key.ENTER);
    await driver.sleep(8000);

    await driver.switchTo().frame(1)

    await driver.switchTo().frame(1)

    await driver.switchTo().frame(1)

    await driver.findElement(By.xpath("//img[@title=\'Search Dossier\']")).click()
    await driver.sleep(5000)

    await driver.switchTo().parentFrame()
    
    await driver.switchTo().frame(2)

    await driver.findElement(By.id("txtPratNumEsatto")).click()
    await driver.findElement(By.id("txtPratNumEsatto")).sendKeys(dossier) //867673
    //	await driver.findElement(By.id("txtPratNumEsatto")).sendKeys(dossierNumber)
    await driver.findElement(By.css("#cmdAvvio > .ui-button-text")).click()
    await driver.findElement(By.xpath("(//td[@id=\'cella\'])[4]")).click()
    await driver.findElement(By.xpath("(//td[@id=\'cella\'])[4]")).click()
    {
      const element = await driver.findElement(By.xpath("(//td[@id=\'cella\'])[4]"))
      await driver.actions({ bridge: true }).doubleClick(element).perform()
    }
    await driver.sleep(3000)
    
  }
}

module.exports.BootCtf = BootCtf;