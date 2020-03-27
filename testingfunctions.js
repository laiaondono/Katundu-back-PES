 describe('signup', () => {
    it('Should add a user into the firestore database', (done) => {
      const req = { query: {un: 'input3',pw:'input3', n:'input3',lat:'1234',lon:'1234'} };
      const res = {
        send: (code) =>{
            if(assert.equal(code,"0"))console.log("Tot ok");
            else 
            {
              console.log("Error, alguna cosa no ha anat bé. Codi : " + code);
            }
            done();
        }
        };
      myFunctions.signup(req, res);
    });
    it('Should NOT add a user into the firestore database', (done) => {
      const req = { query: {un: 'paucanosa',pw:'test', n:'test',lat:'test',lon:'test'} };
      const res = {
        send: (code) =>{
           if(assert.equal(code,"1"))console.log("Tot ok");
            else 
            {
              console.log("Error, alguna cosa no ha anat bé. Codi : " + code);
            }
            done();
        }
        };
      myFunctions.signup(req, res);
    });
  });
     
  describe('login', () => {
    it('Should login an existing user to the application', (done) => {
      // A fake request object, with req.query.un set to 'paula', and req.query.pw set to '123'
      const req = { query: {un: 'paula',pw:'123'} };
      // A fake response object, with a stubbed redirect function which does some assertions
      const res = {
        send: (code) =>{
            assert.equal(code,0);
            done();
        }
        };
      myFunctions.login(req, res);
    });

    it('Should detect the user does not exist and should NOT login to the application', (done) => {
      // A fake request object, with req.query.un set to 'paula', and req.query.pw set to '456'
      const req = { query: {un: 'paolo',pw:'123'} };
      // A fake response object, with a stubbed redirect function which does some assertions
      const res = {
        send: (code) =>{
            assert.equal(code,1);
            done();
        }
        };
      myFunctions.login(req, res);
    });

    it('Should detect the password is not correct and should NOT login to the application', (done) => {
      // A fake request object, with req.query.un set to 'paula', and req.query.pw set to '456'
      const req = { query: {un: 'paula',pw:'456'} };
      // A fake response object, with a stubbed redirect function which does some assertions
      const res = {
        send: (code) =>{
            assert.equal(code,2);
            done();
        }
        };
      myFunctions.login(req, res);
    });

  });

describe('deleteaccount', () => {
    let myFunctions;

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

    it("Should delete the user's data from the firestore database", () => {
        const req = { query: {un: 'laia'} };
        const res = {
            send: (code) =>{
                assert.equal(code,0);
                done();
            }
        };
        myFunctions.deleteaccount(req, res);
    });
});

describe('modify_credentials', () => {
    it('Should modify a user credentials into the firestore database', (done) => {
      const req = { query: {un: 'input3',pw:'input3', n:'input3',lat:'4321',lon:'4321'} };
      const res = {
        send: (code) =>{
            assert.equal(code,"0");
            done();
        }
        };
      myFunctions.modify_personal_credentials(req, res);
    });
    it('Should NOT modify a user credentials into the firestore database because the user doesnt exist', (done) => {
      const req = { query: {un: 'Adrian',pw:'test', n:'test',lat:'101010',lon:'101010'} };
      const res = {
        send: (code) =>{
           assert.equal(code,"1");
           done();
        }
        };
      myFunctions.modify_personal_credentials(req, res);
    });
  });
