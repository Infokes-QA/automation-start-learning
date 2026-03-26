// Generated from: tests\features\Login.feature
import { test } from "../../../fixtures/pages.fixture.ts";

test.describe('Login', () => {

  test('User can login with valid credentials', async ({ Given, When, Then, And, page, pages }) => { 
    await Given('user navigates to login page', null, { page, pages }); 
    await When('user selects "klinik" as facility', null, { pages }); 
    await And('user enters "test" as username', null, { pages }); 
    await And('user enters "env" as password', null, { pages }); 
    await Then('user clicks the login button', null, { page, pages }); 
    await And('user should be redirected to the dashboard page', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('tests\\features\\Login.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given user navigates to login page","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Action","textWithKeyword":"When user selects \"klinik\" as facility","stepMatchArguments":[{"group":{"start":13,"value":"\"klinik\"","children":[{"start":14,"value":"klinik","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"And user enters \"test\" as username","stepMatchArguments":[{"group":{"start":12,"value":"\"test\"","children":[{"start":13,"value":"test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"And user enters \"env\" as password","stepMatchArguments":[{"group":{"start":12,"value":"\"env\"","children":[{"start":13,"value":"env","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":8,"keywordType":"Outcome","textWithKeyword":"Then user clicks the login button","stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"And user should be redirected to the dashboard page","stepMatchArguments":[]}]},
]; // bdd-data-end