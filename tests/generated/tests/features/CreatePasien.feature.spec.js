// Generated from: tests\features\CreatePasien.feature
import { test } from "../../../fixtures/pages.fixture.ts";

test.describe('Create Data Pasien', () => {

  test.beforeEach('Background', async ({ Given, And, page, pages }, testInfo) => { if (testInfo.error) return;
    await Given('the User is logged in', null, { page, pages }); 
    await And('the User is on the Create Pasien page', null, { page, pages }); 
  });
  
  test.describe('create a new patient based on gender', () => {

    test('Example #1', { tag: ['@task'] }, async ({ When, Then, And, page, pages, testContext }) => { 
      await When('the User fills in patient profile with random data for \'LAKI-LAKI\'', null, { page, pages, testContext }); 
      await And('the User saves the patient data', null, { page, pages }); 
      await Then('user should see the patient listed in the patient index', null, { page, pages, testContext }); 
    });

    test('Example #2', { tag: ['@task'] }, async ({ When, Then, And, page, pages, testContext }) => { 
      await When('the User fills in patient profile with random data for \'PEREMPUAN\'', null, { page, pages, testContext }); 
      await And('the User saves the patient data', null, { page, pages }); 
      await Then('user should see the patient listed in the patient index', null, { page, pages, testContext }); 
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
  {"pwTestLine":13,"pickleLine":15,"tags":["@task"],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given the User is logged in","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And the User is on the Create Pasien page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"When the User fills in patient profile with random data for 'LAKI-LAKI'","stepMatchArguments":[{"group":{"start":55,"value":"'LAKI-LAKI'","children":[{"children":[{"children":[]}]},{"start":56,"value":"LAKI-LAKI","children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":15,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"And the User saves the patient data","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then user should see the patient listed in the patient index","stepMatchArguments":[]}]},
  {"pwTestLine":19,"pickleLine":16,"tags":["@task"],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given the User is logged in","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Context","textWithKeyword":"And the User is on the Create Pasien page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":20,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"When the User fills in patient profile with random data for 'PEREMPUAN'","stepMatchArguments":[{"group":{"start":55,"value":"'PEREMPUAN'","children":[{"children":[{"children":[]}]},{"start":56,"value":"PEREMPUAN","children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":21,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"And the User saves the patient data","stepMatchArguments":[]},{"pwStepLine":22,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"Then user should see the patient listed in the patient index","stepMatchArguments":[]}]},
]; // bdd-data-end