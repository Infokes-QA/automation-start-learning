// Generated from: tests\features\Login.feature
import { test } from "../../../fixtures/pages.fixture.ts";

test.describe('Login', () => {

  test('User can login with valid credentials', async ({ Given, When, Then, And, page, pages }) => { 
    await Given('user navigates to login page', null, { page, pages }); 
    await When('user selects "nama klinik" as facility', null, { pages }); 
    await And('user enters "username" as username', null, { pages }); 
    await And('user enters "password" as password', null, { pages }); 
    await And('user clicks the login button', null, { page, pages }); 
    await Then('user should be redirected to the dashboard page', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('tests\\features\\Login.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given user navigates to login page","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Action","textWithKeyword":"When user selects \"nama klinik\" as facility","stepMatchArguments":[{"group":{"start":13,"value":"\"nama klinik\"","children":[{"start":14,"value":"nama klinik","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"And user enters \"username\" as username","stepMatchArguments":[{"group":{"start":12,"value":"\"username\"","children":[{"start":13,"value":"username","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And user enters \"password\" as password","stepMatchArguments":[{"group":{"start":12,"value":"\"password\"","children":[{"start":13,"value":"password","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"And user clicks the login button","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then user should be redirected to the dashboard page","stepMatchArguments":[]}]},
]; // bdd-data-end