
/**
 * Copyright 2020 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Follow the instructions in uppercase/README.md for running these tests.
// Visit https://firebase.google.com/docs/functions/unit-testing to learn more
// about using the `firebase-functions-test` SDK.

// Chai is a commonly used library for creating unit test suites. It is easily extended with plugins.
const chai = require('chai');
const assert = chai.assert;
// Sinon is a library used for mocking or verifying function calls in JavaScript.

const admin = require('firebase-admin');
// Require and initialize firebase-functions-test in "online mode" with your project's
// credentials and service account key.
const projectConfig = {
  projectId: 'test-8ea8f',
  databaseURL: 'https://test-8ea8f.firebaseio.com'
};
const test = require('firebase-functions-test')(projectConfig, 'C:/Users/pauca/functions/test/test-8ea8f-44cd1f71944f.json');

describe('Cloud Functions', () => {
    test.mockConfig({ stripe: { key: '23wr42ewr34' }});
    let myFunctions = require("C:/Users/pauca/functions/index.js");

  before(() => {
    // Require index.js and save the exports inside a namespace called myFunctions.
    // This includes our cloud functions, which can now be accessed at myFunctions.makeUppercase
    // and myFunctions.addMessage
    myFunctions = require('../index.js');
  });

  after(() => {
    // Do cleanup tasks.
    test.cleanup();

  });
  describe('signup', () => {
    it('Should add a user into the firestore database', (done) => {
      // A fake request object, with req.query.text set to 'input'
      const req = { query: {un: 'input2',pw:'input2', n:'input2',lat:'1234',lon:'1234'} };
      // A fake response object, with a stubbed redirect function which does some assertions
      const res = {
        send: (code) =>{
            assert.equal(code,"-1");
            console.log("Molt bé maquina");
            done();
        }
        };


      // Invoke addMessage with our fake request and response objects. This will cause the
      // assertions in the response object to be evaluated.
      myFunctions.signup(req, res);
    });
  });
})
