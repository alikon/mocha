const { Builder, By, Key, until, Capabilities, WebElement } = require('selenium-webdriver')
const firefox = require('selenium-webdriver/firefox');
class BootCtf {
  
  static async create() {
    //npm run test --dossier=867673 --username=20403680 --password=123457
    let options = new firefox.Options().setPreference('security.tls.version.min', 1);
    let driver = await new Builder().forBrowser('firefox')
      .setFirefoxOptions(options)
      .withCapabilities(Capabilities.firefox().set("acceptInsecureCerts", true))
      .build()
      return driver
  }

  static async wait(millis) {
    let promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve("Hello World!"), millis)
    });
    let result = await promise;
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

  static async debugWin(driver, txt, second) {
    driver.executeScript("window.open('', '" + txt + "', 'width=200,height=100')")
    await driver.sleep(second * 1000)
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

  static async focusOnWindows(win, vars) {
    await driver.switchTo().window(vars[win])
  }

  static async login(driver, vars, username, password) {
      console.log("start login")
      await driver.get("https://172.21.160.241/eflow/LoginServlet")
      await driver.sleep(3000)
      await driver.findElement(By.id("txtUID")).sendKeys(username)
      await driver.findElement(By.id("txtPsw")).sendKeys(password)
      vars["windowHandles"] = await driver.getAllWindowHandles()
      await driver.findElement(By.id("cmdConferma")).click()
      vars["W_ROOT"] = await BootCtf.waitForWindow(driver, vars, 10000)
      vars["W_LOGIN"] = await driver.getWindowHandle()
      await driver.switchTo().window(vars["W_ROOT"])
      console.log("end login")
      
  }

  static async openDetailsDossier(driver, vars, dossier) {
    console.log("start openDetailsDossier")
    await BootCtf.openWorkingTasks(driver, vars, dossier)
    await BootCtf.searchDossier(driver, vars, dossier)
    await BootCtf.gotoCtfDom(driver, vars)
    driver.switchTo().frame(2) // frame name = MainForm    
    driver.switchTo().frame(0) // frame id = Lista
    let elemchild = await driver.findElement(By.css("td:nth-child(2)"))//.click()
    elemchild.click()
    await driver.sleep(8000)
    driver.switchTo().parentFrame()
    driver.switchTo().frame(1); // frame name = BODY
    console.log("end openDetailsDossier")
  }

  static async openAppraisalFee(driver, vars, dossier) {
    console.log("start openAppraisalFee")
    await BootCtf.openWorkingTasks(driver, vars, dossier)
    await BootCtf.searchDossier(driver, vars, dossier)
    await BootCtf.gotoCtfDom(driver, vars)
    driver.switchTo().frame(1) // frame name = MainBar    
    await driver.findElement(By.linkText("Appraisal Fee")).click()
    await driver.sleep(3000)
    await BootCtf.gotoCtfDom(driver, vars)
    driver.switchTo().frame(2) // frame name = MainForm
    console.log("end openAppraisalFee")
  }

  static async openWorkingTasks(driver, vars, dossier) {
    console.log("start openWorkingTasks")
    await driver.switchTo().window(vars["W_ROOT"])
    driver.switchTo().defaultContent()
    await driver.findElement(By.id("header")).click();
    // 18 | sendKeys | id=menuSearch | ${KEY_DOWN}
    await driver.findElement(By.id("menuSearch")).click();
    // 19 | sendKeys | id=menuSearch | ${KEY_ENTER}
    await driver.findElement(By.id("menuSearch")).sendKeys("Working");
    await driver.sleep(1000);
    await driver.findElement(By.id("menuSearch")).sendKeys(Key.DOWN);
    await driver.findElement(By.id("menuSearch")).sendKeys(Key.ENTER);
    await driver.sleep(8000);
    console.log("end openWorkingTasks")
  }

  static async searchDossier(driver, vars, dossier) {
    console.log("start searchDossier")
    await driver.switchTo().window(vars["W_ROOT"])
    driver.switchTo().defaultContent()
    await driver.switchTo().frame(1)
    await driver.switchTo().frame(1)
    await driver.switchTo().frame(1)
    await driver.findElement(By.xpath("//img[@title=\'Search Dossier\']")).click()
    await driver.sleep(8000)
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
    console.log("end searchDossier")
  }

  static async gotoCtfDom(driver, vars) {
    console.log("start gotoCtfDom")
    await driver.switchTo().window(vars["W_ROOT"])
    await driver.switchTo().defaultContent()
    await driver.sleep(2000)
    let frBody = await driver.findElement(By.id("frBody"));
    driver.switchTo().frame(frBody);
    let elem = await driver.findElements(By.tagName("iframe"))
    let elem2 = await driver.findElements(By.tagName("frame"))
    driver.switchTo().frame(1); // frame id = frMain (ctf frame)
    await driver.sleep(2000)
    console.log("end gotoCtfDom")
  }
}

module.exports.BootCtf = BootCtf;