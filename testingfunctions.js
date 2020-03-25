 describe('signup', () => {
    it('Should add a user into the firestore database', (done) => {
      // A fake request object, with req.query.text set to 'input'
      const req = { query: {un: 'input3',pw:'input3', n:'input3',lat:'1234',lon:'1234'} };
      // A fake response object, with a stubbed redirect function which does some assertions
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


      // Invoke addMessage with our fake request and response objects. This will cause the
      // assertions in the response object to be evaluated.
      myFunctions.signup(req, res);
    });
    it('Should NOT add a user into the firestore database', (done) => {
      // A fake request object, with req.query.text set to 'input'
      const req = { query: {un: 'paucanosa',pw:'test', n:'test',lat:'test',lon:'test'} };
      // A fake response object, with a stubbed redirect function which does some assertions
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


      // Invoke addMessage with our fake request and response objects. This will cause the
      // assertions in the response object to be evaluated.
      myFunctions.signup(req, res);
    });
  });
