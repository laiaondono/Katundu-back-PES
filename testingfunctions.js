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
  });
