//const chaiWebdriverExec = require('chai-webdriver-exec')
//const chai = require('chai');


const expect = require('chai').expect

const {Builder, By, until} = require('selenium-webdriver');
const {NoSuchElementError} = require('selenium-webdriver/lib/error');

describe('Landing Page', function () {
    // Browser based tests tend to exceed the default timeout
    // Set a longer timeout here which will be applied to all the tests:
    this.timeout(10000);

    describe('Initial Landing Page', function () {

        describe('Title', function () {
            it('should be Immersive Idea Alpha', async function () {

                await runWithDriver(async function (driver) {
                    await driver.get('http://localhost:3000');
                    const title = await driver.getTitle();
                    expect(title).to.contain("Immersive Idea Alpha");
                });
            });
        });
        describe('Local Playground Link', function () {
            it('Navigates to /local', async function () {
                await runWithDriver(async function (driver) {
                    await driver.get('http://localhost:3000');
                    await driver.findElement(By.linkText('Local Playground')).click();
                    await driver.wait(until.urlIs('http://localhost:3000/local'));
                });
            });
        });
    });
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