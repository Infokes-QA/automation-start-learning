const { Before } = require('@cucumber/cucumber')
const loginPage = require('../pages/login.page')

Before({ tags: "@doctor" }, async () => {
  await loginPage.login("username", "password");
})