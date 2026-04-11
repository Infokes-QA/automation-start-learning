// Generated from: tests\features\CreatePasien.feature
import { test } from "../../../fixtures/pages.fixture.ts";

test.describe('Create Data Pasien', () => {

  test.beforeEach('Background', async ({ Given, And, page, pages }, testInfo) => { if (testInfo.error) return;
    await Given('the user is logged in to eClinic', null, { page, pages }); 
    await And('the user is on the create patient page', null, { page, pages }); 
  });
  
  test.describe('create a new patient based on gender', () => {

    test('Example #1', { tag: ['@task'] }, async ({ When, Then, And, page, pages, testContext }) => { 
      await When('the user fills in patient form with random data for \'LAKI-LAKI\'', null, { page, pages, testContext }); 
      await And('the user saves the patient data', null, { page, pages }); 
      await Then('the user should verify that the patient\'s data are displayed correctly in the index', null, { page, pages, testContext }); 
    });

    test('Example #2', { tag: ['@task'] }, async ({ When, Then, And, page, pages, testContext }) => { 
      await When('the user fills in patient form with random data for \'PEREMPUAN\'', null, { page, pages, testContext }); 
      await And('the user saves the patient data', null, { page, pages }); 
      await Then('the user should verify that the patient\'s data are displayed correctly in the index', null, { page, pages, testContext }); 
    });

  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('tests\\features\\CreatePasien.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":13,"pickleLine":15,"tags":["@task"],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given the user is logged in to eClinic","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And the user is on the create patient page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"When the user fills in patient form with random data for 'LAKI-LAKI'","stepMatchArguments":[{"group":{"start":52,"value":"'LAKI-LAKI'","children":[{"children":[{"children":[]}]},{"start":53,"value":"LAKI-LAKI","children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":15,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"And the user saves the patient data","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then the user should verify that the patient's data are displayed correctly in the index","stepMatchArguments":[]}]},
  {"pwTestLine":19,"pickleLine":16,"tags":["@task"],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given the user is logged in to eClinic","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And the user is on the create patient page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":20,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"When the user fills in patient form with random data for 'PEREMPUAN'","stepMatchArguments":[{"group":{"start":52,"value":"'PEREMPUAN'","children":[{"children":[{"children":[]}]},{"start":53,"value":"PEREMPUAN","children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":21,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"And the user saves the patient data","stepMatchArguments":[]},{"pwStepLine":22,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then the user should verify that the patient's data are displayed correctly in the index","stepMatchArguments":[]}]},
]; // bdd-data-end