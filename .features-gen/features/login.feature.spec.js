// Generated from: features\login.feature
import { test } from "playwright-bdd";

test.describe('Login', () => {

  test('User can login with valid credentials', async ({ Given, When, Then, And, page }) => { 
    await Given('user navigates to login page', null, { page }); 
    await When('user enters \'valid\' username and password', null, { page }); 
    await And('user clicks login button', null, { page }); 
    await Then('user will be directed to the select puskesmas page', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features\\login.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given user navigates to login page","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Action","textWithKeyword":"When user enters 'valid' username and password","stepMatchArguments":[{"group":{"start":12,"value":"'valid'","children":[{"children":[{"children":[]}]},{"start":13,"value":"valid","children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"And user clicks login button","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Outcome","textWithKeyword":"Then user will be directed to the select puskesmas page","stepMatchArguments":[]}]},
]; // bdd-data-end