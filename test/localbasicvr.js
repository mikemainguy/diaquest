const expect = require("chai").expect;
const fs = require('fs');

//const chaiWebdriverExec = require("chai-webdriver-exec");
const {Builder, By, until} = require('selenium-webdriver');

describe('Local VR', function () {
    // Browser based tests tend to exceed the default timeout
    // Set a longer timeout here which will be applied to all the tests:
    this.timeout(60000);

    describe('Has rig', function () {

        describe('Located at', function () {
            it('0 0 2', async function () {

                await runWithDriver(async function (driver) {
                    await driver
                        .get('http://localhost:3000/local');

                    await driver
                        .wait(until
                            .elementLocated(By.css('.rig')));
                    function func() {
                        return JSON.stringify(
                            document
                                .querySelector('.rig')
                                .getAttribute('position'))
                    }

                    const pos = await driver.executeScript(func);
                    expect(pos).to.eq('{"x":0,"y":0,"z":2}');
                    function bbutton() {
                        const rhand = document.querySelector('#right-hand');
                        rhand.setAttribute('visible', true);
                        //rhand.setAttribute('position', '0 0 -1');
                        //rhand.setAttribute('rotation', '-90 0 0');
                        rhand.emit('bbuttondown');
                    }
                    await driver.executeScript(bbutton);
                    const shot = await driver.takeScreenshot();
                    const buff = new Buffer(shot, 'base64');
                    fs.writeFile('./file.png', buff, err => {
                       if (err) {
                           console.error(err);
                       }
                    });



                });
            });
        });
        describe('with two', function () {
            it('hands', async function () {

                await runWithDriver(async function (driver) {
                    await driver
                        .get('http://localhost:3000/local');
                    await driver
                        .wait(until
                            .elementLocated(By.css('.rig #right-hand')));
                    await driver
                        .wait(until
                            .elementLocated(By.css('.rig #left-hand')));

                });
            });
        });
        /* describe('Local Playground Link', function () {
            it('Navigates to /local', async function () {
                await runWithDriver(async function (driver) {
                    await driver.get('http://localhost:3000');
                    await driver.findElement(By.linkText('Local Playground')).click();
                    await driver.wait(until.urlIs('http://localhost:3000/local'));
                });
            });
        }); */
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