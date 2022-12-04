const expect = require('chai').expect

const {Builder, By, until} = require('selenium-webdriver');
const {NoSuchElementError} = require('selenium-webdriver/lib/error');


describe('Language Component', function() {
   this.timeout(60000);
   it('should initialize', async function() {
      await runWithDriver(async function (driver) {
         await driver.get('http://localhost:3000/local');
         function lang() {
            const scene = document.querySelector('a-scene').systems['language'];
            return JSON.stringify(scene);
         }
         const scene = await driver.executeScript(lang);
         console.log(scene);

      });

   })
});
async function runWithDriver(test) {
   let driver = await new Builder().forBrowser('chrome').build();
   //chai.use(chaiWebdriverExec(driver))
   try {
      await test(driver);
   } finally {
      await driver.quit();
   }
}