const { Builder, By, Key, until } = require('selenium-webdriver');
var assert = require('assert');
const { env } = require('process');
// check if pass when all required fields exist
describe('Contact us Form', () => {

  it('should pass when all fields exist', async () => {

    let driver = await new Builder().forBrowser('chrome').build();
    var firstName = "Omran";
    var lastName = "Omran";
    var company = "simple[A]";
    var message = "test message";
    var phone = "+9639919022";
    var email = "oo@simplea.com";
    var website = 'http://test.com/'

    return new Promise(async function (resolve, reject) {
      try {
        await driver.get("http://localhost:3000/contactus");

        await driver.findElement(By.name('firstName')).sendKeys(firstName);
        await driver.findElement(By.name('email')).sendKeys(email);
        await driver.findElement(By.name('website')).sendKeys(website);
        await driver.findElement(By.name('phone')).sendKeys(phone);
        await driver.findElement(By.name('lastName')).sendKeys(lastName);
        await driver.findElement(By.name('company')).sendKeys(company);
        await driver.findElement(By.name('message')).sendKeys(message);
        await driver.findElement(By.name('agreeToPP')).click();
        await driver.findElement(By.id('submitMainContactForm')).click()


        driver.wait(until.urlIs('http://localhost:3000/index')).then(() => {
          resolve();

        }).catch(() => { reject(); });

      }

      catch (exc) {
        console.log("Exception:", exc)

        reject()
      }


    })


  })
})
//check if submit fail if email doesnt exist
describe('Contact us Form', () => {

  it("shouldn't submit when  email is missing", async () => {


    let driver = await new Builder().forBrowser('chrome').build();
    var firstName = "Omran";
    var lastName = "Omran";
    var company = "simple[A]";
    var message = "test message";
    var phone = "+9639919022";
    var email = "oo@simplea.com";
    var website = 'http://test.com/'
    return new Promise(async function (resolve, reject) {
      try {
        await driver.get("http://localhost:3000/contactus");

        await driver.findElement(By.name('firstName')).sendKeys(firstName);
        await driver.findElement(By.name('website')).sendKeys(website);
        await driver.findElement(By.name('phone')).sendKeys(phone);
        await driver.findElement(By.name('lastName')).sendKeys(lastName);
        await driver.findElement(By.name('company')).sendKeys(company);
        await driver.findElement(By.name('message')).sendKeys(message);
        await driver.findElement(By.name('agreeToPP')).click();
        await driver.findElement(By.id('submitMainContactForm')).click()


        driver.findElement(By.className("error-text")).then(() => {
          resolve();
        }).catch(() => { reject(); });

      }

      catch (exc) {
        console.log("Exception:", exc)

        reject()
      }


    })


  })
})